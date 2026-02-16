import { createTRPCRouter } from './init'
import {
  contactRouter,
  userRouter,
  searchRouter,
  introductionRequestRouter,
  notificationRouter,
} from './routes'

export const trpcRouter = createTRPCRouter({
  contacts: contactRouter,
  users: userRouter,
  search: searchRouter,
  introductionRequests: introductionRequestRouter,
  notifications: notificationRouter,
})
export type TRPCRouter = typeof trpcRouter
