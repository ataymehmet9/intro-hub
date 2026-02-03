import type { Routes } from '@/@types/routes'

const authRoute: Routes = [
    {
        key: 'signIn',
        path: `/sign-in`,
        authority: [],
    },
    {
        key: 'signUp',
        path: `/sign-up`,
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
