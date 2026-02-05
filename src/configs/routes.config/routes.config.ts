import authRoute from './authRoute'
import othersRoute from './othersRoute'
import type { Routes } from '@/@types/routes'

export const publicRoutes: Routes = [...authRoute]

export const protectedRoutes: Routes = [
  {
    key: 'dashboard',
    path: '/dashboard',
    authority: [],
  },
  ...othersRoute,
]
