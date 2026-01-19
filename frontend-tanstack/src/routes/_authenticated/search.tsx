import { createFileRoute } from '@tanstack/react-router'
import React, { useState } from 'react'
import { Input, Button, Card } from '~/components/ui'
import { HiMagnifyingGlass } from 'react-icons/hi2'
import { NoData } from '~/components/intro-hub/common'

export const Route = createFileRoute('/_authenticated/search')({
  component: SearchPage,
})

function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('')

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
              prefix={<HiMagnifyingGlass className="text-gray-400" />}
              className="flex-1"
            />
            <Button variant="solid" icon={<HiMagnifyingGlass />}>
              Search
            </Button>
          </div>
        </div>
      </Card>

      {/* Search Results */}
      <NoData
        icon={<HiMagnifyingGlass className="w-20 h-20" />}
        title="Search for Contacts"
        message="Enter a search term above to find contacts in the network. You can search by name, company, industry, or other criteria."
      />

      {/* Note: This is a placeholder. In a real implementation, you would:
          - Connect to a search API endpoint
          - Display search results in cards
          - Add filters (industry, location, etc.)
          - Add "Request Introduction" buttons
          - Show mutual connections
      */}
    </div>
  )
}

// Made with Bob
