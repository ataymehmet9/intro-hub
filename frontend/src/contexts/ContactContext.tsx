'use client'

import React, { createContext, useState, useEffect, ReactNode } from 'react'
import { toast, Notification as NotificationComponent } from '@/components/ui'
import { 
  getContacts, 
  createContact, 
  updateContact, 
  deleteContact
} from '@/services/contacts'
import { ContactContextType, Contact, ContactFormData } from '@/types/intro-hub'

// Create the context
export const ContactContext = createContext<ContactContextType | undefined>(undefined)

interface ContactProviderProps {
  children: ReactNode
}

export const ContactProvider: React.FC<ContactProviderProps> = ({ children }) => {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch all contacts
  const fetchContacts = async (): Promise<void> => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await getContacts()
      setContacts(response.results)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch contacts'
      setError(errorMessage)
      console.error('Error fetching contacts:', err)
    } finally {
      setIsLoading(false)
    }
  }

  // Add new contact
  const addContact = async (contactData: ContactFormData): Promise<Contact> => {
    try {
      setIsLoading(true)
      setError(null)
      const newContact = await createContact(contactData)
      setContacts(prev => [newContact, ...prev])
      
      toast.push(
        <NotificationComponent title="Success!" type="success">
          Contact added successfully!
        </NotificationComponent>
      )
      
      return newContact
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add contact'
      setError(errorMessage)
      
      toast.push(
        <NotificationComponent title="Error" type="danger">
          {errorMessage}
        </NotificationComponent>
      )
      
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  // Update existing contact
  const updateExistingContact = async (id: number, contactData: Partial<ContactFormData>): Promise<Contact> => {
    try {
      setIsLoading(true)
      setError(null)
      const updatedContact = await updateContact(id, contactData)
      
      setContacts(prev => 
        prev.map(contact => 
          contact.id === id ? updatedContact : contact
        )
      )
      
      toast.push(
        <NotificationComponent title="Success!" type="success">
          Contact updated successfully!
        </NotificationComponent>
      )
      
      return updatedContact
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update contact'
      setError(errorMessage)
      
      toast.push(
        <NotificationComponent title="Error" type="danger">
          {errorMessage}
        </NotificationComponent>
      )
      
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  // Remove contact
  const removeContact = async (id: number): Promise<void> => {
    try {
      setIsLoading(true)
      setError(null)
      await deleteContact(id)
      
      setContacts(prev => prev.filter(contact => contact.id !== id))
      
      toast.push(
        <NotificationComponent title="Success!" type="success">
          Contact deleted successfully!
        </NotificationComponent>
      )
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete contact'
      setError(errorMessage)
      
      toast.push(
        <NotificationComponent title="Error" type="danger">
          {errorMessage}
        </NotificationComponent>
      )
      
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  // Search contacts locally
  const searchContactsLocal = (query: string): Contact[] => {
    if (!query.trim()) return contacts
    
    const lowercaseQuery = query.toLowerCase()
    return contacts.filter(contact => 
      contact.full_name.toLowerCase().includes(lowercaseQuery) ||
      contact.email.toLowerCase().includes(lowercaseQuery) ||
      contact.company?.toLowerCase().includes(lowercaseQuery) ||
      contact.job_title?.toLowerCase().includes(lowercaseQuery)
    )
  }

  // Initialize contacts on mount
  useEffect(() => {
    fetchContacts()
  }, [])

  // Context value
  const value: ContactContextType = {
    contacts,
    isLoading,
    error,
    fetchContacts,
    addContact,
    updateContact: updateExistingContact,
    removeContact,
    searchContacts: searchContactsLocal,
  }

  return <ContactContext.Provider value={value}>{children}</ContactContext.Provider>
}

// Custom hook to use contact context
export const useContacts = (): ContactContextType => {
  const context = React.useContext(ContactContext)
  if (context === undefined) {
    throw new Error('useContacts must be used within a ContactProvider')
  }
  return context
}

// Made with Bob
