import { api } from './api'
import {
    IntroductionRequest,
    RequestFormData,
    PaginatedResponse,
} from '@/types/intro-hub'

// Requests API endpoints
const REQUESTS_ENDPOINTS = {
    LIST: '/requests',
    DETAIL: (id: number) => `/requests/${id}`,
    CREATE: '/requests',
}

// Get all requests (replaces getSentRequests and getReceivedRequests)
export const getRequests = async (params?: {
    page?: number
    page_size?: number
    status?: IntroductionRequest['status']
    ordering?: string
    type?: 'sent' | 'received' // Filter on frontend if needed
}): Promise<PaginatedResponse<IntroductionRequest>> => {
    const queryParams = new URLSearchParams()

    if (params) {
        Object.entries(params).forEach(([key, value]) => {
            if (
                value !== undefined &&
                value !== null &&
                value !== '' &&
                key !== 'type'
            ) {
                queryParams.append(key, value.toString())
            }
        })
    }

    const url = `${REQUESTS_ENDPOINTS.LIST}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
    const response = await api.get<PaginatedResponse<IntroductionRequest>>(url)
    return response
}

// Backward compatibility - Get sent requests
export const getSentRequests = async (params?: {
    page?: number
    page_size?: number
    status?: IntroductionRequest['status']
    ordering?: string
}): Promise<PaginatedResponse<IntroductionRequest>> => {
    return getRequests({ ...params, type: 'sent' })
}

// Backward compatibility - Get received requests
export const getReceivedRequests = async (params?: {
    page?: number
    page_size?: number
    status?: IntroductionRequest['status']
    ordering?: string
}): Promise<PaginatedResponse<IntroductionRequest>> => {
    return getRequests({ ...params, type: 'received' })
}

// Get single request
export const getRequest = async (id: number): Promise<IntroductionRequest> => {
    const response = await api.get<IntroductionRequest>(
        REQUESTS_ENDPOINTS.DETAIL(id),
    )
    return response
}

// Create new introduction request
export const createRequest = async (
    requestData: RequestFormData,
): Promise<IntroductionRequest> => {
    const response = await api.post<IntroductionRequest>(
        REQUESTS_ENDPOINTS.CREATE,
        requestData,
    )
    return response
}

// Update request (use for responding, canceling, completing, etc.)
export const updateRequest = async (
    id: number,
    data: Partial<IntroductionRequest>,
): Promise<IntroductionRequest> => {
    const response = await api.patch<IntroductionRequest>(
        REQUESTS_ENDPOINTS.DETAIL(id),
        data,
    )
    return response
}

// Respond to a request (approve/reject) - uses updateRequest
export const respondToRequest = async (
    id: number,
    status: 'approved' | 'rejected',
    responseMessage?: string,
): Promise<IntroductionRequest> => {
    return updateRequest(id, {
        status,
        response_message: responseMessage,
    } as Partial<IntroductionRequest>)
}

// Cancel a sent request (if still pending) - uses updateRequest with 'rejected' status
export const cancelRequest = async (
    id: number,
): Promise<IntroductionRequest> => {
    return updateRequest(id, {
        status: 'rejected',
    } as Partial<IntroductionRequest>)
}

// Mark request as completed - uses updateRequest
export const markRequestCompleted = async (
    id: number,
): Promise<IntroductionRequest> => {
    return updateRequest(id, {
        status: 'completed',
    } as Partial<IntroductionRequest>)
}

// Get requests by status - uses main getRequests with filter
export const getRequestsByStatus = async (
    status: IntroductionRequest['status'],
    type?: 'sent' | 'received',
): Promise<IntroductionRequest[]> => {
    const response = await getRequests({ status, type })
    return response.results
}

// Delete request
export const deleteRequest = async (id: number): Promise<void> => {
    await api.delete(REQUESTS_ENDPOINTS.DETAIL(id))
}

// Made with Bob
