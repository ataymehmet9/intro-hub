import { z } from 'zod'
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from 'drizzle-zod'
import { introductionRequests } from '@/db/schema'

/**
 * Request Status Enum - Matches database enum
 */
export const requestStatusEnum = z.enum(['pending', 'approved', 'declined'], {
  message: 'Status must be one of: pending, approved, or declined',
})

/**
 * Introduction Request Schema - Validation for introduction_requests table
 */
/**
 * Base schema without refinements - used for creating derived schemas
 */
const baseIntroductionRequestSchema = createSelectSchema(introductionRequests)

/**
 * Introduction Request Schema - Full schema with refinements
 */
export const introductionRequestSchema = baseIntroductionRequestSchema.refine(
  (data) => data.requesterId !== data.approverId,
  {
    message: 'Requester and approver cannot be the same person',
    path: ['approverId'],
  },
)

/**
 * Introduction Request Insert Schema - For creating new requests
 */
export const insertIntroductionRequestSchema =
  createInsertSchema(introductionRequests)

/**
 * Introduction Request Update Schema - For updating existing requests
 */
export const updateIntroductionRequestSchema =
  createUpdateSchema(introductionRequests)

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
