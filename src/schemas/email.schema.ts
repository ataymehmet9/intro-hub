import { z } from 'zod'

export const forgotPasswordEmailSchema = z.object({
  to: z.email({ message: 'Please enter a valid email address' }),
  url: z.url({ message: 'Please enter a valid URL' }),
  token: z.string().min(1, { message: 'Please enter a valid token' }),
  from: z.email({ message: 'Invalid from email address' }).optional(),
})

export type ForgotPasswordEmail = z.infer<typeof forgotPasswordEmailSchema>
