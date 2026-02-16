import { z } from 'zod'
import { TRPCRouterRecord, TRPCError } from '@trpc/server'
import { eq, and, or } from 'drizzle-orm'
import {
  insertIntroductionRequestSchema,
  updateRequestStatusSchema,
} from '@/schemas'
import { introductionRequests, contacts, user } from '@/db/schema'
import { protectedProcedure } from '../init'
import {
  sendIntroductionRequestEmail,
  sendIntroductionResponseEmail,
} from '@/services/email.functions'

const createIntroductionRequestSchema = insertIntroductionRequestSchema
  .omit({
    requesterId: true,
    approverId: true,
    status: true,
    responseMessage: true,
    createdAt: true,
    updatedAt: true,
  })
  .extend({
    targetContactId: z.number(),
    message: z
      .string()
      .min(10, { message: 'Message must be at least 10 characters' })
      .max(1000, { message: 'Message must be less than 1000 characters' })
      .trim(),
  })

const updateRequestStatusInputSchema = z.object({
  id: z.number(),
  data: updateRequestStatusSchema,
})

export const introductionRequestRouter = {
  create: protectedProcedure
    .input(createIntroductionRequestSchema)
    .mutation(async ({ input, ctx }) => {
      const { user: currentUser, db } = ctx

      if (!currentUser) {
        throw new TRPCError({ code: 'UNAUTHORIZED' })
      }

      const { targetContactId, message } = input

      // Get the target contact to find the owner (approver)
      const targetContact = await db
        .select()
        .from(contacts)
        .where(eq(contacts.id, targetContactId))
        .limit(1)

      if (!targetContact.length) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Contact not found',
        })
      }

      const contact = targetContact[0]

      // Verify the requester is not the contact owner
      if (contact.userId === currentUser.id) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'You cannot request an introduction to your own contact',
        })
      }

      // Check if there's already a pending request
      const existingRequest = await db
        .select()
        .from(introductionRequests)
        .where(
          and(
            eq(introductionRequests.targetContactId, targetContactId),
            eq(introductionRequests.requesterId, currentUser.id),
            eq(introductionRequests.status, 'pending'),
          ),
        )
        .limit(1)

      if (existingRequest.length > 0) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'You already have a pending request for this contact',
        })
      }

      // Create the introduction request
      const newRequest = await db
        .insert(introductionRequests)
        .values({
          requesterId: currentUser.id,
          approverId: contact.userId,
          targetContactId,
          message,
          status: 'pending',
        })
        .returning()

      // Get approver (contact owner) details for email
      const approver = await db
        .select()
        .from(user)
        .where(eq(user.id, contact.userId))
        .limit(1)

      // Send email notification to the approver (contact owner)
      // Email sending failures should not block the request creation
      if (approver.length > 0) {
        try {
          const dashboardUrl = `${process.env.APP_URL || 'http://localhost:3000'}/requests`

          await sendIntroductionRequestEmail({
            data: {
              to: approver[0].email,
              approverName: approver[0].name,
              requesterName: currentUser.name,
              requesterEmail: currentUser.email,
              requesterCompany: currentUser.company,
              requesterPosition: currentUser.position,
              contactName: contact.name,
              contactEmail: contact.email,
              message,
              dashboardUrl,
            },
          })
        } catch (error) {
          // Log error but don't fail the request
          console.error('Failed to send introduction request email:', {
            error,
            requestId: newRequest[0].id,
            timestamp: new Date().toISOString(),
          })
        }
      }

      return { success: true, data: newRequest[0] }
    }),

  listByUser: protectedProcedure.query(async ({ ctx }) => {
    const { user: currentUser, db } = ctx

    if (!currentUser) {
      throw new TRPCError({ code: 'UNAUTHORIZED' })
    }

    // Get all requests where user is either requester or approver
    const requests = await db
      .select({
        id: introductionRequests.id,
        message: introductionRequests.message,
        status: introductionRequests.status,
        responseMessage: introductionRequests.responseMessage,
        createdAt: introductionRequests.createdAt,
        updatedAt: introductionRequests.updatedAt,

        // Requester info
        requesterId: introductionRequests.requesterId,
        requesterName: user.name,
        requesterEmail: user.email,
        requesterCompany: user.company,

        // Target contact info
        targetContactId: contacts.id,
        targetContactName: contacts.name,
        targetContactEmail: contacts.email,
        targetContactCompany: contacts.company,
        targetContactPosition: contacts.position,
      })
      .from(introductionRequests)
      .innerJoin(user, eq(introductionRequests.requesterId, user.id))
      .innerJoin(
        contacts,
        eq(introductionRequests.targetContactId, contacts.id),
      )
      .where(
        or(
          eq(introductionRequests.requesterId, currentUser.id),
          eq(introductionRequests.approverId, currentUser.id),
        )!,
      )
      .orderBy(introductionRequests.createdAt)

    return { success: true, data: requests }
  }),

  updateStatus: protectedProcedure
    .input(updateRequestStatusInputSchema)
    .mutation(async ({ input, ctx }) => {
      const { user: currentUser, db } = ctx

      if (!currentUser) {
        throw new TRPCError({ code: 'UNAUTHORIZED' })
      }

      const { id, data } = input

      // Verify the request exists and user is the approver
      const existingRequest = await db
        .select()
        .from(introductionRequests)
        .where(
          and(
            eq(introductionRequests.id, id),
            eq(introductionRequests.approverId, currentUser.id),
          ),
        )
        .limit(1)

      if (!existingRequest.length) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message:
            'Request not found or you do not have permission to update it',
        })
      }

      const request = existingRequest[0]

      // Check if request is still pending
      if (request.status !== 'pending') {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'This request has already been processed',
        })
      }

      // Update the request status
      const updatedRequest = await db
        .update(introductionRequests)
        .set({
          status: data.status,
          responseMessage: data.responseMessage,
          updatedAt: new Date(),
        })
        .where(eq(introductionRequests.id, id))
        .returning()

      // Get requester details for email
      const requester = await db
        .select()
        .from(user)
        .where(eq(user.id, request.requesterId))
        .limit(1)

      // Get contact details for email
      const targetContact = await db
        .select()
        .from(contacts)
        .where(eq(contacts.id, request.targetContactId))
        .limit(1)

      // Send email notification to the requester
      // Email sending failures should not block the status update
      if (requester.length > 0 && targetContact.length > 0) {
        try {
          await sendIntroductionResponseEmail({
            data: {
              to: requester[0].email,
              requesterName: requester[0].name,
              approverName: currentUser.name,
              contactName: targetContact[0].name,
              status: data.status,
              responseMessage: data.responseMessage,
              contactEmail:
                data.status === 'approved' ? targetContact[0].email : null,
              contactCompany:
                data.status === 'approved' ? targetContact[0].company : null,
              contactPosition:
                data.status === 'approved' ? targetContact[0].position : null,
            },
          })
        } catch (error) {
          // Log error but don't fail the status update
          console.error('Failed to send introduction response email:', {
            error,
            requestId: id,
            status: data.status,
            timestamp: new Date().toISOString(),
          })
        }
      }

      return { success: true, data: updatedRequest[0] }
    }),
} satisfies TRPCRouterRecord

// Made with Bob
