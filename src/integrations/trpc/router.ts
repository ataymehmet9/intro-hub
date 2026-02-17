import { createTRPCRouter } from './init'
import {
  contactRouter,
  userRouter,
  searchRouter,
  introductionRequestRouter,
  notificationRouter,
  dashboardRouter,
} from './routes'

export const trpcRouter = createTRPCRouter({
  contacts: contactRouter,
  users: userRouter,
  search: searchRouter,
  introductionRequests: introductionRequestRouter,
  notifications: notificationRouter,
  dashboard: dashboardRouter,
})
export type TRPCRouter = typeof trpcRouter
