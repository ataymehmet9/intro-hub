import { createTRPCRouter } from './init'
import { contactRouter } from './routes'

export const trpcRouter = createTRPCRouter({
  contacts: contactRouter,
})
export type TRPCRouter = typeof trpcRouter
