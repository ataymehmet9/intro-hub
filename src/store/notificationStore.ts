import { create } from 'zustand'
import type { NotificationWithMetadata } from '@/schemas'

interface NotificationState {
  notifications: NotificationWithMetadata[]
  unreadCount: number
  isOpen: boolean
  isLoading: boolean

  // Actions
  setNotifications: (notifications: NotificationWithMetadata[]) => void
  addNotification: (notification: NotificationWithMetadata) => void
  markAsRead: (id: number) => void
  markAllAsRead: () => void
  removeNotification: (id: number) => void
  setUnreadCount: (count: number) => void
  setIsOpen: (isOpen: boolean) => void
  setIsLoading: (isLoading: boolean) => void
  reset: () => void
}

const initialState = {
  notifications: [],
  unreadCount: 0,
  isOpen: false,
  isLoading: false,
}

export const useNotificationStore = create<NotificationState>((set) => ({
  ...initialState,

  setNotifications: (notifications) =>
    set({
      notifications,
      unreadCount: notifications.filter((n) => !n.read).length,
    }),

  addNotification: (notification) =>
    set((state) => ({
      notifications: [notification, ...state.notifications],
      unreadCount: notification.read
        ? state.unreadCount
        : state.unreadCount + 1,
    })),

  markAsRead: (id) =>
    set((state) => {
      const updatedNotifications = state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n,
      )
      return {
        notifications: updatedNotifications,
        unreadCount: updatedNotifications.filter((n) => !n.read).length,
      }
    }),

  markAllAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
      unreadCount: 0,
    })),

  removeNotification: (id) =>
    set((state) => {
      const notification = state.notifications.find((n) => n.id === id)
      const updatedNotifications = state.notifications.filter(
        (n) => n.id !== id,
      )
      return {
        notifications: updatedNotifications,
        unreadCount:
          notification && !notification.read
            ? state.unreadCount - 1
            : state.unreadCount,
      }
    }),

  setUnreadCount: (count) => set({ unreadCount: count }),

  setIsOpen: (isOpen) => set({ isOpen }),

  setIsLoading: (isLoading) => set({ isLoading }),

  reset: () => set(initialState),
}))
