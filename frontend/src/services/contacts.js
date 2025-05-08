import api from './api';

/**
 * Get all contacts
 * @param {Object} params - Query parameters (optional)
 * @returns {Promise} - API response with contacts data
 */
export const getContacts = async (params = {}) => {
  const response = await api.get('/contacts/', { params });
  return response.data;
};

/**
 * Get a single contact by ID
 * @param {number} id - Contact ID
 * @returns {Promise} - API response with contact data
 */
export const getContact = async (id) => {
  const response = await api.get(`/contacts/${id}/`);
  return response.data;
};

/**
 * Create a new contact
 * @param {Object} contactData - Contact data
 * @returns {Promise} - API response with new contact data
 */
export const createContact = async (contactData) => {
  const response = await api.post('/contacts/', contactData);
  return response.data;
};

/**
 * Update an existing contact
 * @param {number} id - Contact ID
 * @param {Object} contactData - Contact data to update
 * @returns {Promise} - API response with updated contact data
 */
export const updateContact = async (id, contactData) => {
  const response = await api.patch(`/contacts/${id}/`, contactData);
  return response.data;
};

/**
 * Delete a contact
 * @param {number} id - Contact ID
 * @returns {Promise} - API response
 */
export const deleteContact = async (id) => {
  const response = await api.delete(`/contacts/${id}/`);
  return response.data;
};

/**
 * Bulk upload contacts from file
 * @param {File} file - CSV or Excel file
 * @returns {Promise} - API response with upload results
 */
export const bulkUploadContacts = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await api.post('/contacts/bulk_upload/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data;
};
