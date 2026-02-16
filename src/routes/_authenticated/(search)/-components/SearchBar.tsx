import { useState, useEffect, useCallback } from 'react'
import { TbSearch, TbX } from 'react-icons/tb'
import { Input, Button } from '@/components/ui'
import { useSearchStore } from '../-store/searchStore'

interface SearchBarProps {
  onSearch: (query: string) => void
  placeholder?: string
  debounceMs?: number
}

const SearchBar = ({
  onSearch,
  placeholder = 'Search by name, company, or position...',
  debounceMs = 300,
}: SearchBarProps) => {
  const { searchQuery, setSearchQuery } = useSearchStore((state) => state)
  const [localQuery, setLocalQuery] = useState(searchQuery)

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localQuery !== searchQuery) {
        setSearchQuery(localQuery)
        onSearch(localQuery)
      }
    }, debounceMs)

    return () => clearTimeout(timer)
  }, [localQuery, searchQuery, setSearchQuery, onSearch, debounceMs])

  const handleClear = useCallback(() => {
    setLocalQuery('')
    setSearchQuery('')
    onSearch('')
  }, [setSearchQuery, onSearch])

  return (
    <div className="relative w-full">
      <Input
        type="text"
        value={localQuery}
        onChange={(e) => setLocalQuery(e.target.value)}
        placeholder={placeholder}
        prefix={<TbSearch className="text-xl" />}
        suffix={
          localQuery && (
            <Button
              size="xs"
              variant="plain"
              icon={<TbX />}
              onClick={handleClear}
              className="hover:bg-gray-100 dark:hover:bg-gray-700"
            />
          )
        }
        className="w-full"
      />
      {localQuery.length > 0 && localQuery.length < 2 && (
        <p className="text-xs text-red-500 mt-1">
          Please enter at least 2 characters to search
        </p>
      )}
    </div>
  )
}

export default SearchBar

// Made with Bob
