import { z } from 'zod'
import { TRPCRouterRecord, TRPCError } from '@trpc/server'
import { eq, and, like, or, desc } from 'drizzle-orm'
import {
  contactSchema,
  InsertContact,
  insertContactSchema,
  updateContactSchema,
} from '@/schemas'
import { contacts } from '@/db/schema'
import { parseCSV } from '@/utils/fileParser'
import { protectedProcedure } from '../init'

const listContactsSchema = contactSchema
  .pick({
    company: true,
  })
  .extend({
    search: z.string().optional(),
  })

const getContactByIdSchema = contactSchema.pick({
  id: true,
})

const createContactSchema = insertContactSchema.omit({
  userId: true,
})

const updateContactInputSchema = z.object({
  id: z.number(),
  data: updateContactSchema.omit({
    id: true,
    userId: true,
    createdAt: true,
    updatedAt: true,
  }),
})

export const contactRouter = {
  getById: protectedProcedure
    .input(getContactByIdSchema)
    .query(async ({ input, ctx }) => {
      const { user, db } = ctx

      if (!user) {
        throw new TRPCError({ code: 'UNAUTHORIZED' })
      }

      const { id } = input

      const existingContact = await db
        .select()
        .from(contacts)
        .where(and(eq(contacts.id, id), eq(contacts.userId, user.id)))
        .limit(1)

      if (!existingContact.length) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Contact not found or you do not have permission to view it',
        })
      }

      const [contact] = existingContact

      return contact
    }),
  list: protectedProcedure
    .input(listContactsSchema)
    .query(async ({ input, ctx }) => {
      const { user, db } = ctx

      if (!user) {
        throw new TRPCError({ code: 'UNAUTHORIZED' })
      }

      const { company, search } = input

      const conditions = [eq(contacts.userId, user.id)]

      if (search) {
        conditions.push(
          or(
            like(contacts.name, `%${search}%`),
            like(contacts.email, `%${search}%`),
            like(contacts.company, `%${search}%`),
          )!,
        )
      }

      if (company) {
        conditions.push(like(contacts.company, `%${company}%`))
      }

      const results = await db
        .select()
        .from(contacts)
        .where(and(...conditions))
        .orderBy(desc(contacts.createdAt))

      return results
    }),
  create: protectedProcedure
    .input(createContactSchema)
    .mutation(async ({ input, ctx }) => {
      const { user, db } = ctx

      if (!user) {
        throw new TRPCError({ code: 'UNAUTHORIZED' })
      }

      const newContact = await db
        .insert(contacts)
        .values({
          ...input,
          userId: user.id,
        })
        .returning()

      return newContact[0]
    }),
  update: protectedProcedure
    .input(updateContactInputSchema)
    .mutation(async ({ input, ctx }) => {
      const { user, db } = ctx

      if (!user) {
        throw new TRPCError({ code: 'UNAUTHORIZED' })
      }

      const { id, data } = input

      // Verify the contact belongs to the user
      const existingContact = await db
        .select()
        .from(contacts)
        .where(and(eq(contacts.id, id), eq(contacts.userId, user.id)))
        .limit(1)

      if (!existingContact.length) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message:
            'Contact not found or you do not have permission to update it',
        })
      }

      const updatedContact = await db
        .update(contacts)
        .set({
          ...data,
          updatedAt: new Date(),
        })
        .where(eq(contacts.id, id))
        .returning()

      return updatedContact[0]
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const { user, db } = ctx

      if (!user) {
        throw new TRPCError({ code: 'UNAUTHORIZED' })
      }

      const { id } = input

      // Verify the contact belongs to the user
      const existingContact = await db
        .select()
        .from(contacts)
        .where(and(eq(contacts.id, id), eq(contacts.userId, user.id)))
        .limit(1)

      if (!existingContact.length) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message:
            'Contact not found or you do not have permission to delete it',
        })
      }

      await db.delete(contacts).where(eq(contacts.id, id))

      return { success: true, id }
    }),
  batchUpload: protectedProcedure
    .input(
      z.object({
        csvContent: z.string().min(1, 'CSV content cannot be empty'),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { user, db } = ctx

      if (!user) {
        throw new TRPCError({ code: 'UNAUTHORIZED' })
      }

      const { csvContent } = input

      try {
        // Parse CSV content
        const rows = parseCSV(csvContent)

        if (rows.length === 0) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'No valid data rows found in CSV file',
          })
        }

        // Validate and prepare contacts for insertion
        const contactsToInsert: Array<InsertContact> = []

        const errors: Array<{ row: number; error: string }> = []

        for (let i = 0; i < rows.length; i++) {
          const row = rows[i]
          const rowNumber = i + 2 // +2 because row 1 is header, and we're 0-indexed

          try {
            // Validate required fields
            if (!row.email || !row.name) {
              errors.push({
                row: rowNumber,
                error: 'Missing required fields: email and name are required',
              })
              continue
            }

            // Basic email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            if (!emailRegex.test(row.email)) {
              errors.push({
                row: rowNumber,
                error: `Invalid email format: ${row.email}`,
              })
              continue
            }

            // Prepare contact object
            const contact: InsertContact = {
              userId: user.id,
              email: row.email,
              name: row.name,
            }

            // Add optional fields if present
            if (row.company) contact.company = row.company
            if (row.position) contact.position = row.position
            if (row.notes) contact.notes = row.notes
            if (row.phone) contact.phone = row.phone
            if (row.linkedinUrl) contact.linkedinUrl = row.linkedinUrl

            contactsToInsert.push(contact)
          } catch (error) {
            errors.push({
              row: rowNumber,
              error: error instanceof Error ? error.message : 'Unknown error',
            })
          }
        }

        // Insert all valid contacts
        let insertedCount = 0
        if (contactsToInsert.length > 0) {
          const inserted = await db
            .insert(contacts)
            .values(contactsToInsert)
            .returning()
          insertedCount = inserted.length
        }

        return {
          success: true,
          totalRows: rows.length,
          insertedCount,
          errorCount: errors.length,
          errors: errors.length > 0 ? errors : undefined,
        }
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message:
            error instanceof Error
              ? `Failed to process CSV: ${error.message}`
              : 'Failed to process CSV file',
        })
      }
    }),
} satisfies TRPCRouterRecord
