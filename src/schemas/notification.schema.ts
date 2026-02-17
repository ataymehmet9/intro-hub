import { z } from 'zod'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { notifications } from '@/db/schema'

/**
 * Notification Type Enum
 */
export const notificationTypeEnum = z.enum([
  'introduction_request',
  'introduction_approved',
  'introduction_declined',
])

/**
 * Base notification schema (from database)
 */
export const notificationSchema = createSelectSchema(notifications)

/**
 * Insert notification schema
 */
export const insertNotificationSchema = createInsertSchema(notifications, {
  type: notificationTypeEnum,
  title: z.string().min(1).max(255),
  message: z.string().min(1),
  read: z.boolean().default(false),
  metadata: z.string().optional(),
})

/**
 * Update notification schema
 */
export const updateNotificationSchema = notificationSchema
  .pick({
    read: true,
  })
  .partial()

/**
 * Mark notification as read schema
 */
export const markAsReadSchema = z.object({
  id: z.number(),
})

/**
 * Mark all notifications as read schema
 */
export const markAllAsReadSchema = z.object({
  userId: z.string(),
})

/**
 * Get notifications query schema
 */
export const getNotificationsSchema = z.object({
  limit: z.number().min(1).max(100).default(50),
  offset: z.number().min(0).default(0),
  unreadOnly: z.boolean().default(false),
})

/**
 * Notification metadata schema for type safety
 */
export const notificationMetadataSchema = z.object({
  requesterName: z.string().optional(),
  requesterEmail: z.string().optional(),
  contactName: z.string().optional(),
  contactEmail: z.string().optional(),
  requestId: z.number().optional(),
})

/**
 * Create notification input schema
 */
export const createNotificationInputSchema = z.object({
  userId: z.string(),
  type: notificationTypeEnum,
  title: z.string().min(1).max(255),
  message: z.string().min(1),
  relatedRequestId: z.number().optional(),
  metadata: notificationMetadataSchema.optional(),
})

/**
 * Notification with metadata parsed
 */
export const notificationWithMetadataSchema = notificationSchema.extend({
  parsedMetadata: notificationMetadataSchema.optional(),
})

// ============================================================================
// TypeScript Types
// ============================================================================

export type Notification = z.infer<typeof notificationSchema>
export type InsertNotification = z.infer<typeof insertNotificationSchema>
export type UpdateNotification = z.infer<typeof updateNotificationSchema>
export type MarkAsRead = z.infer<typeof markAsReadSchema>
export type MarkAllAsRead = z.infer<typeof markAllAsReadSchema>
export type GetNotifications = z.infer<typeof getNotificationsSchema>
export type NotificationMetadata = z.infer<typeof notificationMetadataSchema>
export type CreateNotificationInput = z.infer<
  typeof createNotificationInputSchema
>
export type NotificationWithMetadata = z.infer<
  typeof notificationWithMetadataSchema
>
export type NotificationType = z.infer<typeof notificationTypeEnum>
