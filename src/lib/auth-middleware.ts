import { redirect } from '@tanstack/react-router'
import { createMiddleware } from '@tanstack/react-start'
import { getRequestHeaders } from '@tanstack/react-start/server'
import { auth } from '@/lib/auth'
import appConfig from '@/configs/app.config'

export const authMiddleware = createMiddleware().server(
  async ({ next, pathname }) => {
    const headers = getRequestHeaders()
    const session = await auth.api.getSession({ headers })

    if (!session) {
      throw redirect({ to: '/login', search: { redirect: pathname } })
    }

    return await next({
      context: {
        user: {
          id: session?.user?.id,
          name: session?.user?.name,
          image: session?.user?.image,
        },
      },
    })
  },
)

export const publicMiddleware = createMiddleware().server(async ({ next }) => {
  const headers = getRequestHeaders()
  const session = await auth.api.getSession({ headers })

  if (session) {
    throw redirect({ to: appConfig.authenticatedEntryPath })
  }

  return await next()
})
