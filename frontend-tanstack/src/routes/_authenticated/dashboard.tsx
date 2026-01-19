import { createFileRoute, Link } from '@tanstack/react-router'
import React, { useEffect, useState } from 'react'
import { Card, Button, Tag, Table, Avatar } from '~/components/ui'
import classNames from '~/utils/classNames'
import {
  HiPlus,
  HiMagnifyingGlass,
  HiUsers,
  HiArrowsRightLeft,
  HiCheckCircle,
  HiClock
} from 'react-icons/hi2'
import { useAuth } from '~/contexts/AuthContext'
import { useContacts } from '~/contexts/ContactContext'
import { useRequests } from '~/contexts/RequestContext'
import { LoadingSpinner } from '~/components/intro-hub/common'
import type { IntroductionRequest } from '~/types/intro-hub'
import type { ReactNode } from 'react'

const { Tr, Td, TBody, THead, Th } = Table

type SummarySegmentProps = {
  title: string
  value: string | number | ReactNode
  icon: ReactNode
  iconClass: string
  className?: string
}

const SummarySegment = ({
  title,
  value,
  icon,
  iconClass,
  className,
}: SummarySegmentProps) => {
  return (
    <div className={classNames('flex flex-col gap-2 py-4 px-6', className)}>
      <div
        className={classNames(
          'flex items-center justify-center min-h-12 min-w-12 max-h-12 max-w-12 text-gray-900 rounded-full text-2xl',
          iconClass,
        )}
      >
        {icon}
      </div>
      <div className="mt-4">
        <div className="mb-1 text-sm">{title}</div>
        <h3 className="mb-1 text-2xl font-bold">{value}</h3>
      </div>
    </div>
  )
}

const requestStatus: Record<string, { label: string; className: string }> = {
  pending: { label: 'Pending', className: 'bg-orange-200' },
  approved: { label: 'Approved', className: 'bg-emerald-200' },
  rejected: { label: 'Rejected', className: 'bg-rose-200' },
  completed: { label: 'Completed', className: 'bg-sky-200' },
}

export const Route = createFileRoute('/_authenticated/dashboard')({
  component: DashboardPage,
})

