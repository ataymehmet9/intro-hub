'use client'

import React, { useState } from 'react'
import { Card, Avatar, Badge, Button, Input } from '@/components/ui'
import { HiUser, HiArrowRight, HiCheck, HiXMark } from 'react-icons/hi2'
import { RequestCardProps } from '@/types/intro-hub'
import { DateFormat } from '../common'

const RequestCard: React.FC<RequestCardProps> = ({ request, type, onRespond }) => {
  const [showResponseForm, setShowResponseForm] = useState(false)
  const [responseMessage, setResponseMessage] = useState('')
  const [isResponding, setIsResponding] = useState(false)

  const handleApprove = async () => {
    if (!onRespond) return
    
    setIsResponding(true)
    try {
      await onRespond(request.id, 'approved', responseMessage || undefined)
      setShowResponseForm(false)
      setResponseMessage('')
    } catch (error) {
      console.error('Error approving request:', error)
    } finally {
      setIsResponding(false)
    }
  }

  const handleReject = async () => {
    if (!onRespond) return
    
    setIsResponding(true)
    try {
      await onRespond(request.id, 'rejected', responseMessage || undefined)
      setShowResponseForm(false)
      setResponseMessage('')
    } catch (error) {
      console.error('Error rejecting request:', error)
    } finally {
      setIsResponding(false)
    }
  }

  const getStatusBadge = () => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300', text: 'Pending' },
      approved: { color: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300', text: 'Approved' },
      rejected: { color: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300', text: 'Rejected' },
      completed: { color: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300', text: 'Completed' },
    }

    const config = statusConfig[request.status]
    return (
      <Badge className={`${config.color} px-3 py-1 rounded-full text-xs font-semibold`}>
        {config.text}
      </Badge>
    )
  }

  const stringToColor = (string: string): string => {
    let hash = 0
    for (let i = 0; i < string.length; i++) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash)
    }
    let color = '#'
    for (let i = 0; i < 3; i++) {
      const value = (hash >> (i * 8)) & 0xff
      color += `00${value.toString(16)}`.slice(-2)
    }
    return color
  }

  return (
    <Card className="mb-4" bodyClass="p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {type === 'sent' ? (
            <>
              <Avatar
                size={40}
                shape="circle"
                style={{ backgroundColor: stringToColor(request.connector.full_name) }}
                className="text-white font-semibold"
              >
                {request.connector.first_name.charAt(0)}
              </Avatar>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Requesting introduction to
                </p>
                <p className="font-semibold text-gray-900 dark:text-gray-100">
                  {request.target_contact.full_name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  via {request.connector.full_name}
                </p>
              </div>
            </>
          ) : (
            <>
              <Avatar
                size={40}
                shape="circle"
                style={{ backgroundColor: stringToColor(request.requester.full_name) }}
                className="text-white font-semibold"
              >
                {request.requester.first_name.charAt(0)}
              </Avatar>
              <div>
                <p className="font-semibold text-gray-900 dark:text-gray-100">
                  {request.requester.full_name}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  wants an introduction to
                </p>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {request.target_contact.full_name}
                </p>
              </div>
            </>
          )}
        </div>
        {getStatusBadge()}
      </div>

      {/* Request Flow Visualization */}
      <div className="flex items-center gap-2 mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div className="flex items-center gap-2 text-sm">
          <HiUser className="text-gray-400" />
          <span className="text-gray-700 dark:text-gray-300">
            {type === 'sent' ? 'You' : request.requester.full_name}
          </span>
        </div>
        <HiArrowRight className="text-gray-400" />
        <div className="flex items-center gap-2 text-sm">
          <HiUser className="text-gray-400" />
          <span className="text-gray-700 dark:text-gray-300">
            {type === 'sent' ? request.connector.full_name : 'You'}
          </span>
        </div>
        <HiArrowRight className="text-gray-400" />
        <div className="flex items-center gap-2 text-sm">
          <HiUser className="text-gray-400" />
          <span className="text-gray-700 dark:text-gray-300">
            {request.target_contact.full_name}
          </span>
        </div>
      </div>

      {/* Request Message */}
      <div className="mb-4">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Message:
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
          {request.message}
        </p>
      </div>

      {/* Response Message (if exists) */}
      {request.response_message && (
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Response:
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
            {request.response_message}
          </p>
        </div>
      )}

      {/* Action Buttons for Received Pending Requests */}
      {type === 'received' && request.status === 'pending' && onRespond && (
        <div className="space-y-3">
          {!showResponseForm ? (
            <div className="flex gap-3">
              <Button
                variant="solid"
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                icon={<HiCheck />}
                onClick={() => setShowResponseForm(true)}
                disabled={isResponding}
              >
                Approve
              </Button>
              <Button
                variant="default"
                className="flex-1 text-red-600 border-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                icon={<HiXMark />}
                onClick={handleReject}
                disabled={isResponding}
              >
                Reject
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <Input
                textArea
                rows={3}
                placeholder="Add an optional message with your response..."
                value={responseMessage}
                onChange={(e) => setResponseMessage(e.target.value)}
                disabled={isResponding}
              />
              <div className="flex gap-3">
                <Button
                  variant="solid"
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                  onClick={handleApprove}
                  loading={isResponding}
                  disabled={isResponding}
                >
                  Confirm Approval
                </Button>
                <Button
                  variant="default"
                  className="flex-1"
                  onClick={() => {
                    setShowResponseForm(false)
                    setResponseMessage('')
                  }}
                  disabled={isResponding}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Timestamp */}
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {type === 'sent' ? 'Sent' : 'Received'}{' '}
          <DateFormat date={request.created_at} format="relative" />
          {request.responded_at && (
            <>
              {' • Responded '}
              <DateFormat date={request.responded_at} format="relative" />
            </>
          )}
        </p>
      </div>
    </Card>
  )
}

export default RequestCard


