import { useEffect, useRef, useCallback, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useTRPC } from '@/integrations/trpc/react'
import type { NotificationWithMetadata } from '@/schemas'

/**
 * SSE connection status
 */
export type SSEConnectionStatus =
  | 'connecting'
  | 'connected'
  | 'disconnected'
  | 'error'

/**
 * SSE event data types
 */
interface NotificationEventData {
  action: 'created' | 'read' | 'deleted' | 'all-read'
  notification?: NotificationWithMetadata
  notificationId?: number
}

interface HeartbeatEventData {
  timestamp: number
}

interface ConnectedEventData {
  message: string
  timestamp: number
}

/**
 * Hook to manage SSE connection for real-time notifications
 * Implements exponential backoff reconnection strategy
 */
export function useNotificationSSE() {
  const queryClient = useQueryClient()
  const trpc = useTRPC()
  const eventSourceRef = useRef<EventSource | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const retryCountRef = useRef(0)
  const [connectionStatus, setConnectionStatus] =
    useState<SSEConnectionStatus>('disconnected')

  // Exponential backoff delays (in milliseconds)
  const RETRY_DELAYS = [1000, 2000, 4000, 8000, 16000, 30000] // 1s, 2s, 4s, 8s, 16s, 30s (max)

  // Query keys for cache invalidation - must match the keys used in useNotifications
  const notificationsQueryKey = trpc.notifications.list.queryKey({
    unreadOnly: false,
  })
  const unreadCountQueryKey = trpc.notifications.getUnreadCount.queryKey()

  /**
   * Handle notification:created event
   */
  const handleNotificationCreated = useCallback(
    (notification: NotificationWithMetadata) => {
      console.log('[SSE] Notification created:', notification)

      // Update notifications list in cache (paginated response)
      queryClient.setQueryData(notificationsQueryKey, (oldData: any) => {
        if (!oldData) {
          return {
            data: [notification],
            pagination: {
              page: 1,
              pageSize: 50,
              totalItems: 1,
              totalPages: 1,
              hasNextPage: false,
              hasPreviousPage: false,
            },
          }
        }
        // Add new notification at the beginning of data array
        const newData = [notification, ...oldData.data]
        return {
          ...oldData,
          data: newData,
          pagination: {
            ...oldData.pagination,
            totalItems: oldData.pagination.totalItems + 1,
            totalPages: Math.ceil(
              (oldData.pagination.totalItems + 1) / oldData.pagination.pageSize,
            ),
          },
        }
      })

      // Update unread count in cache
      if (!notification.read) {
        queryClient.setQueryData(
          unreadCountQueryKey,
          (oldData: { count: number; hasUnread: boolean } | undefined) => {
            const currentCount = oldData?.count || 0
            return {
              count: currentCount + 1,
              hasUnread: true,
            }
          },
        )
      }
    },
    [queryClient, notificationsQueryKey, unreadCountQueryKey],
  )

  /**
   * Handle notification:read event
   */
  const handleNotificationRead = useCallback(
    (notificationId: number) => {
      console.log('[SSE] Notification marked as read:', notificationId)

      // Update notification in cache (paginated response)
      queryClient.setQueryData(notificationsQueryKey, (oldData: any) => {
        if (!oldData) return oldData
        return {
          ...oldData,
          data: oldData.data.map((n: NotificationWithMetadata) =>
            n.id === notificationId ? { ...n, read: true } : n,
          ),
        }
      })

      // Update unread count in cache
      queryClient.setQueryData(
        unreadCountQueryKey,
        (oldData: { count: number; hasUnread: boolean } | undefined) => {
          const currentCount = oldData?.count || 0
          const newCount = Math.max(0, currentCount - 1)
          return {
            count: newCount,
            hasUnread: newCount > 0,
          }
        },
      )
    },
    [queryClient, notificationsQueryKey, unreadCountQueryKey],
  )

  /**
   * Handle notification:deleted event
   */
  const handleNotificationDeleted = useCallback(
    (notificationId: number) => {
      console.log('[SSE] Notification deleted:', notificationId)

      // Get the notification before removing it to check if it was unread (paginated response)
      const currentData = queryClient.getQueryData<any>(notificationsQueryKey)
      const deletedNotification = currentData?.data?.find(
        (n: NotificationWithMetadata) => n.id === notificationId,
      )

      // Remove notification from cache (paginated response)
      queryClient.setQueryData(notificationsQueryKey, (oldData: any) => {
        if (!oldData) return oldData
        const newData = oldData.data.filter(
          (n: NotificationWithMetadata) => n.id !== notificationId,
        )
        return {
          ...oldData,
          data: newData,
          pagination: {
            ...oldData.pagination,
            totalItems: Math.max(0, oldData.pagination.totalItems - 1),
            totalPages: Math.ceil(
              Math.max(0, oldData.pagination.totalItems - 1) /
                oldData.pagination.pageSize,
            ),
          },
        }
      })

      // Update unread count if the deleted notification was unread
      if (deletedNotification && !deletedNotification.read) {
        queryClient.setQueryData(
          unreadCountQueryKey,
          (oldData: { count: number; hasUnread: boolean } | undefined) => {
            const currentCount = oldData?.count || 0
            const newCount = Math.max(0, currentCount - 1)
            return {
              count: newCount,
              hasUnread: newCount > 0,
            }
          },
        )
      }
    },
    [queryClient, notificationsQueryKey, unreadCountQueryKey],
  )

  /**
   * Handle notification:all-read event
   */
  const handleAllRead = useCallback(() => {
    console.log('[SSE] All notifications marked as read')

    // Mark all notifications as read in cache (paginated response)
    queryClient.setQueryData(notificationsQueryKey, (oldData: any) => {
      if (!oldData) return oldData
      return {
        ...oldData,
        data: oldData.data.map((n: NotificationWithMetadata) => ({
          ...n,
          read: true,
        })),
      }
    })

    // Reset unread count
    queryClient.setQueryData(unreadCountQueryKey, {
      count: 0,
      hasUnread: false,
    })
  }, [queryClient, notificationsQueryKey, unreadCountQueryKey])

  /**
   * Connect to SSE endpoint
   */
  const connect = useCallback(() => {
    // Don't create multiple connections
    if (eventSourceRef.current) {
      return
    }

    console.log('[SSE] Connecting to notification stream...')
    setConnectionStatus('connecting')

    try {
      const eventSource = new EventSource('/api/notifications/stream', {
        withCredentials: true,
      })

      eventSourceRef.current = eventSource

      // Handle connection opened
      eventSource.addEventListener('open', () => {
        console.log('[SSE] Connection opened')
        setConnectionStatus('connected')
        retryCountRef.current = 0 // Reset retry count on successful connection
      })

      // Handle connected event
      eventSource.addEventListener('connected', (event) => {
        const data = JSON.parse(event.data) as ConnectedEventData
        console.log('[SSE] Connected:', data.message)
      })

      // Handle heartbeat events
      eventSource.addEventListener('heartbeat', (event) => {
        const data = JSON.parse(event.data) as HeartbeatEventData
        console.log('[SSE] Heartbeat received:', new Date(data.timestamp))
      })

      // Handle notification events
      eventSource.addEventListener('notification', (event) => {
        const data = JSON.parse(event.data) as NotificationEventData

        switch (data.action) {
          case 'created':
            if (data.notification) {
              handleNotificationCreated(data.notification)
            }
            break
          case 'read':
            if (data.notificationId) {
              handleNotificationRead(data.notificationId)
            }
            break
          case 'deleted':
            if (data.notificationId) {
              handleNotificationDeleted(data.notificationId)
            }
            break
          case 'all-read':
            handleAllRead()
            break
        }
      })

      // Handle errors
      eventSource.addEventListener('error', (error) => {
        console.error('[SSE] Connection error:', error)
        setConnectionStatus('error')

        // Close the connection
        eventSource.close()
        eventSourceRef.current = null

        // Attempt to reconnect with exponential backoff
        const delay =
          RETRY_DELAYS[Math.min(retryCountRef.current, RETRY_DELAYS.length - 1)]
        console.log(
          `[SSE] Reconnecting in ${delay}ms (attempt ${retryCountRef.current + 1})`,
        )

        reconnectTimeoutRef.current = setTimeout(() => {
          retryCountRef.current++
          connect()
        }, delay)
      })
    } catch (error) {
      console.error('[SSE] Failed to create EventSource:', error)
      setConnectionStatus('error')
    }
  }, [
    handleNotificationCreated,
    handleNotificationRead,
    handleNotificationDeleted,
    handleAllRead,
  ])

  /**
   * Disconnect from SSE endpoint
   */
  const disconnect = useCallback(() => {
    console.log('[SSE] Disconnecting...')

    // Clear reconnect timeout
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
      reconnectTimeoutRef.current = null
    }

    // Close EventSource connection
    if (eventSourceRef.current) {
      eventSourceRef.current.close()
      eventSourceRef.current = null
    }

    setConnectionStatus('disconnected')
    retryCountRef.current = 0
  }, [])

  /**
   * Set up SSE connection on mount and clean up on unmount
   */
  useEffect(() => {
    // Check if EventSource is supported
    if (!window.EventSource) {
      console.warn('[SSE] EventSource not supported in this browser')
      setConnectionStatus('error')
      return
    }

    // Connect to SSE
    connect()

    // Cleanup on unmount
    return () => {
      disconnect()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Empty deps - only run on mount/unmount

  return {
    connectionStatus,
    isConnected: connectionStatus === 'connected',
    isConnecting: connectionStatus === 'connecting',
    isDisconnected: connectionStatus === 'disconnected',
    hasError: connectionStatus === 'error',
    reconnect: connect,
    disconnect,
  }
}