function DashboardPage() {
  const { user } = useAuth()
  const { contacts, isLoading: contactsLoading } = useContacts()
  const { 
    sentRequests, 
    receivedRequests, 
    isLoading: requestsLoading 
  } = useRequests()

  const [pendingRequests, setPendingRequests] = useState<IntroductionRequest[]>([])
  const [recentRequests, setRecentRequests] = useState<IntroductionRequest[]>([])
  const [approvedCount, setApprovedCount] = useState(0)

  useEffect(() => {
    if (receivedRequests) {
      const pending = receivedRequests.filter(
        (request) => request.status === 'pending'
      )
      setPendingRequests(pending)
    }
  }, [receivedRequests])

  useEffect(() => {
    if (sentRequests && receivedRequests) {
      const allRequests = [...(sentRequests || []), ...(receivedRequests || [])]
      const recent = allRequests
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 5)
      setRecentRequests(recent)
      
      // Calculate stats
      const approved = allRequests.filter(r => r.status === 'approved').length
      setApprovedCount(approved)
    }
  }, [sentRequests, receivedRequests])

  const isLoading = contactsLoading || requestsLoading

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" message="Loading dashboard..." />
      </div>
    )
  }

  const totalRequests = (sentRequests?.length || 0) + (receivedRequests?.length || 0)

  return (
    <div className="flex flex-col gap-4">
      {/* Welcome Header */}
      <div className="mb-2">
        <h3 className="mb-1">Welcome back, {user?.first_name || 'User'}!</h3>
        <p className="text-gray-600 dark:text-gray-400">
          Here's what's happening with your network today.
        </p>
      </div>

      {/* KPI Summary */}
      <Card>
        <div className="flex items-center justify-between">
          <h4>Network Overview</h4>
          <div className="flex gap-2">
            <Link to="/contacts">
              <Button size="sm" variant="solid" icon={<HiPlus />}>
                Add Contact
              </Button>
            </Link>
          </div>
        </div>
        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4 mt-6">
          <SummarySegment
            title="Total Contacts"
            value={contacts?.length || 0}
            icon={<HiUsers />}
            iconClass="bg-blue-200"
            className="border-b border-r-0 md:border-b-0 md:ltr:border-r md:rtl:border-l border-gray-200 dark:border-gray-700"
          />
          <SummarySegment
            title="Total Introductions"
            value={totalRequests}
            icon={<HiArrowsRightLeft />}
            iconClass="bg-indigo-200"
            className="border-b md:border-b-0 xl:ltr:border-r xl:rtl:border-l border-gray-200 dark:border-gray-700"
          />
          <SummarySegment
            title="Pending Requests"
            value={pendingRequests.length}
            icon={<HiClock />}
            iconClass="bg-orange-200"
            className="border-b border-r-0 md:border-b-0 md:ltr:border-r md:rtl:border-l border-gray-200 dark:border-gray-700"
          />
          <SummarySegment
            title="Approved"
            value={approvedCount}
            icon={<HiCheckCircle />}
            iconClass="bg-emerald-200"
          />
        </div>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link to="/contacts" className="block">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <div className="p-6 flex items-center gap-4">
              <div className="flex items-center justify-center min-h-12 min-w-12 max-h-12 max-w-12 bg-blue-100 dark:bg-blue-900/20 rounded-full text-2xl text-blue-600 dark:text-blue-400">
                <HiUsers />
              </div>
              <div>
                <h5 className="font-semibold">Manage Contacts</h5>
                <p className="text-sm text-gray-600 dark:text-gray-400">View and organize your network</p>
              </div>
            </div>
          </Card>
        </Link>
        
        <Link to="/search" className="block">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <div className="p-6 flex items-center gap-4">
              <div className="flex items-center justify-center min-h-12 min-w-12 max-h-12 max-w-12 bg-indigo-100 dark:bg-indigo-900/20 rounded-full text-2xl text-indigo-600 dark:text-indigo-400">
                <HiMagnifyingGlass />
              </div>
              <div>
                <h5 className="font-semibold">Find Contacts</h5>
                <p className="text-sm text-gray-600 dark:text-gray-400">Search for new connections</p>
              </div>
            </div>
          </Card>
        </Link>
        
        <Link to="/requests" className="block">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <div className="p-6 flex items-center gap-4">
              <div className="flex items-center justify-center min-h-12 min-w-12 max-h-12 max-w-12 bg-purple-100 dark:bg-purple-900/20 rounded-full text-2xl text-purple-600 dark:text-purple-400">
                <HiArrowsRightLeft />
              </div>
              <div>
                <h5 className="font-semibold">Manage Requests</h5>
                <p className="text-sm text-gray-600 dark:text-gray-400">Review introduction requests</p>
              </div>
            </div>
          </Card>
        </Link>
      </div>

      {/* Recent Activity */}
      <Card>
        <div className="flex items-center justify-between">
          <h4>Recent Introduction Requests</h4>
          <Link to="/requests">
            <Button size="sm" variant="plain">
              View All
            </Button>
          </Link>
        </div>
        <div className="mt-6">
          {recentRequests.length > 0 ? (
            <Table hoverable={false}>
              <THead>
                <Tr>
                  <Th>From</Th>
                  <Th>To</Th>
                  <Th>Status</Th>
                  <Th>Message</Th>
                  <Th>Date</Th>
                </Tr>
              </THead>
              <TBody>
                {recentRequests.map((request) => (
                  <Tr key={request.id}>
                    <Td>
                      <div className="flex items-center gap-2">
                        <Avatar
                          className="bg-blue-100 dark:bg-blue-900/20"
                          size={35}
                          shape="circle"
                        >
                          <span className="text-blue-600 dark:text-blue-400 font-semibold">
                            {request.requester?.first_name?.charAt(0) || 'U'}
                          </span>
                        </Avatar>
                        <div>
                          <div className="font-semibold text-sm">
                            {request.requester?.first_name} {request.requester?.last_name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {request.requester?.email}
                          </div>
                        </div>
                      </div>
                    </Td>
                    <Td>
                      <div className="flex items-center gap-2">
                        <Avatar
                          className="bg-indigo-100 dark:bg-indigo-900/20"
                          size={35}
                          shape="circle"
                        >
                          <span className="text-indigo-600 dark:text-indigo-400 font-semibold">
                            {request.target_contact?.first_name?.charAt(0) || 'U'}
                          </span>
                        </Avatar>
                        <div>
                          <div className="font-semibold text-sm">
                            {request.target_contact?.first_name} {request.target_contact?.last_name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {request.target_contact?.email}
                          </div>
                        </div>
                      </div>
                    </Td>
                    <Td>
                      <Tag
                        className={classNames(
                          requestStatus[request.status]?.className || '',
                        )}
                      >
                        {requestStatus[request.status]?.label || request.status}
                      </Tag>
                    </Td>
                    <Td>
                      <div className="max-w-xs truncate text-sm">
                        {request.message || 'No message'}
                      </div>
                    </Td>
                    <Td>
                      <div className="text-sm whitespace-nowrap">
                        {new Date(request.created_at).toLocaleDateString()}
                      </div>
                    </Td>
                  </Tr>
                ))}
              </TBody>
            </Table>
          ) : (
            <div className="text-center py-12">
              <div className="flex justify-center mb-4">
                <div className="flex items-center justify-center h-16 w-16 bg-gray-100 dark:bg-gray-800 rounded-full">
                  <HiArrowsRightLeft className="text-3xl text-gray-400" />
                </div>
              </div>
              <h5 className="mb-2">No introduction requests yet</h5>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Start connecting with your network by requesting introductions
              </p>
              <Link to="/search">
                <Button variant="solid" icon={<HiMagnifyingGlass />}>
                  Find Contacts
                </Button>
              </Link>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}

// Made with Bob
