import { z } from 'zod'

/**
 * Request Status Enum - Matches database enum
 */
export const requestStatusEnum = z.enum(['pending', 'approved', 'declined'], {
  message: 'Status must be one of: pending, approved, or declined',
})

/**
 * Introduction Request Schema - Validation for introduction_requests table
 */
export const introductionRequestSchema = z
  .object({
    id: z
      .number({ message: 'Request ID must be a number' })
      .int({ message: 'Request ID must be an integer' })
      .positive({ message: 'Request ID must be positive' }),
    requesterId: z
      .string({ message: 'Requester ID must be a string' })
      .min(1, { message: 'Requester ID cannot be empty' }),
    approverId: z
      .string({ message: 'Approver ID must be a string' })
      .min(1, { message: 'Approver ID cannot be empty' }),
    targetContactId: z
      .number({ message: 'Target contact ID must be a number' })
      .int({ message: 'Target contact ID must be an integer' })
      .positive({ message: 'Target contact ID must be positive' }),
    message: z
      .string({ message: 'Message must be a string' })
      .min(1, { message: 'Message cannot be empty' })
      .max(5000, { message: 'Message must be less than 5000 characters' })
      .trim(),
    status: requestStatusEnum.default('pending'),
    responseMessage: z
      .string({ message: 'Response message must be a string' })
      .max(5000, {
        message: 'Response message must be less than 5000 characters',
      })
      .trim()
      .nullable()
      .optional(),
    createdAt: z
      .date({ message: 'Created at must be a date' })
      .default(() => new Date()),
    updatedAt: z
      .date({ message: 'Updated at must be a date' })
      .default(() => new Date()),
  })
  .refine((data) => data.requesterId !== data.approverId, {
    message: 'Requester and approver cannot be the same person',
    path: ['approverId'],
  })

/**
 * Introduction Request Insert Schema - For creating new requests
 */
export const insertIntroductionRequestSchema = introductionRequestSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})

/**
 * Introduction Request Update Schema - For updating existing requests
 */
export const updateIntroductionRequestSchema = introductionRequestSchema
  .omit({
    id: true,
    requesterId: true,
    approverId: true,
    targetContactId: true,
    createdAt: true,
    updatedAt: true,
  })
  .partial()

/**
 * Approve Request Schema - For approving requests
 */
export const approveRequestSchema = z.object({
  status: z.literal('approved', {
    message: 'Status must be approved',
  }),
  responseMessage: z
    .string({ message: 'Response message must be a string' })
    .min(1, { message: 'Response message is required when approving' })
    .max(5000, {
      message: 'Response message must be less than 5000 characters',
    })
    .trim(),
})

/**
 * Decline Request Schema - For declining requests
 */
export const declineRequestSchema = z.object({
  status: z.literal('declined', {
    message: 'Status must be declined',
  }),
  responseMessage: z
    .string({ message: 'Response message must be a string' })
    .min(1, { message: 'Response message is required when declining' })
    .max(5000, {
      message: 'Response message must be less than 5000 characters',
    })
    .trim(),
})

/**
 * Request Status Update Schema - For updating request status
 */
export const updateRequestStatusSchema = z.discriminatedUnion('status', [
  approveRequestSchema,
  declineRequestSchema,
])

// Type exports
export type IntroductionRequest = z.infer<typeof introductionRequestSchema>
export type InsertIntroductionRequest = z.infer<
  typeof insertIntroductionRequestSchema
>
export type UpdateIntroductionRequest = z.infer<
  typeof updateIntroductionRequestSchema
>
export type ApproveRequest = z.infer<typeof approveRequestSchema>
export type DeclineRequest = z.infer<typeof declineRequestSchema>
export type UpdateRequestStatus = z.infer<typeof updateRequestStatusSchema>
export type RequestStatus = z.infer<typeof requestStatusEnum>

// Made with Bob
