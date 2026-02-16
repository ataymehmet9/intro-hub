import { createTRPCRouter } from './init'
import {
  contactRouter,
  userRouter,
  searchRouter,
  introductionRequestRouter,
} from './routes'

export const trpcRouter = createTRPCRouter({
  contacts: contactRouter,
  users: userRouter,
  search: searchRouter,
  introductionRequests: introductionRequestRouter,
})
export type TRPCRouter = typeof trpcRouter
