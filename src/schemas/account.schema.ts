import { z } from 'zod'

/**
 * Account Schema - Validation for account table
 */
export const accountSchema = z.object({
  id: z
    .string({ message: 'Account ID must be a string' })
    .min(1, { message: 'Account ID cannot be empty' }),
  accountId: z
    .string({ message: 'Account ID must be a string' })
    .min(1, { message: 'Account ID cannot be empty' }),
  providerId: z
    .string({ message: 'Provider ID must be a string' })
    .min(1, { message: 'Provider ID cannot be empty' }),
  userId: z
    .string({ message: 'User ID must be a string' })
    .min(1, { message: 'User ID cannot be empty' }),
  accessToken: z
    .string({ message: 'Access token must be a string' })
    .nullable()
    .optional(),
  refreshToken: z
    .string({ message: 'Refresh token must be a string' })
    .nullable()
    .optional(),
  idToken: z
    .string({ message: 'ID token must be a string' })
    .nullable()
    .optional(),
  accessTokenExpiresAt: z
    .date({ message: 'Access token expires at must be a date' })
    .nullable()
    .optional(),
  refreshTokenExpiresAt: z
    .date({ message: 'Refresh token expires at must be a date' })
    .nullable()
    .optional(),
  scope: z.string({ message: 'Scope must be a string' }).nullable().optional(),
  password: z
    .string({ message: 'Password must be a string' })
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
 * Account Insert Schema - For creating new accounts
 */
export const insertAccountSchema = accountSchema.omit({
  createdAt: true,
  updatedAt: true,
})

/**
 * Account Update Schema - For updating existing accounts
 */
export const updateAccountSchema = accountSchema
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  })
  .partial()

// Type exports
export type Account = z.infer<typeof accountSchema>
export type InsertAccount = z.infer<typeof insertAccountSchema>
export type UpdateAccount = z.infer<typeof updateAccountSchema>

// Made with Bob
