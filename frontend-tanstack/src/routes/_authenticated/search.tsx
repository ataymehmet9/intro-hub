import { createFileRoute } from '@tanstack/react-router'
import React, { useState, useEffect } from 'react'
import { Input, Button, Card, Avatar, Badge, Notification as NotificationComponent, Dialog, Select } from '~/components/ui'
import { HiMagnifyingGlass, HiEnvelope, HiPhone, HiBriefcase, HiUserPlus, HiXMark } from 'react-icons/hi2'
import { NoData } from '~/components/intro-hub/common'
import { searchContacts, getContacts } from '~/services/contacts'
import { createRequest } from '~/services/requests'
import { Contact } from '~/types/intro-hub'
import { toast } from '~/components/ui'

export const Route = createFileRoute('/_authenticated/search')({
  component: SearchPage,
})

function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<Contact[]>([])
  const [hasSearched, setHasSearched] = useState(false)
  
  // Request dialog state
  const [isRequestDialogOpen, setIsRequestDialogOpen] = useState(false)
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [connectors, setConnectors] = useState<Contact[]>([])
  const [selectedConnectorId, setSelectedConnectorId] = useState<number | null>(null)
  const [requestMessage, setRequestMessage] = useState('')
  const [isSubmittingRequest, setIsSubmittingRequest] = useState(false)

  // Load connectors (user's contacts) when component mounts
  useEffect(() => {
    const loadConnectors = async () => {
      try {
        const contacts = await getContacts()
        setConnectors(contacts)
      } catch (error) {
        console.error('Failed to load connectors:', error)
      }
    }
    loadConnectors()
  }, [])

  const handleSearch = async () => {
    if (!searchQuery.trim()) return
    
    setIsSearching(true)
    setHasSearched(true)
    
    try {
      const results = await searchContacts(searchQuery)
      console.log('Search results:', results)
      
      // Handle case where results might be undefined or null
      const contactsArray = Array.isArray(results) ? results : []
      setSearchResults(contactsArray)
      
      if (contactsArray.length === 0) {
        toast.push(
          <NotificationComponent title="No results found" type="info">
            No contacts found matching "{searchQuery}"
          </NotificationComponent>
        )
      }
    } catch (error) {
      console.error('Search error:', error)
      console.error('Error details:', JSON.stringify(error, null, 2))
      toast.push(
        <NotificationComponent title="Search failed" type="danger">
          Failed to search contacts. Please try again.
        </NotificationComponent>
      )
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const handleRequestIntro = (contact: Contact) => {
    setSelectedContact(contact)
    setSelectedConnectorId(null)
    setRequestMessage('')
    setIsRequestDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsRequestDialogOpen(false)
    setSelectedContact(null)
    setSelectedConnectorId(null)
    setRequestMessage('')
  }

  const handleSubmitRequest = async () => {
    if (!selectedContact || !selectedConnectorId || !requestMessage.trim()) {
      toast.push(
        <NotificationComponent title="Validation Error" type="warning">
          Please select a connector and provide a message
        </NotificationComponent>
      )
      return
    }

    setIsSubmittingRequest(true)
    try {
      await createRequest({
        target_contact_id: selectedContact.id,
        connector_id: selectedConnectorId,
        message: requestMessage,
      })

      toast.push(
        <NotificationComponent title="Success!" type="success">
          Introduction request sent successfully to {selectedContact.full_name}
        </NotificationComponent>
      )

      handleCloseDialog()
    } catch (error) {
      console.error('Failed to create request:', error)
      toast.push(
        <NotificationComponent title="Request Failed" type="danger">
          Failed to send introduction request. Please try again.
        </NotificationComponent>
      )
    } finally {
      setIsSubmittingRequest(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Search Contacts
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Find contacts and request introductions
        </p>
      </div>

      {/* Search Bar */}
      <Card>
        <div className="p-6">
          <div className="flex gap-3">
            <Input
              placeholder="Search for contacts by name, company, or industry..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              prefix={<HiMagnifyingGlass className="text-gray-400" />}
              className="flex-1"
            />
            <Button
              variant="solid"
              icon={<HiMagnifyingGlass />}
              onClick={handleSearch}
              loading={isSearching}
              disabled={!searchQuery.trim()}
            >
              Search
            </Button>
          </div>
        </div>
      </Card>

      {/* Search Results */}
      {!hasSearched ? (
        <NoData
          icon={<HiMagnifyingGlass className="w-20 h-20" />}
          title="Search for Contacts"
          message="Enter a search term above to find contacts in the network. You can search by name, company, industry, or other criteria."
        />
      ) : searchResults.length === 0 ? (
        <NoData
          icon={<HiMagnifyingGlass className="w-20 h-20" />}
          title="No Results Found"
          message={`No contacts found matching "${searchQuery}". Try a different search term.`}
        />
      ) : (
        <div className="space-y-4">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Found {searchResults.length} contact{searchResults.length !== 1 ? 's' : ''}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {searchResults.map((contact) => (
              <Card key={contact.id} className="hover:shadow-lg transition-shadow">
                <div className="p-6 space-y-4">
                  {/* Contact Header */}
                  <div className="flex items-start gap-3">
                    <Avatar
                      size={50}
                      shape="circle"
                      className="bg-primary-500 text-white"
                    >
                      {contact.first_name[0]}{contact.last_name[0]}
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                        {contact.full_name}
                      </h3>
                      {contact.position && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                          {contact.position}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Contact Details */}
                  <div className="space-y-2">
                    {contact.company && (
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <HiBriefcase className="flex-shrink-0" />
                        <span className="truncate">{contact.company}</span>
                      </div>
                    )}
                    {contact.email && (
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <HiEnvelope className="flex-shrink-0" />
                        <span className="truncate">{contact.email}</span>
                      </div>
                    )}
                    {contact.phone && (
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <HiPhone className="flex-shrink-0" />
                        <span className="truncate">{contact.phone}</span>
                      </div>
                    )}
                  </div>

                  {/* Relationship Badge */}
                  {contact.relationship && (
                    <div>
                      <Badge className="capitalize">
                        {contact.relationship}
                      </Badge>
                    </div>
                  )}

                  {/* Action Button */}
                  <Button
                    variant="solid"
                    size="sm"
                    className="w-full"
                    icon={<HiUserPlus />}
                    onClick={() => handleRequestIntro(contact)}
                  >
                    Request Introduction
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Request Introduction Dialog */}
      <Dialog
        isOpen={isRequestDialogOpen}
        onClose={handleCloseDialog}
        width={600}
      >
        <div className="p-6 space-y-6">
          {/* Dialog Header */}
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Request Introduction
              </h2>
              {selectedContact && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  To: {selectedContact.full_name}
                  {selectedContact.company && ` at ${selectedContact.company}`}
                </p>
              )}
            </div>
            <Button
              variant="plain"
              size="sm"
              icon={<HiXMark />}
              onClick={handleCloseDialog}
            />
          </div>

          {/* Connector Selection */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Select Connector <span className="text-red-500">*</span>
            </label>
            <Select
              placeholder="Choose someone who knows both of you"
              value={selectedConnectorId?.toString() || ''}
              onChange={(value) => setSelectedConnectorId(value ? Number(value) : null)}
            >
              {connectors.map((connector) => (
                <option key={connector.id} value={connector.id}>
                  {connector.full_name}
                  {connector.company && ` - ${connector.company}`}
                </option>
              ))}
            </Select>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Select a mutual connection who can introduce you
            </p>
          </div>

          {/* Message Input */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Message <span className="text-red-500">*</span>
            </label>
            <Input
              textArea
              rows={5}
              placeholder="Explain why you'd like to be introduced and what you hope to discuss..."
              value={requestMessage}
              onChange={(e) => setRequestMessage(e.target.value)}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {requestMessage.length} characters
            </p>
          </div>

          {/* Dialog Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button
              variant="plain"
              onClick={handleCloseDialog}
              disabled={isSubmittingRequest}
            >
              Cancel
            </Button>
            <Button
              variant="solid"
              onClick={handleSubmitRequest}
              loading={isSubmittingRequest}
              disabled={!selectedConnectorId || !requestMessage.trim()}
            >
              Send Request
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  )
}

// Made with Bob
