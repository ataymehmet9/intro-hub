import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { z } from 'zod'
import { Card } from '@/components/ui'
import SearchBar from './-components/SearchBar'
import SearchResultsTable from './-components/SearchResultsTable'
import NoSearchResults from './-components/NoSearchResults'
import IntroductionRequestModal from './-components/IntroductionRequestModal'
import { useSearch } from './-hooks/useSearch'
import { useIntroductionRequest } from './-hooks/useIntroductionRequest'
import type { SearchResult } from '@/schemas'
import { Container } from '@/components/shared'

const searchSchema = z.object({
  q: z.string().optional().catch(''),
})

export const Route = createFileRoute('/_authenticated/(search)/search')({
  validateSearch: searchSchema,
  component: SearchPage,
})

function SearchPage() {
  const { q: searchQuery = '' } = Route.useSearch()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedContact, setSelectedContact] = useState<SearchResult | null>(
    null,
  )

  // Use the search hook - it automatically fetches when query changes
  const { results, isLoading } = useSearch({
    query: searchQuery,
    enabled: searchQuery.length >= 2,
  })

  // Use the introduction request hook
  const { createRequest } = useIntroductionRequest({
    onSuccess: () => {
      handleCloseModal()
    },
  })

  const handleRequestIntroduction = (contact: SearchResult) => {
    setSelectedContact(contact)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedContact(null)
  }

  const handleSubmitRequest = async (message: string) => {
    if (!selectedContact) return

    await createRequest({
      targetContactId: selectedContact.id,
      message,
    })
  }

  const showResults = searchQuery.length >= 2
  const hasResults = results.length > 0

  return (
    <Container>
      <div className="mb-8">
        <h1>Search Contacts</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Search for contacts across the platform and request introductions
        </p>
      </div>

      <Card className="mb-6">
        <div className="p-6">
          <SearchBar />
        </div>
      </Card>

      {showResults && (
        <Card>
          <div className="p-6">
            {isLoading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                <p className="mt-4 text-gray-600 dark:text-gray-400">
                  Searching...
                </p>
              </div>
            ) : hasResults ? (
              <>
                <div className="mb-4">
                  <h2 className="text-xl font-semibold">
                    Search Results ({results.length})
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Found {results.length} contact
                    {results.length !== 1 ? 's' : ''} matching "{searchQuery}"
                  </p>
                </div>
                <SearchResultsTable
                  results={results}
                  isLoading={isLoading}
                  onRequestIntroduction={handleRequestIntroduction}
                />
              </>
            ) : (
              <NoSearchResults query={searchQuery} />
            )}
          </div>
        </Card>
      )}

      {!showResults && (
        <Card>
          <div className="p-12 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold mb-2">Start Searching</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Enter at least 2 characters to search for contacts by name,
              company, or position
            </p>
          </div>
        </Card>
      )}

      {selectedContact && (
        <IntroductionRequestModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          contact={selectedContact}
          onSubmit={handleSubmitRequest}
        />
      )}
    </Container>
  )
}

// Made with Bob
