import { z } from 'zod'
import { TRPCRouterRecord, TRPCError } from '@trpc/server'
import { eq, and, or } from 'drizzle-orm'
import {
  insertIntroductionRequestSchema,
  updateRequestStatusSchema,
} from '@/schemas'
import {
  introductionRequests,
  contacts,
  user,
  notifications,
} from '@/db/schema'
import { protectedProcedure } from '../init'
import {
  sendIntroductionRequestEmail,
  sendIntroductionResponseEmail,
  sendIntroductionEmail,
} from '@/services/email.functions'
import { notificationEmitter } from '@/lib/notification-emitter'

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

        // Create in-app notification for the approver
        try {
          const notificationMetadata = {
            requesterName: currentUser.name,
            requesterEmail: currentUser.email,
            contactName: contact.name,
            contactEmail: contact.email,
            requestId: newRequest[0].id,
          }

          const newNotification = await db
            .insert(notifications)
            .values({
              userId: approver[0].id,
              type: 'introduction_request',
              title: 'New Introduction Request',
              message: `${currentUser.name} wants to be introduced to ${contact.name}`,
              relatedRequestId: newRequest[0].id,
              metadata: JSON.stringify(notificationMetadata),
              read: false,
            })
            .returning()

          // Emit SSE event for real-time notification delivery
          if (newNotification.length > 0) {
            notificationEmitter.emit('notification:created', {
              userId: approver[0].id,
              notification: {
                ...newNotification[0],
                parsedMetadata: notificationMetadata,
              },
            })
          }
        } catch (error) {
          // Log error but don't fail the request
          console.error('Failed to create in-app notification:', {
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

        // Approver info
        approverId: introductionRequests.approverId,

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
        and(
          or(
            eq(introductionRequests.requesterId, currentUser.id),
            eq(introductionRequests.approverId, currentUser.id),
          )!,
          eq(introductionRequests.deleted, false),
        ),
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

      // Send email notification based on status
      // Email sending failures should not block the status update
      if (requester.length > 0 && targetContact.length > 0) {
        try {
          if (data.status === 'approved') {
            // Send introduction email to both contact (TO) and requester (CC)
            await sendIntroductionEmail({
              data: {
                to: targetContact[0].email, // Contact's email
                cc: requester[0].email, // Requester's email
                approverName: currentUser.name,
                requesterName: requester[0].name,
                requesterEmail: requester[0].email,
                requesterCompany: requester[0].company,
                requesterPosition: requester[0].position,
                contactName: targetContact[0].name,
                contactEmail: targetContact[0].email,
                contactCompany: targetContact[0].company,
                contactPosition: targetContact[0].position,
                customMessage: data.responseMessage,
              },
            })
          } else {
            // Send rejection email only to requester
            await sendIntroductionResponseEmail({
              data: {
                to: requester[0].email,
                requesterName: requester[0].name,
                approverName: currentUser.name,
                contactName: targetContact[0].name,
                status: data.status,
                responseMessage: data.responseMessage,
                contactEmail: null,
                contactCompany: null,
                contactPosition: null,
              },
            })
          }
        } catch (error) {
          // Log error but don't fail the status update
          console.error('Failed to send email:', {
            error,
            requestId: id,
            status: data.status,
            timestamp: new Date().toISOString(),
          })
        }

        // Create in-app notification for the requester
        try {
          const notificationTitle =
            data.status === 'approved'
              ? 'Introduction Request Approved'
              : 'Introduction Request Declined'

          const notificationMessage =
            data.status === 'approved'
              ? `${currentUser.name} approved your request to be introduced to ${targetContact[0].name}`
              : `${currentUser.name} declined your request to be introduced to ${targetContact[0].name}`

          const notificationMetadata = {
            approverName: currentUser.name,
            contactName: targetContact[0].name,
            contactEmail:
              data.status === 'approved' ? targetContact[0].email : undefined,
            requestId: id,
          }

          const newNotification = await db
            .insert(notifications)
            .values({
              userId: requester[0].id,
              type:
                data.status === 'approved'
                  ? 'introduction_approved'
                  : 'introduction_declined',
              title: notificationTitle,
              message: notificationMessage,
              relatedRequestId: id,
              metadata: JSON.stringify(notificationMetadata),
              read: false,
            })
            .returning()

          // Emit SSE event for real-time notification delivery
          if (newNotification.length > 0) {
            notificationEmitter.emit('notification:created', {
              userId: requester[0].id,
              notification: {
                ...newNotification[0],
                parsedMetadata: notificationMetadata,
              },
            })
          }
        } catch (error) {
          // Log error but don't fail the status update
          console.error('Failed to create in-app notification:', {
            error,
            requestId: id,
            status: data.status,
            timestamp: new Date().toISOString(),
          })
        }
      }

      return { success: true, data: updatedRequest[0] }
    }),

  softDelete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const { user: currentUser, db } = ctx

      if (!currentUser) {
        throw new TRPCError({ code: 'UNAUTHORIZED' })
      }

      const { id } = input

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
            'Request not found or you do not have permission to delete it',
        })
      }

      // Soft delete the request by setting deleted = true
      const deletedRequest = await db
        .update(introductionRequests)
        .set({
          deleted: true,
          updatedAt: new Date(),
        })
        .where(eq(introductionRequests.id, id))
        .returning()

      return { success: true, data: deletedRequest[0] }
    }),
} satisfies TRPCRouterRecord

// Made with Bob
