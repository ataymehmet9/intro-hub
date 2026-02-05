import type { Routes } from '@/@types/routes'

const authRoute: Routes = [
  {
    key: 'signIn',
    path: `/login`,
    authority: [],
  },
  {
    key: 'signUp',
    path: `/signup`,
    authority: [],
  },
  {
    key: 'forgotPassword',
    path: `/forgot-password`,
    authority: [],
  },
  {
    key: 'resetPassword',
    path: `/reset-password`,
    authority: [],
  },
]

export default authRoute
