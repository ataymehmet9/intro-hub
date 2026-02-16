import { createFileRoute } from '@tanstack/react-router'
import { auth } from '@/lib/auth'
import { sseManager } from '@/lib/sse-manager'
import { notificationEmitter } from '@/lib/notification-emitter'
import type {
  NotificationSSEEvent,
  HeartbeatSSEEvent,
  ConnectedSSEEvent,
} from '@/lib/sse-manager'

/**
 * SSE endpoint for real-time notifications
 * GET /api/notifications/stream
 */
async function handler({ request }: { request: Request }) {
  // Authenticate the user using Better Auth session
  const session = await auth.api.getSession({
    headers: request.headers,
  })

  if (!session?.user) {
    return new Response('Unauthorized', {
      status: 401,
      headers: {
        'Content-Type': 'text/plain',
      },
    })
  }

  const userId = session.user.id

  // Create a ReadableStream for SSE
  const stream = new ReadableStream({
    start(controller) {
      console.log(`[SSE] Starting stream for user ${userId}`)

      // Register this connection with the SSE manager
      sseManager.addConnection(userId, controller)

      // Send initial connection event
      const connectedEvent: ConnectedSSEEvent = {
        type: 'connected',
        data: {
          message: 'Connected to notification stream',
          timestamp: Date.now(),
        },
      }
      controller.enqueue(
        `event: ${connectedEvent.type}\ndata: ${JSON.stringify(connectedEvent.data)}\n\n`,
      )

      // Set up heartbeat to keep connection alive (every 30 seconds)
      const heartbeatInterval = setInterval(() => {
        try {
          const heartbeatEvent: HeartbeatSSEEvent = {
            type: 'heartbeat',
            data: {
              timestamp: Date.now(),
            },
          }
          controller.enqueue(
            `event: ${heartbeatEvent.type}\ndata: ${JSON.stringify(heartbeatEvent.data)}\n\n`,
          )
        } catch (error) {
          console.error(`[SSE] Heartbeat error for user ${userId}:`, error)
          clearInterval(heartbeatInterval)
          sseManager.removeConnection(userId, controller)
        }
      }, 30000) // 30 seconds

      // Listen for notification events
      const handleNotificationCreated = (data: {
        userId: string
        notification: any
      }) => {
        if (data.userId === userId) {
          try {
            const event: NotificationSSEEvent = {
              type: 'notification',
              data: {
                action: 'created',
                notification: data.notification,
              },
            }
            controller.enqueue(
              `event: ${event.type}\ndata: ${JSON.stringify(event.data)}\n\n`,
            )
          } catch (error) {
            console.error(
              `[SSE] Error sending notification:created to user ${userId}:`,
              error,
            )
          }
        }
      }

      const handleNotificationRead = (data: {
        userId: string
        notificationId: number
      }) => {
        if (data.userId === userId) {
          try {
            const event: NotificationSSEEvent = {
              type: 'notification',
              data: {
                action: 'read',
                notificationId: data.notificationId,
              },
            }
            controller.enqueue(
              `event: ${event.type}\ndata: ${JSON.stringify(event.data)}\n\n`,
            )
          } catch (error) {
            console.error(
              `[SSE] Error sending notification:read to user ${userId}:`,
              error,
            )
          }
        }
      }

      const handleNotificationDeleted = (data: {
        userId: string
        notificationId: number
      }) => {
        if (data.userId === userId) {
          try {
            const event: NotificationSSEEvent = {
              type: 'notification',
              data: {
                action: 'deleted',
                notificationId: data.notificationId,
              },
            }
            controller.enqueue(
              `event: ${event.type}\ndata: ${JSON.stringify(event.data)}\n\n`,
            )
          } catch (error) {
            console.error(
              `[SSE] Error sending notification:deleted to user ${userId}:`,
              error,
            )
          }
        }
      }

      const handleAllRead = (data: { userId: string }) => {
        if (data.userId === userId) {
          try {
            const event: NotificationSSEEvent = {
              type: 'notification',
              data: {
                action: 'all-read',
              },
            }
            controller.enqueue(
              `event: ${event.type}\ndata: ${JSON.stringify(event.data)}\n\n`,
            )
          } catch (error) {
            console.error(
              `[SSE] Error sending notification:all-read to user ${userId}:`,
              error,
            )
          }
        }
      }

      // Register event listeners
      notificationEmitter.on('notification:created', handleNotificationCreated)
      notificationEmitter.on('notification:read', handleNotificationRead)
      notificationEmitter.on('notification:deleted', handleNotificationDeleted)
      notificationEmitter.on('notification:all-read', handleAllRead)

      // Handle connection close
      request.signal.addEventListener('abort', () => {
        console.log(`[SSE] Connection aborted for user ${userId}`)
        clearInterval(heartbeatInterval)
        notificationEmitter.off(
          'notification:created',
          handleNotificationCreated,
        )
        notificationEmitter.off('notification:read', handleNotificationRead)
        notificationEmitter.off(
          'notification:deleted',
          handleNotificationDeleted,
        )
        notificationEmitter.off('notification:all-read', handleAllRead)
        sseManager.removeConnection(userId, controller)
        try {
          controller.close()
        } catch (error) {
          // Controller might already be closed
        }
      })
    },

    cancel() {
      console.log(`[SSE] Stream cancelled for user ${userId}`)
    },
  })

  // Return SSE response with proper headers
  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no', // Disable nginx buffering
    },
  })
}

export const Route = createFileRoute('/api/notifications/stream')({
  server: {
    handlers: {
      GET: handler,
    },
  },
})

// Made with Bob
