import { useMemo, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useTRPC } from '@/integrations/trpc/react'
import { trpcClient } from '@/integrations/tanstack-query/root-provider'
import { Notification, toast } from '@/components/ui'

/**
 * Hook to manage notifications with real-time SSE updates
 * All server state is managed by TanStack Query cache
 */
export function useNotifications() {
  const trpc = useTRPC()
  const queryClient = useQueryClient()

  // Fetch notifications list (no polling, updated via SSE)
  const { data: notificationsResponse, isFetching: isLoading } = useQuery({
    ...trpc.notifications.list.queryOptions({
      unreadOnly: false,
    }),
    refetchOnWindowFocus: true,
  })

  // Get the actual query key being used by the query
  const notificationsQueryKey = trpc.notifications.list.queryKey({
    unreadOnly: false,
  })

  const unreadCountQueryKey = trpc.notifications.getUnreadCount.queryKey()

  // Extract notifications array from paginated response - memoized to prevent infinite loops
  const notifications = useMemo(
    () => notificationsResponse?.data || [],
    [notificationsResponse?.data],
  )

  // Fetch unread count (no polling, updated via SSE)
  const { data: unreadData } = useQuery({
    ...trpc.notifications.getUnreadCount.queryOptions(),
    refetchOnWindowFocus: true,
  })

  // Mark as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: (id: number) =>
      trpcClient.notifications.markAsRead.mutate({ id }),
    onMutate: async (id) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: notificationsQueryKey })
      await queryClient.cancelQueries({ queryKey: unreadCountQueryKey })

      // Snapshot the previous values
      const previousNotifications = queryClient.getQueryData(
        notificationsQueryKey,
      )
      const previousUnreadCount = queryClient.getQueryData(unreadCountQueryKey)

      // Optimistically update notifications list
      queryClient.setQueryData(notificationsQueryKey, (oldData: any) => {
        if (!oldData) return oldData
        return {
          ...oldData,
          data: oldData.data.map((n: any) =>
            n.id === id ? { ...n, read: true } : n,
          ),
        }
      })

      // Optimistically update unread count
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

      return { previousNotifications, previousUnreadCount }
    },
    onError: (error: Error, _id, context) => {
      // Rollback on error
      if (context?.previousNotifications) {
        queryClient.setQueryData(
          notificationsQueryKey,
          context.previousNotifications,
        )
      }
      if (context?.previousUnreadCount) {
        queryClient.setQueryData(
          unreadCountQueryKey,
          context.previousUnreadCount,
        )
      }

      toast.push(
        <Notification type="danger" title="Error">
          {error.message || 'Failed to mark notification as read'}
        </Notification>,
      )
    },
    // Don't invalidate on settled - let SSE handle real-time updates
    // This prevents race conditions between optimistic updates and SSE events
  })

  // Mark all as read mutation
  const markAllAsReadMutation = useMutation({
    mutationFn: () => trpcClient.notifications.markAllAsRead.mutate(),
    onMutate: async () => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: notificationsQueryKey })
      await queryClient.cancelQueries({ queryKey: unreadCountQueryKey })

      // Snapshot the previous values
      const previousNotifications = queryClient.getQueryData(
        notificationsQueryKey,
      )
      const previousUnreadCount = queryClient.getQueryData(unreadCountQueryKey)

      // Optimistically update notifications list
      queryClient.setQueryData(notificationsQueryKey, (oldData: any) => {
        if (!oldData) return oldData
        return {
          ...oldData,
          data: oldData.data.map((n: any) => ({ ...n, read: true })),
        }
      })

      // Optimistically update unread count
      queryClient.setQueryData(unreadCountQueryKey, {
        count: 0,
        hasUnread: false,
      })

      return { previousNotifications, previousUnreadCount }
    },
    onSuccess: () => {
      toast.push(
        <Notification type="success" title="Success">
          All notifications marked as read
        </Notification>,
      )
    },
    onError: (error: Error, _variables, context) => {
      // Rollback on error
      if (context?.previousNotifications) {
        queryClient.setQueryData(
          notificationsQueryKey,
          context.previousNotifications,
        )
      }
      if (context?.previousUnreadCount) {
        queryClient.setQueryData(
          unreadCountQueryKey,
          context.previousUnreadCount,
        )
      }

      toast.push(
        <Notification type="danger" title="Error">
          {error.message || 'Failed to mark all notifications as read'}
        </Notification>,
      )
    },
    // Don't invalidate on settled - let SSE handle real-time updates
    // This prevents race conditions between optimistic updates and SSE events
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

  return {
    notifications,
    pagination: notificationsResponse?.pagination,
    unreadCount: unreadData?.count || 0,
    hasUnread: unreadData?.hasUnread || false,
    isLoading,
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
 * Hook for UI-only notification state (e.g., dropdown open/closed)
 * This is the only local state that should exist - UI state only
 */
export function useNotificationUI() {
  const [isOpen, setIsOpen] = useState(false)

  return {
    isOpen,
    setIsOpen,
    toggleOpen: () => setIsOpen((prev) => !prev),
  }
}
