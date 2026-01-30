'use client'

import React, { createContext, useState, useEffect, ReactNode } from 'react'
import { toast, Notification as NotificationComponent } from '~/components/ui'
import {
  getSentRequests,
  getReceivedRequests,
  createRequest,
  respondToRequest as respondToRequestService
} from '~/services/requests'
import { RequestContextType, IntroductionRequest, RequestFormData } from '~/types/intro-hub'

// Create the context
export const RequestContext = createContext<RequestContextType | undefined>(undefined)

interface RequestProviderProps {
  children: ReactNode
}

export const RequestProvider: React.FC<RequestProviderProps> = ({ children }) => {
  const [sentRequests, setSentRequests] = useState<IntroductionRequest[]>([])
  const [receivedRequests, setReceivedRequests] = useState<IntroductionRequest[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch sent requests
  const fetchSentRequests = async (): Promise<void> => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await getSentRequests()
      setSentRequests(response.results)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch sent requests'
      setError(errorMessage)
      console.error('Error fetching sent requests:', err)
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch received requests
  const fetchReceivedRequests = async (): Promise<void> => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await getReceivedRequests()
      setReceivedRequests(response.results)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch received requests'
      setError(errorMessage)
      console.error('Error fetching received requests:', err)
    } finally {
      setIsLoading(false)
    }
  }

  // Create new request
  const createNewRequest = async (requestData: RequestFormData): Promise<IntroductionRequest> => {
    try {
      setIsLoading(true)
      setError(null)
      const newRequest = await createRequest(requestData)
      setSentRequests(prev => [newRequest, ...prev])
      
      toast.push(
        <NotificationComponent title="Success!" type="success">
          Introduction request sent successfully!
        </NotificationComponent>
      )
      
      return newRequest
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send request'
      setError(errorMessage)
      
      toast.push(
        <NotificationComponent title="Error" type="danger">
          <span className="capitalize">{errorMessage}</span>
        </NotificationComponent>
      )
      
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  // Respond to a request
  const respondToRequest = async (
    id: number, 
    status: 'approved' | 'rejected', 
    message?: string
  ): Promise<IntroductionRequest> => {
    try {
      setIsLoading(true)
      setError(null)
      const updatedRequest = await respondToRequestService(id, status, message)
      
      setReceivedRequests(prev => 
        prev.map(request => 
          request.id === id ? updatedRequest : request
        )
      )
      
      const statusText = status === 'approved' ? 'approved' : 'rejected'
      toast.push(
        <NotificationComponent title="Success!" type="success">
          Request {statusText} successfully!
        </NotificationComponent>
      )
      
      return updatedRequest
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to respond to request'
      setError(errorMessage)
      
      toast.push(
        <NotificationComponent title="Error" type="danger">
          <span className="capitalize">{errorMessage}</span>
        </NotificationComponent>
      )
      
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  // Initialize requests on mount
  useEffect(() => {
    fetchSentRequests()
    fetchReceivedRequests()
  }, [])

  // Context value
  const value: RequestContextType = {
    sentRequests,
    receivedRequests,
    isLoading,
    error,
    fetchSentRequests,
    fetchReceivedRequests,
    createRequest: createNewRequest,
    respondToRequest,
  }

  return <RequestContext.Provider value={value}>{children}</RequestContext.Provider>
}

// Custom hook to use request context
export const useRequests = (): RequestContextType => {
  const context = React.useContext(RequestContext)
  if (context === undefined) {
    throw new Error('useRequests must be used within a RequestProvider')
  }
  return context
}


