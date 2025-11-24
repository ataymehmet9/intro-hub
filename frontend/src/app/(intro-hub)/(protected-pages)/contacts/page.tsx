'use client'

import React, { useState } from 'react'
import { Button, Dialog, Input } from '@/components/ui'
import { HiPlus, HiMagnifyingGlass } from 'react-icons/hi2'
import { useContacts } from '@/contexts/ContactContext'
import { ContactCard, ContactForm } from '@/components/intro-hub/contacts'
import { LoadingSpinner, NoData } from '@/components/intro-hub/common'
import { Contact, ContactFormData } from '@/types/intro-hub'

export default function ContactsPage() {
  const { contacts, isLoading, addContact, updateContact } = useContacts()
  const [searchQuery, setSearchQuery] = useState('')
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [editingContact, setEditingContact] = useState<Contact | null>(null)

  const filteredContacts = contacts.filter((contact) => {
    const query = searchQuery.toLowerCase()
    return (
      contact.full_name.toLowerCase().includes(query) ||
      contact.email.toLowerCase().includes(query) ||
      contact.company?.toLowerCase().includes(query) ||
      contact.job_title?.toLowerCase().includes(query)
    )
  })

  const handleAddContact = async (data: ContactFormData) => {
    await addContact(data)
    setShowAddDialog(false)
  }

  const handleEditContact = async (data: ContactFormData) => {
    if (editingContact) {
      await updateContact(editingContact.id, data)
      setEditingContact(null)
    }
  }

  const handleEditClick = (contact: Contact) => {
    setEditingContact(contact)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" message="Loading contacts..." />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Contacts
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your network of {contacts.length} contact{contacts.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Button
          variant="solid"
          icon={<HiPlus />}
          onClick={() => setShowAddDialog(true)}
        >
          Add Contact
        </Button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Input
          placeholder="Search contacts by name, email, company..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          prefix={<HiMagnifyingGlass className="text-gray-400" />}
          className="w-full"
        />
      </div>

      {/* Contacts Grid */}
      {filteredContacts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredContacts.map((contact) => (
            <ContactCard
              key={contact.id}
              contact={contact}
              onEdit={handleEditClick}
            />
          ))}
        </div>
      ) : searchQuery ? (
        <NoData
          title="No contacts found"
          message={`No contacts match "${searchQuery}". Try a different search term.`}
        />
      ) : (
        <NoData
          title="No contacts yet"
          message="Start building your network by adding your first contact."
          action={
            <Button
              variant="solid"
              icon={<HiPlus />}
              onClick={() => setShowAddDialog(true)}
            >
              Add Your First Contact
            </Button>
          }
        />
      )}

      {/* Add Contact Dialog */}
      <Dialog
        isOpen={showAddDialog}
        onClose={() => setShowAddDialog(false)}
        width={600}
      >
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            Add New Contact
          </h2>
          <ContactForm
            onSubmit={handleAddContact}
            onCancel={() => setShowAddDialog(false)}
            submitText="Add Contact"
          />
        </div>
      </Dialog>

      {/* Edit Contact Dialog */}
      <Dialog
        isOpen={!!editingContact}
        onClose={() => setEditingContact(null)}
        width={600}
      >
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            Edit Contact
          </h2>
          {editingContact && (
            <ContactForm
              initialData={editingContact}
              onSubmit={handleEditContact}
              onCancel={() => setEditingContact(null)}
              submitText="Save Changes"
            />
          )}
        </div>
      </Dialog>
    </div>
  )
}

// Made with Bob
