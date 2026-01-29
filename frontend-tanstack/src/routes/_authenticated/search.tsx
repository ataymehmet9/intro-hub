import { createFileRoute } from '@tanstack/react-router'
import React, { useState } from 'react'
import { Input, Button, Card, Avatar, Badge, Notification as NotificationComponent } from '~/components/ui'
import { HiMagnifyingGlass, HiEnvelope, HiPhone, HiBriefcase, HiUserPlus } from 'react-icons/hi2'
import { NoData } from '~/components/intro-hub/common'
import { searchContacts } from '~/services/contacts'
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

  const handleSearch = async () => {
    if (!searchQuery.trim()) return
    
    setIsSearching(true)
    setHasSearched(true)
    
    try {
      const results = await searchContacts(searchQuery)
      setSearchResults(results)
      
      if (results.length === 0) {
        toast.push(
          <NotificationComponent title="No results found" type="info">
            No contacts found matching "{searchQuery}"
          </NotificationComponent>
        )
      }
    } catch (error) {
      console.error('Search error:', error)
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
    toast.push(
      <NotificationComponent title="Feature coming soon" type="info">
        Request introduction to {contact.full_name}
      </NotificationComponent>
    )
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
    </div>
  )
}

// Made with Bob
