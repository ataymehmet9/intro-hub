import api from "./api";

type Contact = {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  [key: string]: any;
};

type BulkUploadResult = {
  contacts_created: number;
  contacts_updated: number;
  errors?: any[];
};

/**
 * Get all contacts
 * @param params - Query parameters (optional)
 * @returns API response with contacts data
 */
export const getContacts = async (
  params: Record<string, any> = {}
): Promise<Contact[]> => {
  const response = await api.get<Contact[]>("/contacts", { params });
  return response.data;
};

/**
 * Get all users - Global Search
 * @param params - Query parameters (optional)
 * @returns API response with users data
 */
export const getAllUsers = async (
  params: Record<string, any> = {}
): Promise<Contact[]> => {
  const response = await api.get<Contact[]>("/users", { params });
  return response.data;
};

/**
 * Get a single contact by ID
 * @param id - Contact ID
 * @returns API response with contact data
 */
export const getContact = async (id: number): Promise<Contact> => {
  const response = await api.get<Contact>(`/contacts/${id}`);
  return response.data;
};

/**
 * Create a new contact
 * @param contactData - Contact data
 * @returns API response with new contact data
 */
export const createContact = async (
  contactData: Partial<Contact>
): Promise<Contact> => {
  const response = await api.post<Contact>("/contacts", contactData);
  return response.data;
};

/**
 * Update an existing contact
 * @param id - Contact ID
 * @param contactData - Contact data to update
 * @returns API response with updated contact data
 */
export const updateContact = async (
  id: number,
  contactData: Partial<Contact>
): Promise<Contact> => {
  const response = await api.patch<Contact>(`/contacts/${id}`, contactData);
  return response.data;
};

/**
 * Delete a contact
 * @param id - Contact ID
 * @returns API response
 */
export const deleteContact = async (id: number): Promise<any> => {
  const response = await api.delete(`/contacts/${id}`);
  return response.data;
};

/**
 * Bulk upload contacts from file
 * @param file - CSV or Excel file
 * @returns API response with upload results
 */
export const bulkUploadContacts = async (
  file: File
): Promise<BulkUploadResult> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post<BulkUploadResult>(
    "/contacts/bulk_upload",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};
