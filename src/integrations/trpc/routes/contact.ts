import { z } from 'zod'
import { TRPCRouterRecord, TRPCError } from '@trpc/server'
import { eq, and, like, or, desc } from 'drizzle-orm'
import {
  contactSchema,
  insertContactSchema,
  updateContactSchema,
} from '@/schemas'
import { contacts } from '@/db/schema'

import { protectedProcedure } from '../init'

const listContactsSchema = contactSchema
  .pick({
    company: true,
  })
  .extend({
    search: z.string().optional(),
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
} satisfies TRPCRouterRecord
