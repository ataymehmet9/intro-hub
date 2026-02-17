import { useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { z } from 'zod'
import { AdaptiveCard, Container } from '@/components/shared'
import { Tabs } from '@/components/ui'
import { useSession } from '@/lib/auth-client'
import { useRequests } from './-hooks/useRequests'
import RequestsTable from './-components/RequestsTable'
import AcceptRequestModal from './-components/AcceptRequestModal'
import RejectRequestModal from './-components/RejectRequestModal'
import type { IntroductionRequestWithDetails } from './-store/requestStore'

const requestsSearchSchema = z.object({
  tab: z.enum(['received', 'sent']).optional().default('received'),
})

export const Route = createFileRoute('/_authenticated/(requests)/requests')({
  validateSearch: requestsSearchSchema,
  loader: async ({ context }) => {
    await context.queryClient.prefetchQuery(
      context.trpc.introductionRequests.listByUser.queryOptions(),
    )
  },
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate({ from: Route.fullPath })
  const { tab } = Route.useSearch()
  const { data: session } = useSession()
  const currentUserId = session?.user?.id

  const [acceptingRequest, setAcceptingRequest] =
    useState<IntroductionRequestWithDetails | null>(null)
  const [rejectingRequest, setRejectingRequest] =
    useState<IntroductionRequestWithDetails | null>(null)

  // Use the custom hook for requests management (without filtering, that's done in RequestsTable)
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

  const handleTabChange = (value: string) => {
    navigate({
      search: (prev) => ({ ...prev, tab: value as 'received' | 'sent' }),
    })
  }

  const isReceivedTab = tab === 'received'
  const showActions = isReceivedTab

  return (
    <>
      <Container>
        <AdaptiveCard>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
              <div>
                <h3>Introduction Requests</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {isReceivedTab
                    ? 'Manage introduction requests from your network'
                    : 'View introduction requests you have made'}
                </p>
              </div>
            </div>

            {/* Tabs Navigation */}
            <Tabs value={tab} onChange={handleTabChange}>
              <Tabs.TabList>
                <Tabs.TabNav value="received">Requests to Me</Tabs.TabNav>
                <Tabs.TabNav value="sent">Requests I Made</Tabs.TabNav>
              </Tabs.TabList>
            </Tabs>

            <RequestsTable
              onSelectAcceptRequest={setAcceptingRequest}
              onSelectRejectRequest={setRejectingRequest}
              showActions={showActions}
              filterType={tab}
              currentUserId={currentUserId}
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
