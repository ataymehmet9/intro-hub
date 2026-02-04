import { z } from 'zod'

/**
 * User Schema - Validation for user table
 */
export const userSchema = z.object({
  id: z
    .string({ message: 'User ID must be a string' })
    .min(1, { message: 'User ID cannot be empty' }),
  name: z
    .string({ message: 'Name must be a string' })
    .min(1, { message: 'Name cannot be empty' })
    .max(255, { message: 'Name must be less than 255 characters' }),
  email: z
    .string({ message: 'Email must be a string' })
    .email({ message: 'Please enter a valid email address' })
    .toLowerCase()
    .trim(),
  emailVerified: z
    .boolean({ message: 'Email verified must be a boolean' })
    .default(false),
  image: z
    .string({ message: 'Image must be a string' })
    .url({ message: 'Image must be a valid URL' })
    .nullable()
    .optional(),
  createdAt: z
    .date({ message: 'Created at must be a date' })
    .default(() => new Date()),
  updatedAt: z
    .date({ message: 'Updated at must be a date' })
    .default(() => new Date()),
})

/**
 * User Insert Schema - For creating new users
 */
export const insertUserSchema = userSchema.omit({
  createdAt: true,
  updatedAt: true,
})

/**
 * User Update Schema - For updating existing users
 */
export const updateUserSchema = userSchema
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  })
  .partial()

/**
 * User Public Schema - For public user data (excludes sensitive fields)
 */
export const publicUserSchema = userSchema.pick({
  id: true,
  name: true,
  email: true,
  image: true,
})

// Type exports
export type User = z.infer<typeof userSchema>
export type InsertUser = z.infer<typeof insertUserSchema>
export type UpdateUser = z.infer<typeof updateUserSchema>
export type PublicUser = z.infer<typeof publicUserSchema>

// Made with Bob
