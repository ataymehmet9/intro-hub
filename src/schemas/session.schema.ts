import { z } from 'zod'

/**
 * Session Schema - Validation for session table
 */
export const sessionSchema = z.object({
  id: z
    .string({ message: 'Session ID must be a string' })
    .min(1, { message: 'Session ID cannot be empty' }),
  expiresAt: z
    .date({ message: 'Expires at must be a date' })
    .refine((date) => date > new Date(), {
      message: 'Expiration date must be in the future',
    }),
  token: z
    .string({ message: 'Token must be a string' })
    .min(1, { message: 'Token cannot be empty' }),
  createdAt: z
    .date({ message: 'Created at must be a date' })
    .default(() => new Date()),
  updatedAt: z
    .date({ message: 'Updated at must be a date' })
    .default(() => new Date()),
  ipAddress: z
    .string({ message: 'IP address must be a string' })
    .regex(
      /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$|^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/,
      { message: 'Please enter a valid IP address' },
    )
    .nullable()
    .optional(),
  userAgent: z
    .string({ message: 'User agent must be a string' })
    .nullable()
    .optional(),
  userId: z
    .string({ message: 'User ID must be a string' })
    .min(1, { message: 'User ID cannot be empty' }),
})

/**
 * Session Insert Schema - For creating new sessions
 */
export const insertSessionSchema = sessionSchema.omit({
  createdAt: true,
  updatedAt: true,
})

/**
 * Session Update Schema - For updating existing sessions
 */
export const updateSessionSchema = sessionSchema
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  })
  .partial()

// Type exports
export type Session = z.infer<typeof sessionSchema>
export type InsertSession = z.infer<typeof insertSessionSchema>
export type UpdateSession = z.infer<typeof updateSessionSchema>

// Made with Bob
