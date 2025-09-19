import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  FC,
} from "react";

import { useAuth } from "@hooks/useAuth";
import {
  getContacts,
  createContact,
  updateContact,
  deleteContact,
  bulkUploadContacts,
} from "@services/contacts";
import { toast } from "@components/ui/notification";

// Types
export type Contact = {
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

type ContactContextType = {
  contacts: Contact[];
  isLoading: boolean;
  error: string | null;
  fetchContacts: () => Promise<void>;
  addContact: (contactData: Partial<Contact>) => Promise<Contact>;
  editContact: (id: number, contactData: Partial<Contact>) => Promise<Contact>;
  removeContact: (id: number) => Promise<void>;
  uploadContacts: (file: File) => Promise<BulkUploadResult>;
};

type ContactProviderProps = {
  children: ReactNode;
};

// Create the context
// eslint-disable-next-line react-refresh/only-export-components
export const ContactContext = createContext<ContactContextType | undefined>(
  undefined
);

export const ContactProvider: FC<ContactProviderProps> = ({ children }) => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const { isAuthenticated } = useAuth();

  // Fetch contacts when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchContacts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  // Fetch all contacts
  const fetchContacts = async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getContacts();
      setContacts(data);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_) {
      setError("Failed to fetch contacts");
      toast({ title: "Failed to fetch contacts", variant: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  // Add new contact
  const addContact = async (
    contactData: Partial<Contact>
  ): Promise<Contact> => {
    try {
      setIsLoading(true);
      setError(null);
      const newContact = await createContact(contactData);
      setContacts((prevContacts) => [...prevContacts, newContact]);
      toast({ title: "Contact added successfully", variant: "success" });
      return newContact;
    } catch (error) {
      setError("Failed to add contact");
      toast({ title: "Failed to add contact", variant: "error" });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Update contact
  const editContact = async (
    id: number,
    contactData: Partial<Contact>
  ): Promise<Contact> => {
    try {
      setIsLoading(true);
      setError(null);
      const updatedContact = await updateContact(id, contactData);
      setContacts((prevContacts) =>
        prevContacts.map((contact) =>
          contact.id === id ? updatedContact : contact
        )
      );
      toast({ title: "Contact updated successfully", variant: "success" });
      return updatedContact;
    } catch (error) {
      setError("Failed to update contact");
      toast({ title: "Failed to update contact", variant: "error" });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Delete contact
  const removeContact = async (id: number): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      await deleteContact(id);
      setContacts((prevContacts) =>
        prevContacts.filter((contact) => contact.id !== id)
      );
      toast({ title: "Contact deleted successfully", variant: "success" });
    } catch (error) {
      setError("Failed to delete contact");
      toast({ title: "Failed to delete contact", variant: "error" });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Bulk upload contacts
  const uploadContacts = async (file: File): Promise<BulkUploadResult> => {
    try {
      setIsLoading(true);
      setError(null);
      const result: BulkUploadResult = await bulkUploadContacts(file);

      // Refresh contacts after bulk upload
      await fetchContacts();

      toast({
        title: `${result.contacts_created} contacts added, ${result.contacts_updated} updated`,
        variant: "success",
      });

      // If there are any errors, show them
      if (result.errors && result.errors.length > 0) {
        toast({
          title: `${result.errors.length} errors occurred during import`,
          variant: "warning",
        });
      }

      return result;
    } catch (error) {
      setError("Failed to upload contacts");
      toast({ title: "Failed to upload contacts", variant: "error" });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Context value
  const value: ContactContextType = {
    contacts,
    isLoading,
    error,
    fetchContacts,
    addContact,
    editContact,
    removeContact,
    uploadContacts,
  };

  return (
    <ContactContext.Provider value={value}>{children}</ContactContext.Provider>
  );
};
