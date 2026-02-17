import { create } from 'zustand'
import { SearchResult, SearchField } from '@/schemas'
import { TableQueries } from '@/@types/common'

interface SearchState {
  // Search query state
  searchQuery: string
  searchFields: SearchField[]

  // Results state
  results: SearchResult[]
  selectedResult: SearchResult | null

  // Table state
  tableData: TableQueries

  // Actions
  setSearchQuery: (query: string) => void
  setSearchFields: (fields: SearchField[]) => void
  setResults: (results: SearchResult[]) => void
  setSelectedResult: (result: SearchResult | null) => void
  setTableData: (data: TableQueries) => void
  resetSearch: () => void
}

const initialTableData: TableQueries = {
  pageIndex: 1,
  pageSize: 25,
  sort: {
    order: '',
    key: '',
  },
  query: '',
}

export const useSearchStore = create<SearchState>((set) => ({
  // Initial state
  searchQuery: '',
  searchFields: ['name', 'company', 'position'],
  results: [],
  selectedResult: null,
  tableData: initialTableData,

  // Actions
  setSearchQuery: (query) => set({ searchQuery: query }),

  setSearchFields: (fields) => set({ searchFields: fields }),

  setResults: (results) => set({ results }),

  setSelectedResult: (result) => set({ selectedResult: result }),

  setTableData: (data) => set({ tableData: data }),

  resetSearch: () =>
    set({
      searchQuery: '',
      searchFields: ['name', 'company', 'position'],
      results: [],
      selectedResult: null,
      tableData: initialTableData,
    }),
}))
