import { z } from 'zod'
import { TRPCRouterRecord, TRPCError } from '@trpc/server'
import { eq, and, desc } from 'drizzle-orm'
import {
  getNotificationsSchema,
  markAsReadSchema,
  createNotificationInputSchema,
} from '@/schemas'
import { notifications } from '@/db/schema'
import { protectedProcedure } from '../init'
import { notificationEmitter } from '@/lib/notification-emitter'

export const notificationRouter = {
  /**
   * Get notifications for the current user
   */
  list: protectedProcedure
    .input(getNotificationsSchema)
    .query(async ({ input, ctx }) => {
      const { user: currentUser, db } = ctx

      if (!currentUser) {
        throw new TRPCError({ code: 'UNAUTHORIZED' })
      }

      const { limit, offset, unreadOnly } = input

      // Build query conditions
      const conditions = [eq(notifications.userId, currentUser.id)]

      if (unreadOnly) {
        conditions.push(eq(notifications.read, false))
      }

      // Fetch notifications
      const notificationList = await db
        .select()
        .from(notifications)
        .where(and(...conditions))
        .orderBy(desc(notifications.createdAt))
        .limit(limit)
        .offset(offset)

      // Parse metadata for each notification
      const parsedNotifications = notificationList.map((notification) => ({
        ...notification,
        parsedMetadata: notification.metadata
          ? JSON.parse(notification.metadata)
          : null,
      }))

      return parsedNotifications
    }),

  /**
   * Get unread notification count
   */
  getUnreadCount: protectedProcedure.query(async ({ ctx }) => {
    const { user: currentUser, db } = ctx

    if (!currentUser) {
      throw new TRPCError({ code: 'UNAUTHORIZED' })
    }

    const result = await db
      .select()
      .from(notifications)
      .where(
        and(
          eq(notifications.userId, currentUser.id),
          eq(notifications.read, false),
        ),
      )

    return {
      count: result.length,
      hasUnread: result.length > 0,
    }
  }),

  /**
   * Mark a notification as read
   */
  markAsRead: protectedProcedure
    .input(markAsReadSchema)
    .mutation(async ({ input, ctx }) => {
      const { user: currentUser, db } = ctx

      if (!currentUser) {
        throw new TRPCError({ code: 'UNAUTHORIZED' })
      }

      const { id } = input

      // Verify the notification belongs to the current user
      const notification = await db
        .select()
        .from(notifications)
        .where(eq(notifications.id, id))
        .limit(1)

      if (notification.length === 0) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Notification not found',
        })
      }

      if (notification[0].userId !== currentUser.id) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'You do not have permission to update this notification',
        })
      }

      // Update the notification
      const updated = await db
        .update(notifications)
        .set({ read: true })
        .where(eq(notifications.id, id))
        .returning()

      // Emit SSE event for real-time update
      notificationEmitter.emit('notification:read', {
        userId: currentUser.id,
        notificationId: id,
      })

      return updated[0]
    }),

  /**
   * Mark all notifications as read for the current user
   */
  markAllAsRead: protectedProcedure.mutation(async ({ ctx }) => {
    const { user: currentUser, db } = ctx

    if (!currentUser) {
      throw new TRPCError({ code: 'UNAUTHORIZED' })
    }

    await db
      .update(notifications)
      .set({ read: true })
      .where(
        and(
          eq(notifications.userId, currentUser.id),
          eq(notifications.read, false),
        ),
      )

    // Emit SSE event for real-time update
    notificationEmitter.emit('notification:all-read', {
      userId: currentUser.id,
    })

    return { success: true }
  }),

  /**
   * Create a notification (internal use)
   */
  create: protectedProcedure
    .input(createNotificationInputSchema)
    .mutation(async ({ input, ctx }) => {
      const { db } = ctx

      const { userId, type, title, message, relatedRequestId, metadata } = input

      // Create the notification
      const newNotification = await db
        .insert(notifications)
        .values({
          userId,
          type,
          title,
          message,
          relatedRequestId,
          metadata: metadata ? JSON.stringify(metadata) : null,
          read: false,
        })
        .returning()

      // Parse metadata for the SSE event
      const parsedNotification = {
        ...newNotification[0],
        parsedMetadata: metadata || undefined,
      }

      // Emit SSE event for real-time notification delivery
      notificationEmitter.emit('notification:created', {
        userId,
        notification: parsedNotification,
      })

      return newNotification[0]
    }),

  /**
   * Delete a notification
   */
  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const { user: currentUser, db } = ctx

      if (!currentUser) {
        throw new TRPCError({ code: 'UNAUTHORIZED' })
      }

      const { id } = input

      // Verify the notification belongs to the current user
      const notification = await db
        .select()
        .from(notifications)
        .where(eq(notifications.id, id))
        .limit(1)

      if (notification.length === 0) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Notification not found',
        })
      }

      if (notification[0].userId !== currentUser.id) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'You do not have permission to delete this notification',
        })
      }

      // Delete the notification
      await db.delete(notifications).where(eq(notifications.id, id))

      // Emit SSE event for real-time update
      notificationEmitter.emit('notification:deleted', {
        userId: currentUser.id,
        notificationId: id,
      })

      return { success: true }
    }),

  /**
   * Delete all read notifications for the current user
   */
  deleteAllRead: protectedProcedure.mutation(async ({ ctx }) => {
    const { user: currentUser, db } = ctx

    if (!currentUser) {
      throw new TRPCError({ code: 'UNAUTHORIZED' })
    }

    await db
      .delete(notifications)
      .where(
        and(
          eq(notifications.userId, currentUser.id),
          eq(notifications.read, true),
        ),
      )

    return { success: true }
  }),
} satisfies TRPCRouterRecord

// Made with Bob
