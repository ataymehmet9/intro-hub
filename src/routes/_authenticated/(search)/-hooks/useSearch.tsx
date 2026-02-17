import { useQuery } from '@tanstack/react-query'
import { useTRPC } from '@/integrations/trpc/react'
import { SearchField } from '@/schemas'

interface UseSearchOptions {
  query: string
  fields?: SearchField[]
  enabled?: boolean
}

export function useSearch(options: UseSearchOptions) {
  const {
    query,
    fields = ['name', 'company', 'position'],
    enabled = true,
  } = options

  const trpc = useTRPC()

  const queryKey = trpc.search.globalSearch.queryKey({ query, fields })

  // Only fetch if enabled and query is at least 2 characters
  const shouldFetch = enabled && query.length >= 2

  const {
    data,
    isFetching: isLoading,
    error,
  } = useQuery({
    ...trpc.search.globalSearch.queryOptions({ query, fields }),
    enabled: shouldFetch,
  })

  const searchResults = data?.data ?? []
  const total = data?.total ?? 0

  return {
    // Data
    results: searchResults,
    total,
    isLoading,
    error,

    // Query utilities
    queryKey,
  }
}
