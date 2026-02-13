import { createFileRoute } from '@tanstack/react-router'
import { handleRequest } from '@better-upload/server'
import { router } from '@/integrations/better-upload/init'

export const Route = createFileRoute('/api/upload')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        return handleRequest(request, router)
      },
    },
  },
})
