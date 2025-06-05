import api from "./api";

/**
 * Get introduction requests
 * @param {string} type - Request type ('sent', 'received', or undefined for all)
 * @param {Object} params - Query parameters (optional)
 * @returns {Promise} - API response with requests data
 */
export const getRequests = async (type, params = {}) => {
  const queryParams = { ...params };
  if (type) {
    queryParams.type = type;
  }

  const response = await api.get("/requests", { params: queryParams });
  return response.data;
};

/**
 * Get a single introduction request by ID
 * @param {number} id - Request ID
 * @returns {Promise} - API response with request data
 */
export const getRequest = async (id) => {
  const response = await api.get(`/requests/${id}`);
  return response.data;
};

/**
 * Create a new introduction request
 * @param {Object} requestData - Request data
 * @returns {Promise} - API response with new request data
 */
export const createRequest = async (requestData) => {
  const response = await api.post("/requests", requestData);
  return response.data;
};

/**
 * Update an existing request status
 * @param {number} id - Request ID
 * @param {Object} requestData - Request data to update (typically just status)
 * @returns {Promise} - API response with updated request data
 */
export const updateRequestStatus = async (id, requestData) => {
  const response = await api.patch(`/requests/${id}`, requestData);
  return response.data;
};

// /**
//  * Search for contacts that can be requested for introductions
//  * @param {string} query - Search query
//  * @returns {Promise} - API response with search results
//  */
// export const searchContacts = async (query) => {
//   const response = await api.get("/requests/search_contacts", {
//     params: { q: query },
//   });
//   return response.data;
// };

/**
 * Search for contacts that can be requested for introductions
 * @param {string} query - Search query
 * @returns {Promise} - API response with search results
 */
export const searchContacts = async (query) => {
  const response = await api.get("/users/all", {
    params: { q: query },
  });
  return response.data;
};
