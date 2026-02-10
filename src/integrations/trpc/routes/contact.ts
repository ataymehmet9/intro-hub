import { z } from 'zod'
import { TRPCRouterRecord, TRPCError } from '@trpc/server'
import { eq, and, like, or, desc } from 'drizzle-orm'
import { contactSchema, insertContactSchema } from '@/schemas'
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
} satisfies TRPCRouterRecord
