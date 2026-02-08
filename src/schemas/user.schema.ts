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
    .email({ message: 'Please enter a valid email address' })
    .toLowerCase()
    .trim(),
  emailVerified: z
    .boolean({ message: 'Email verified must be a boolean' })
    .default(false),
  image: z.url({ message: 'Image must be a valid URL' }).nullable().optional(),
  createdAt: z
    .date({ message: 'Created at must be a date' })
    .default(() => new Date()),
  updatedAt: z
    .date({ message: 'Updated at must be a date' })
    .default(() => new Date()),
})

export const userSignupSchema = z
  .object({
    name: z.string().min(1, { message: 'Name is required' }),
    email: z.email({ message: 'Please enter a valid email address' }),
    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters' }),
    confirmPassword: z
      .string()
      .min(8, { message: 'Confirm password must be at least 8 characters' }),
    company: z.string().optional(),
    position: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export type UserSignup = z.infer<typeof userSignupSchema>

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

export const userEmailSchema = userSchema.pick({
  email: true,
})

// Type exports
export type User = z.infer<typeof userSchema>
export type InsertUser = z.infer<typeof insertUserSchema>
export type UpdateUser = z.infer<typeof updateUserSchema>
export type PublicUser = z.infer<typeof publicUserSchema>
export type UserEmail = z.infer<typeof userEmailSchema>

// Made with Bob
