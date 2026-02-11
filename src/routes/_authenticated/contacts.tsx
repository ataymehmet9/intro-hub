import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import {
  HiEye,
  HiFunnel,
  HiMagnifyingGlass,
  HiPencil,
  HiPlus,
  HiTrash,
} from 'react-icons/hi2'
import {
  Avatar,
  Button,
  Checkbox,
  Dialog,
  Input,
  Notification,
  toast,
} from '@/components/ui'
import { DateFormat, LoadingSpinner, NoData } from '@/components/shared/common'
import { Contact, InsertContact, UpdateContact } from '@/schemas'
import ContactForm from '@/components/shared/common/ContactForm'
import ContactImportModal from '@/components/shared/common/ContactImportModal'
import { AdaptiveCard, Container } from '@/components/shared'
import CustomerListActionTools from './-components/CustomerListActionTools'
import { useContact } from './-hooks/useContact'

export const Route = createFileRoute('/_authenticated/contacts')({
  loader: async ({ context }) => {
    await context.queryClient.prefetchQuery(
      context.trpc.contacts.list.queryOptions({ company: null }),
    )
  },
  component: RouteComponent,
})
function RouteComponent() {
  const [searchQuery, setSearchQuery] = useState('')
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [editingContact, setEditingContact] = useState<Contact | null>(null)
  const [viewingContact, setViewingContact] = useState<Contact | null>(null)
  const [selectedContacts, setSelectedContacts] = useState<Set<number>>(
    new Set(),
  )

  // Use the custom hook for contacts management
  const {
    contacts,
    isLoading,
    createContact,
    updateContact,
    deleteContact,
    queryKey,
    queryClient,
  } = useContact({
    company: null,
    onCreateSuccess: () => setShowAddDialog(false),
    onUpdateSuccess: () => setEditingContact(null),
  })

  const filteredContacts = (contacts || []).filter((contact) => {
    const query = searchQuery.toLowerCase()
    return (
      contact.name?.toLowerCase().includes(query) ||
      contact.email?.toLowerCase().includes(query) ||
      contact.company?.toLowerCase().includes(query) ||
      contact.position?.toLowerCase().includes(query)
    )
  })

  const handleAddContact = async (data: InsertContact) => {
    try {
      await createContact(data)
    } catch (error) {
      // Error is already handled in the mutation's onError callback
      console.error('Failed to add contact:', error)
      throw error // Re-throw so the form knows it failed
    }
  }

  const handleBulkImportComplete = () => {
    // Refresh contacts list after bulk import
    queryClient.invalidateQueries({ queryKey })
    toast.push(
      <Notification type="success" title="Import complete">
        Contacts have been successfully imported
      </Notification>,
    )
  }

  const handleEditContact = async (data: UpdateContact) => {
    if (editingContact) {
      await updateContact({
        id: editingContact.id,
        data,
      })
    }
  }

  const handleDeleteContact = async (contactId: number) => {
    if (confirm('Are you sure you want to delete this contact?')) {
      await deleteContact(contactId)
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedContacts(new Set(filteredContacts.map((c) => c.id)))
    } else {
      setSelectedContacts(new Set())
    }
  }

  const handleSelectContact = (contactId: number, checked: boolean) => {
    const newSelected = new Set(selectedContacts)
    if (checked) {
      newSelected.add(contactId)
    } else {
      newSelected.delete(contactId)
    }
    setSelectedContacts(newSelected)
  }

  const stringToColor = (string: string | undefined): string => {
    if (!string) return '#6B7280' // Default gray color
    let hash = 0
    for (let i = 0; i < string.length; i++) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash)
    }
    let color = '#'
    for (let i = 0; i < 3; i++) {
      const value = (hash >> (i * 8)) & 0xff
      color += `00${value.toString(16)}`.slice(-2)
    }
    return color
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" message="Loading contacts..." />
      </div>
    )
  }

  return (
    <>
      <Container>
        <AdaptiveCard>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
              <h3>Contacts</h3>
              <CustomerListActionTools
                onAddClick={() => setShowAddDialog(true)}
              />
            </div>
          </div>
        </AdaptiveCard>
      </Container>
      <div className="space-y-6">
        {/* Search and Filter Bar */}
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Input
              placeholder="Quick search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              prefix={<HiMagnifyingGlass className="text-gray-400" />}
            />
          </div>
          <Button variant="default" icon={<HiFunnel />}>
            Filter
          </Button>
        </div>

        {/* Table */}
        {filteredContacts.length > 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left w-12">
                      <Checkbox
                        checked={
                          selectedContacts.size === filteredContacts.length &&
                          filteredContacts.length > 0
                        }
                        onChange={(checked) => handleSelectAll(checked)}
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Company
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Position
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Added
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-20">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredContacts.map((contact) => {
                    const avatarColor = stringToColor(contact.name)
                    return (
                      <tr
                        key={contact.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <Checkbox
                            checked={selectedContacts.has(contact.id)}
                            onChange={(checked) =>
                              handleSelectContact(contact.id, checked)
                            }
                          />
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <Avatar
                              size={40}
                              shape="circle"
                              style={{ backgroundColor: avatarColor }}
                              className="text-white font-semibold"
                            >
                              {contact.name?.charAt(0) || 'U'}
                            </Avatar>
                            <div>
                              <div className="font-medium text-gray-900 dark:text-gray-100">
                                {contact.name}
                              </div>
                              {contact.phone && (
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                  {contact.phone}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 dark:text-gray-100">
                            {contact.email}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 dark:text-gray-100">
                            {contact.company || '-'}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 dark:text-gray-100">
                            {contact.position || '-'}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            <DateFormat
                              date={contact.createdAt}
                              format="short"
                            />
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setViewingContact(contact)}
                              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                              title="View"
                            >
                              <HiEye className="text-lg" />
                            </button>
                            <button
                              onClick={() => setEditingContact(contact)}
                              className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                              title="Edit"
                            >
                              <HiPencil className="text-lg" />
                            </button>
                            <button
                              onClick={() => handleDeleteContact(contact.id)}
                              className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                              title="Delete"
                            >
                              <HiTrash className="text-lg" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
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

        {/* Add/Import Contacts Modal */}
        <ContactImportModal
          isOpen={showAddDialog}
          onClose={() => setShowAddDialog(false)}
          onContactAdded={handleAddContact}
          onBulkImportComplete={handleBulkImportComplete}
        />

        {/* Edit Contact Dialog */}
        <Dialog
          isOpen={!!editingContact}
          onClose={() => setEditingContact(null)}
          width={900}
        >
          <div className="p-6 max-h-[85vh] overflow-y-auto">
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

        {/* View Contact Dialog */}
        <Dialog
          isOpen={!!viewingContact}
          onClose={() => setViewingContact(null)}
          width={600}
        >
          {viewingContact && (
            <div className="p-6">
              <div className="flex items-start gap-4 mb-6">
                <Avatar
                  size={80}
                  shape="circle"
                  style={{
                    backgroundColor: stringToColor(viewingContact.name),
                  }}
                  className="text-white font-semibold text-2xl"
                >
                  {viewingContact.name?.charAt(0) || 'U'}
                </Avatar>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {viewingContact.name}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    {viewingContact.position || 'No position specified'}
                    {viewingContact.company && ` at ${viewingContact.company}`}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Email
                  </label>
                  <p className="text-gray-900 dark:text-gray-100">
                    {viewingContact.email}
                  </p>
                </div>

                {viewingContact.phone && (
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Phone
                    </label>
                    <p className="text-gray-900 dark:text-gray-100">
                      {viewingContact.phone}
                    </p>
                  </div>
                )}

                {viewingContact.linkedinUrl && (
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      LinkedIn
                    </label>
                    <a
                      href={viewingContact.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      {viewingContact.linkedinUrl}
                    </a>
                  </div>
                )}

                {viewingContact.notes && (
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Notes
                    </label>
                    <p className="text-gray-900 dark:text-gray-100 whitespace-pre-wrap">
                      {viewingContact.notes}
                    </p>
                  </div>
                )}

                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Added
                  </label>
                  <p className="text-gray-900 dark:text-gray-100">
                    <DateFormat date={viewingContact.createdAt} format="long" />
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <Button
                  variant="default"
                  onClick={() => setViewingContact(null)}
                >
                  Close
                </Button>
                <Button
                  variant="solid"
                  icon={<HiPencil />}
                  onClick={() => {
                    setEditingContact(viewingContact)
                    setViewingContact(null)
                  }}
                >
                  Edit Contact
                </Button>
              </div>
            </div>
          )}
        </Dialog>
      </div>
    </>
  )
}
