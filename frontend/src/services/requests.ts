import api from "./api";

type Request = {
  id: number;
  sender: any;
  receiver: any;
  status: string;
  [key: string]: any;
};

/**
 * Get introduction requests
 * @param type - Request type ('sent', 'received', or undefined for all)
 * @param params - Query parameters (optional)
 * @returns API response with requests data
 */
export const getRequests = async (
  type?: string,
  params: Record<string, any> = {}
): Promise<Request[]> => {
  const queryParams = { ...params };
  if (type) {
    queryParams.type = type;
  }

  const response = await api.get<Request[]>("/requests", {
    params: queryParams,
  });
  return response.data;
};

/**
 * Get a single introduction request by ID
 * @param id - Request ID
 * @returns API response with request data
 */
export const getRequest = async (id: number): Promise<Request> => {
  const response = await api.get<Request>(`/requests/${id}`);
  return response.data;
};

/**
 * Create a new introduction request
 * @param requestData - Request data
 * @returns API response with new request data
 */
export const createRequest = async (
  requestData: Partial<Request>
): Promise<Request> => {
  console.log("REQUEST DATA:", requestData);
  const response = await api.post<Request>("/requests", requestData);
  return response.data;
};

/**
 * Update an existing request status
 * @param id - Request ID
 * @param requestData - Request data to update (typically just status)
 * @returns API response with updated request data
 */
export const updateRequestStatus = async (
  id: number,
  requestData: Partial<Request>
): Promise<Request> => {
  const response = await api.patch<Request>(`/requests/${id}`, requestData);
  return response.data;
};

/**
 * Search for contacts that can be requested for introductions
 * @param query - Search query
 * @returns API response with search results
 */
export const searchContacts = async (query: string): Promise<any[]> => {
  const response = await api.get<any[]>("/users/all", {
    params: { q: query },
  });
  console.log("RESPONSE DATA:::", response);
  return response.data;
};
