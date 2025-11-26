'use client'

import React, { useState } from 'react'
import { Tabs } from '@/components/ui'
import { useRequests } from '@/contexts/RequestContext'
import { RequestCard } from '@/components/intro-hub/requests'
import { LoadingSpinner, NoData } from '@/components/intro-hub/common'
import { HiArrowsRightLeft } from 'react-icons/hi2'

export default function RequestsPage() {
  const { 
    sentRequests, 
    receivedRequests, 
    isLoading,
    respondToRequest 
  } = useRequests()
  
  const [activeTab, setActiveTab] = useState('received')

  const handleRespond = async (
    id: number,
    status: 'approved' | 'rejected',
    message?: string
  ) => {
    await respondToRequest(id, status, message)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" message="Loading requests..." />
      </div>
    )
  }

  const pendingReceived = (receivedRequests || []).filter(r => r.status === 'pending')
  const completedReceived = (receivedRequests || []).filter(r => r.status !== 'pending')
  const pendingSent = (sentRequests || []).filter(r => r.status === 'pending')
  const completedSent = (sentRequests || []).filter(r => r.status !== 'pending')

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Introduction Requests
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Manage your introduction requests and approvals
        </p>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onChange={setActiveTab}>
        <Tabs.TabList>
          <Tabs.TabNav value="received">
            Received ({(receivedRequests || []).length})
          </Tabs.TabNav>
          <Tabs.TabNav value="sent">
            Sent ({(sentRequests || []).length})
          </Tabs.TabNav>
        </Tabs.TabList>

        <div className="mt-6">
          <Tabs.TabContent value="received">
            <div className="space-y-6">
              {/* Pending Requests */}
              {pendingReceived.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                    Pending Approval ({pendingReceived.length})
                  </h3>
                  <div className="space-y-4">
                    {pendingReceived.map((request) => (
                      <RequestCard
                        key={request.id}
                        request={request}
                        type="received"
                        onRespond={handleRespond}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Completed Requests */}
              {completedReceived.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                    Completed ({completedReceived.length})
                  </h3>
                  <div className="space-y-4">
                    {completedReceived.map((request) => (
                      <RequestCard
                        key={request.id}
                        request={request}
                        type="received"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Empty State */}
              {(receivedRequests || []).length === 0 && (
                <NoData
                  icon={<HiArrowsRightLeft className="w-20 h-20" />}
                  title="No received requests"
                  message="You haven't received any introduction requests yet. When someone requests an introduction through you, it will appear here."
                />
              )}
            </div>
          </Tabs.TabContent>

          <Tabs.TabContent value="sent">
            <div className="space-y-6">
              {/* Pending Requests */}
              {pendingSent.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                    Pending ({pendingSent.length})
                  </h3>
                  <div className="space-y-4">
                    {pendingSent.map((request) => (
                      <RequestCard
                        key={request.id}
                        request={request}
                        type="sent"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Completed Requests */}
              {completedSent.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                    Completed ({completedSent.length})
                  </h3>
                  <div className="space-y-4">
                    {completedSent.map((request) => (
                      <RequestCard
                        key={request.id}
                        request={request}
                        type="sent"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Empty State */}
              {(sentRequests || []).length === 0 && (
                <NoData
                  icon={<HiArrowsRightLeft className="w-20 h-20" />}
                  title="No sent requests"
                  message="You haven't sent any introduction requests yet. Use the search feature to find contacts and request introductions."
                />
              )}
            </div>
          </Tabs.TabContent>
        </div>
      </Tabs>
    </div>
  )
}


