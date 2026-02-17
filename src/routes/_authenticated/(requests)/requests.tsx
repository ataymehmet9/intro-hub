import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { AdaptiveCard, Container } from '@/components/shared'
import { useRequests } from './-hooks/useRequests'
import RequestsTable from './-components/RequestsTable'
import AcceptRequestModal from './-components/AcceptRequestModal'
import RejectRequestModal from './-components/RejectRequestModal'
import type { IntroductionRequestWithDetails } from './-store/requestStore'

export const Route = createFileRoute('/_authenticated/(requests)/requests')({
  loader: async ({ context }) => {
    await context.queryClient.prefetchQuery(
      context.trpc.introductionRequests.listByUser.queryOptions(),
    )
  },
  component: RouteComponent,
})

function RouteComponent() {
  const [acceptingRequest, setAcceptingRequest] =
    useState<IntroductionRequestWithDetails | null>(null)
  const [rejectingRequest, setRejectingRequest] =
    useState<IntroductionRequestWithDetails | null>(null)

  // Use the custom hook for requests management
  const { acceptRequest, rejectRequest } = useRequests({
    onAcceptSuccess: () => setAcceptingRequest(null),
    onRejectSuccess: () => setRejectingRequest(null),
  })

  const handleAcceptRequest = async (customMessage: string) => {
    if (acceptingRequest) {
      await acceptRequest({
        id: acceptingRequest.id,
        customMessage,
      })
    }
  }

  const handleRejectRequest = async (customMessage: string) => {
    if (rejectingRequest) {
      await rejectRequest({
        id: rejectingRequest.id,
        customMessage,
      })
    }
  }

  return (
    <>
      <Container>
        <AdaptiveCard>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
              <div>
                <h3>Introduction Requests</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Manage introduction requests from your network
                </p>
              </div>
            </div>
            <RequestsTable
              onSelectAcceptRequest={setAcceptingRequest}
              onSelectRejectRequest={setRejectingRequest}
            />
          </div>
        </AdaptiveCard>
      </Container>

      {/* Accept Request Modal */}
      <AcceptRequestModal
        isOpen={!!acceptingRequest}
        onClose={() => setAcceptingRequest(null)}
        request={acceptingRequest}
        onSubmit={handleAcceptRequest}
      />

      {/* Reject Request Modal */}
      <RejectRequestModal
        isOpen={!!rejectingRequest}
        onClose={() => setRejectingRequest(null)}
        request={rejectingRequest}
        onSubmit={handleRejectRequest}
      />
    </>
  )
}

// Made with Bob
