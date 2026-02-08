import { createServerFn } from '@tanstack/react-start'
import { userEmailSchema } from '@/schemas'
import { authClient } from '@/lib/auth-client'
import appConfig from '@/configs/app.config'

export const requestPasswordReset = createServerFn({ method: 'POST' })
  .inputValidator(userEmailSchema)
  .handler(async ({ data }) => {
    const { email } = data

    return authClient.requestPasswordReset({
      email,
      redirectTo: `${process.env.BETTER_AUTH_URL}${appConfig.authPaths.resetPassword}`,
    })
  })
