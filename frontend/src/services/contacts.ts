import { api } from "./api";
import { Contact, ContactFormData, PaginatedResponse } from "@/types/intro-hub";

// Contacts API endpoints
const CONTACTS_ENDPOINTS = {
  LIST: "/contacts",
  DETAIL: (id: number) => `/contacts/${id}`,
  BATCH_IMPORT: "/contacts/batch-import",
  BULK_UPLOAD: "/contacts/bulk_upload",
  SEARCH_ALL: "/users/all",
};

// Get all contacts
export const getContacts = async (params?: {
  page?: number;
  page_size?: number;
  search?: string;
  company?: string;
  relationship?: string;
  ordering?: string;
}): Promise<PaginatedResponse<Contact>> => {
  const queryParams = new URLSearchParams();

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        queryParams.append(key, value.toString());
      }
    });
  }

  const url = `${CONTACTS_ENDPOINTS.LIST}${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
  const response = await api.get<PaginatedResponse<Contact>>(url);
  return response;
};

// Get single contact
export const getContact = async (id: number): Promise<Contact> => {
  const response = await api.get<Contact>(CONTACTS_ENDPOINTS.DETAIL(id));
  return response;
};

// Create new contact
export const createContact = async (
  contactData: ContactFormData
): Promise<Contact> => {
  const response = await api.post<Contact>(
    CONTACTS_ENDPOINTS.LIST,
    contactData
  );
  return response;
};

// Update existing contact
export const updateContact = async (
  id: number,
  contactData: Partial<ContactFormData>
): Promise<Contact> => {
  const response = await api.patch<Contact>(
    CONTACTS_ENDPOINTS.DETAIL(id),
    contactData
  );
  return response;
};

// Delete contact
export const deleteContact = async (id: number): Promise<void> => {
  await api.delete(CONTACTS_ENDPOINTS.DETAIL(id));
};

// Search all contacts (uses /users/all endpoint)
export const searchContacts = async (
  query: string,
  filters?: {
    company?: string;
    relationship?: string;
    limit?: number;
  }
): Promise<Contact[]> => {
  const params = new URLSearchParams();
  if (query) params.append("q", query);

  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.append(key, value.toString());
      }
    });
  }

  const response = await api.get<{ results: Contact[] }>(
    `${CONTACTS_ENDPOINTS.SEARCH_ALL}${params.toString() ? `?${params.toString()}` : ""}`
  );
  return response.results;
};

// Get contacts by relationship type
export const getContactsByRelationship = async (
  relationship: string
): Promise<Contact[]> => {
  const response = await api.get<PaginatedResponse<Contact>>(
    `${CONTACTS_ENDPOINTS.LIST}?relationship=${relationship}`
  );
  return response.results;
};

// Get contacts by company
export const getContactsByCompany = async (
  company: string
): Promise<Contact[]> => {
  const response = await api.get<PaginatedResponse<Contact>>(
    `${CONTACTS_ENDPOINTS.LIST}?company=${company}`
  );
  return response.results;
};

// Batch import contacts (uses /contacts/batch-import endpoint)
export const batchImportContacts = async (
  file: File,
  options?: {
    skip_duplicates?: boolean;
    update_existing?: boolean;
  }
): Promise<{
  imported: number;
  updated: number;
  skipped: number;
  errors: Array<{ row: number; message: string }>;
}> => {
  const formData = new FormData();
  formData.append("file", file);

  if (options) {
    Object.entries(options).forEach(([key, value]) => {
      if (value !== undefined) {
        formData.append(key, value.toString());
      }
    });
  }

  const response = await api.post<{
    imported: number;
    updated: number;
    skipped: number;
    errors: Array<{ row: number; message: string }>;
  }>(CONTACTS_ENDPOINTS.BATCH_IMPORT, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response;
};

// Bulk upload contacts (uses /contacts/bulk_upload endpoint)
export const bulkUploadContacts = async (
  file: File
): Promise<{
  imported: number;
  updated: number;
  skipped: number;
  errors: Array<{ row: number; message: string }>;
}> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post<{
    imported: number;
    updated: number;
    skipped: number;
    errors: Array<{ row: number; message: string }>;
  }>(CONTACTS_ENDPOINTS.BULK_UPLOAD, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response;
};

// Backward compatibility - Import contacts (uses batch import)
export const importContacts = batchImportContacts;

// Get contact statistics
export const getContactStats = async (): Promise<{
  total_contacts: number;
  by_relationship: Record<string, number>;
  by_company: Record<string, number>;
  recent_additions: number;
}> => {
  const response = await api.get<{
    total_contacts: number;
    by_relationship: Record<string, number>;
    by_company: Record<string, number>;
    recent_additions: number;
  }>("/contacts/stats/");
  return response;
};

// Bulk operations
export const bulkDeleteContacts = async (
  contactIds: number[]
): Promise<{ deleted: number }> => {
  const response = await api.post<{ deleted: number }>(
    "/contacts/bulk-delete/",
    {
      contact_ids: contactIds,
    }
  );
  return response;
};

export const bulkUpdateContacts = async (
  contactIds: number[],
  updateData: Partial<ContactFormData>
): Promise<{ updated: number }> => {
  const response = await api.post<{ updated: number }>(
    "/contacts/bulk-update/",
    {
      contact_ids: contactIds,
      update_data: updateData,
    }
  );
  return response;
};

// Get suggested contacts (if AI/ML features are implemented)
export const getSuggestedContacts = async (
  limit: number = 10
): Promise<Contact[]> => {
  const response = await api.get<{ results: Contact[] }>(
    `/contacts/suggestions/?limit=${limit}`
  );
  return response.results;
};
