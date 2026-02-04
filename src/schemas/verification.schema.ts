import { z } from 'zod'

/**
 * Verification Schema - Validation for verification table
 */
export const verificationSchema = z.object({
  id: z
    .string({ message: 'Verification ID must be a string' })
    .min(1, { message: 'Verification ID cannot be empty' }),
  identifier: z
    .string({ message: 'Identifier must be a string' })
    .min(1, { message: 'Identifier cannot be empty' }),
  value: z
    .string({ message: 'Value must be a string' })
    .min(1, { message: 'Value cannot be empty' }),
  expiresAt: z
    .date({ message: 'Expires at must be a date' })
    .refine((date) => date > new Date(), {
      message: 'Expiration date must be in the future',
    }),
  createdAt: z
    .date({ message: 'Created at must be a date' })
    .default(() => new Date()),
  updatedAt: z
    .date({ message: 'Updated at must be a date' })
    .default(() => new Date()),
})

/**
 * Verification Insert Schema - For creating new verifications
 */
export const insertVerificationSchema = verificationSchema.omit({
  createdAt: true,
  updatedAt: true,
})

/**
 * Verification Update Schema - For updating existing verifications
 */
export const updateVerificationSchema = verificationSchema
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  })
  .partial()

// Type exports
export type Verification = z.infer<typeof verificationSchema>
export type InsertVerification = z.infer<typeof insertVerificationSchema>
export type UpdateVerification = z.infer<typeof updateVerificationSchema>

// Made with Bob
