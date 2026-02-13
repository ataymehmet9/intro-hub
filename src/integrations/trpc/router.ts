import { createTRPCRouter } from './init'
import { contactRouter, userRouter } from './routes'

export const trpcRouter = createTRPCRouter({
  contacts: contactRouter,
  users: userRouter,
})
export type TRPCRouter = typeof trpcRouter
