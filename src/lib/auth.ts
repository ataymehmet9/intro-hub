import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { tanstackStartCookies } from 'better-auth/tanstack-start'
import { db } from '@/db'
import { sendForgotPasswordEmail } from '@/services/email.functions'

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
  }),
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ['linkedin', 'google', 'microsoft'],
    },
  },
  user: {
    additionalFields: {
      company: {
        type: 'string',
        required: false,
      },
      position: {
        type: 'string',
        required: false,
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url, token }) => {
      sendForgotPasswordEmail({ data: { to: user.email, url, token } })
    },
  },
  plugins: [tanstackStartCookies()],
})
