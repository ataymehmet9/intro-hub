import { TRPCRouterRecord, TRPCError } from '@trpc/server'
import { eq } from 'drizzle-orm'
import { updateUserSchema } from '@/schemas'
import { user as userDb } from '@/db/schema'
import { protectedProcedure } from '../init'

export const userRouter = {
  update: protectedProcedure
    .input(updateUserSchema)
    .mutation(async ({ input, ctx }) => {
      const { user, db } = ctx

      if (!user) {
        throw new TRPCError({ code: 'UNAUTHORIZED' })
      }

      return await db
        .update(userDb)
        .set(input)
        .where(eq(userDb.id, user.id))
        .returning()
    }),
} satisfies TRPCRouterRecord
