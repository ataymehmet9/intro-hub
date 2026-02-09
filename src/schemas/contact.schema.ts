import { z } from 'zod'

/**
 * Contact Schema - Validation for contacts table
 */
export const contactSchema = z.object({
  id: z
    .number({ message: 'Contact ID must be a number' })
    .int({ message: 'Contact ID must be an integer' })
    .positive({ message: 'Contact ID must be positive' }),
  userId: z
    .string({ message: 'User ID must be a string' })
    .min(1, { message: 'User ID cannot be empty' }),
  email: z
    .string({ message: 'Email must be a string' })
    .email({ message: 'Please enter a valid email address' })
    .max(255, { message: 'Email must be less than 255 characters' })
    .toLowerCase()
    .trim(),
  name: z
    .string({ message: 'Name must be a string' })
    .min(1, { message: 'Name cannot be empty' })
    .max(200, { message: 'Name must be less than 100 characters' })
    .trim(),
  company: z
    .string({ message: 'Company must be a string' })
    .max(255, { message: 'Company must be less than 255 characters' })
    .trim()
    .nullable()
    .optional(),
  position: z
    .string({ message: 'Position must be a string' })
    .max(255, { message: 'Position must be less than 255 characters' })
    .trim()
    .nullable()
    .optional(),
  notes: z.string({ message: 'Notes must be a string' }).nullable().optional(),
  phone: z
    .string({ message: 'Phone must be a string' })
    .max(50, { message: 'Phone must be less than 50 characters' })
    .regex(/^[\d\s\-\+\(\)]+$/, {
      message: 'Phone number can only contain digits, spaces, and +()-',
    })
    .trim()
    .nullable()
    .optional(),
  linkedinUrl: z
    .string({ message: 'LinkedIn URL must be a string' })
    .url({ message: 'Please enter a valid URL' })
    .max(255, { message: 'LinkedIn URL must be less than 255 characters' })
    .refine((url) => url.includes('linkedin.com'), {
      message: 'URL must be a LinkedIn profile',
    })
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
 * Contact Insert Schema - For creating new contacts
 */
export const insertContactSchema = contactSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})

/**
 * Contact Update Schema - For updating existing contacts
 */
export const updateContactSchema = contactSchema
  .omit({
    id: true,
    userId: true,
    createdAt: true,
    updatedAt: true,
  })
  .partial()

/**
 * Contact with full name - Computed field
 */
export const contactWithFullNameSchema = contactSchema.extend({
  fullName: z.string(),
})

// Type exports
export type Contact = z.infer<typeof contactSchema>
export type InsertContact = z.infer<typeof insertContactSchema>
export type UpdateContact = z.infer<typeof updateContactSchema>
export type ContactWithFullName = z.infer<typeof contactWithFullNameSchema>

// Made with Bob
