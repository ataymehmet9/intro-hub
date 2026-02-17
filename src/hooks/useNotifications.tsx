import { useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useTRPC } from '@/integrations/trpc/react'
import { trpcClient } from '@/integrations/tanstack-query/root-provider'
import { useNotificationStore } from '@/store/notificationStore'
import { Notification, toast } from '@/components/ui'
import { useNotificationSSE } from './useNotificationSSE'

/**
 * Hook to manage notifications with real-time SSE updates
 */
export function useNotifications() {
  const trpc = useTRPC()
  const queryClient = useQueryClient()
  const {
    setNotifications,
    setUnreadCount,
    setIsLoading,
    markAsRead: markAsReadInStore,
    markAllAsRead: markAllAsReadInStore,
  } = useNotificationStore()

  const notificationsQueryKey = trpc.notifications.list.queryKey({
    limit: 50,
    offset: 0,
    unreadOnly: false,
  })

  const unreadCountQueryKey = trpc.notifications.getUnreadCount.queryKey()

  // Establish SSE connection for real-time updates
  const { connectionStatus, isConnected } = useNotificationSSE()

  // Fetch notifications list (no polling, updated via SSE)
  const { data: notifications, isFetching: isLoading } = useQuery({
    ...trpc.notifications.list.queryOptions({
      limit: 50,
      offset: 0,
      unreadOnly: false,
    }),
    refetchOnWindowFocus: true,
  })

  // Fetch unread count (no polling, updated via SSE)
  const { data: unreadData } = useQuery({
    ...trpc.notifications.getUnreadCount.queryOptions(),
    refetchOnWindowFocus: true,
  })

  // Mark as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: (id: number) =>
      trpcClient.notifications.markAsRead.mutate({ id }),
    onSuccess: (_data, id) => {
      markAsReadInStore(id)
      queryClient.invalidateQueries({ queryKey: unreadCountQueryKey })
    },
    onError: (error: Error) => {
      toast.push(
        <Notification type="danger" title="Error">
          {error.message || 'Failed to mark notification as read'}
        </Notification>,
      )
    },
  })

  // Mark all as read mutation
  const markAllAsReadMutation = useMutation({
    mutationFn: () => trpcClient.notifications.markAllAsRead.mutate(),
    onSuccess: () => {
      markAllAsReadInStore()
      queryClient.invalidateQueries({ queryKey: notificationsQueryKey })
      queryClient.invalidateQueries({ queryKey: unreadCountQueryKey })
      toast.push(
        <Notification type="success" title="Success">
          All notifications marked as read
        </Notification>,
      )
    },
    onError: (error: Error) => {
      toast.push(
        <Notification type="danger" title="Error">
          {error.message || 'Failed to mark all notifications as read'}
        </Notification>,
      )
    },
  })

  // Delete notification mutation
  const deleteNotificationMutation = useMutation({
    mutationFn: (id: number) => trpcClient.notifications.delete.mutate({ id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationsQueryKey })
      queryClient.invalidateQueries({ queryKey: unreadCountQueryKey })
    },
    onError: (error: Error) => {
      toast.push(
        <Notification type="danger" title="Error">
          {error.message || 'Failed to delete notification'}
        </Notification>,
      )
    },
  })

  // Delete all read notifications mutation
  const deleteAllReadMutation = useMutation({
    mutationFn: () => trpcClient.notifications.deleteAllRead.mutate(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationsQueryKey })
      toast.push(
        <Notification type="success" title="Success">
          All read notifications deleted
        </Notification>,
      )
    },
    onError: (error: Error) => {
      toast.push(
        <Notification type="danger" title="Error">
          {error.message || 'Failed to delete notifications'}
        </Notification>,
      )
    },
  })

  // Update store when data changes
  useEffect(() => {
    if (notifications) {
      setNotifications(notifications)
    }
  }, [notifications, setNotifications])

  useEffect(() => {
    if (unreadData) {
      setUnreadCount(unreadData.count)
    }
  }, [unreadData, setUnreadCount])

  useEffect(() => {
    setIsLoading(isLoading)
  }, [isLoading, setIsLoading])

  return {
    notifications: notifications || [],
    unreadCount: unreadData?.count || 0,
    hasUnread: unreadData?.hasUnread || false,
    isLoading,
    connectionStatus,
    isConnected,
    markAsRead: (id: number) => markAsReadMutation.mutate(id),
    markAllAsRead: () => markAllAsReadMutation.mutate(),
    deleteNotification: (id: number) => deleteNotificationMutation.mutate(id),
    deleteAllRead: () => deleteAllReadMutation.mutate(),
    refetch: () => {
      queryClient.invalidateQueries({ queryKey: notificationsQueryKey })
      queryClient.invalidateQueries({ queryKey: unreadCountQueryKey })
    },
  }
}

/**
 * Hook to get notification store state without fetching
 */
export function useNotificationState() {
  return useNotificationStore()
}
