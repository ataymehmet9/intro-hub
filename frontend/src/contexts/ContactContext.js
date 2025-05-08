import React, { createContext, useState, useEffect } from "react";
import { useSnackbar } from "notistack";

import { useAuth } from "../hooks/useAuth";
import {
  getContacts,
  createContact,
  updateContact,
  deleteContact,
  bulkUploadContacts,
} from "../services/contacts";

// Create the context
export const ContactContext = createContext();

export const ContactProvider = ({ children }) => {
  const [contacts, setContacts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const { isAuthenticated, token } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  // Fetch contacts when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchContacts();
    }
  }, [isAuthenticated]);

  // Fetch all contacts
  const fetchContacts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getContacts();
      setContacts(data);
    } catch (error) {
      setError("Failed to fetch contacts");
      enqueueSnackbar("Failed to fetch contacts", { variant: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  // Add new contact
  const addContact = async (contactData) => {
    try {
      setIsLoading(true);
      setError(null);
      const newContact = await createContact(contactData);
      setContacts((prevContacts) => [...prevContacts, newContact]);
      enqueueSnackbar("Contact added successfully", { variant: "success" });
      return newContact;
    } catch (error) {
      setError("Failed to add contact");
      enqueueSnackbar("Failed to add contact", { variant: "error" });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Update contact
  const editContact = async (id, contactData) => {
    try {
      setIsLoading(true);
      setError(null);
      const updatedContact = await updateContact(id, contactData);
      setContacts((prevContacts) =>
        prevContacts.map((contact) =>
          contact.id === id ? updatedContact : contact
        )
      );
      enqueueSnackbar("Contact updated successfully", { variant: "success" });
      return updatedContact;
    } catch (error) {
      setError("Failed to update contact");
      enqueueSnackbar("Failed to update contact", { variant: "error" });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Delete contact
  const removeContact = async (id) => {
    try {
      setIsLoading(true);
      setError(null);
      await deleteContact(id);
      setContacts((prevContacts) =>
        prevContacts.filter((contact) => contact.id !== id)
      );
      enqueueSnackbar("Contact deleted successfully", { variant: "success" });
    } catch (error) {
      setError("Failed to delete contact");
      enqueueSnackbar("Failed to delete contact", { variant: "error" });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Bulk upload contacts
  const uploadContacts = async (file) => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await bulkUploadContacts(file);

      // Refresh contacts after bulk upload
      await fetchContacts();

      enqueueSnackbar(
        `${result.contacts_created} contacts added, ${result.contacts_updated} updated`,
        {
          variant: "success",
        }
      );

      // If there are any errors, show them
      if (result.errors && result.errors.length > 0) {
        enqueueSnackbar(
          `${result.errors.length} errors occurred during import`,
          {
            variant: "warning",
          }
        );
      }

      return result;
    } catch (error) {
      setError("Failed to upload contacts");
      enqueueSnackbar("Failed to upload contacts", { variant: "error" });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Context value
  const value = {
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
