import { useState, useEffect, useRef } from 'react'
import { GlassInput } from '../common/GlassInput'
import { SearchIcon, LocationIcon } from '../common/Icon'
import { useDebounce } from '../../hooks/useDebounce'
import { useLocation } from '../../context/LocationContext'
import { searchLocations } from '../../api/geocoding'
import type { Location } from '../../types/location'
import { cn } from '../../utils/cn'

interface LocationSearchProps {
  onClose?: () => void
  autoFocus?: boolean
}

export function LocationSearch({ onClose, autoFocus = false }: LocationSearchProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Location[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)

  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const debouncedQuery = useDebounce(query, 300)
  const { setCurrentLocation, addRecentSearch, recentSearches } = useLocation()

  // Focus input on mount if autoFocus
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus()
    }
  }, [autoFocus])

  // Search for locations when query changes
  useEffect(() => {
    if (debouncedQuery.length < 2) {
      setResults([])
      return
    }

    const search = async () => {
      setIsLoading(true)
      try {
        const locations = await searchLocations(debouncedQuery)
        setResults(locations)
        setSelectedIndex(-1)
      } catch (error) {
        console.error('Search error:', error)
        setResults([])
      } finally {
        setIsLoading(false)
      }
    }

    search()
  }, [debouncedQuery])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (location: Location) => {
    setCurrentLocation(location)
    addRecentSearch(location)
    setQuery('')
    setResults([])
    setIsOpen(false)
    onClose?.()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const items = results.length > 0 ? results : recentSearches

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex((prev) =>
          prev < items.length - 1 ? prev + 1 : prev
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1))
        break
      case 'Enter':
        e.preventDefault()
        if (selectedIndex >= 0 && items[selectedIndex]) {
          handleSelect(items[selectedIndex])
        }
        break
      case 'Escape':
        setIsOpen(false)
        inputRef.current?.blur()
        break
    }
  }

  const showDropdown = isOpen && (results.length > 0 || recentSearches.length > 0 || isLoading)

  return (
    <div ref={containerRef} className="relative w-full">
      <GlassInput
        ref={inputRef}
        type="text"
        placeholder="Search locations..."
        value={query}
        onChange={(e) => {
          setQuery(e.target.value)
          setIsOpen(true)
        }}
        onFocus={() => setIsOpen(true)}
        onKeyDown={handleKeyDown}
        icon={<SearchIcon size={18} />}
      />

      {/* Dropdown - using solid variant for better readability */}
      {showDropdown && (
        <div
          className={cn(
            "absolute top-full left-0 right-0 mt-2 z-50 max-h-80 overflow-y-auto",
            "rounded-macos-lg shadow-macos-lg",
            "bg-white dark:bg-macos-gray-800",
            "border border-macos-gray-200 dark:border-macos-gray-700"
          )}
        >
          {/* Loading state */}
          {isLoading && (
            <div className="px-4 py-3 text-sm text-macos-gray-500 dark:text-macos-gray-400">
              Searching...
            </div>
          )}

          {/* Search results */}
          {!isLoading && results.length > 0 && (
            <div>
              <div className="px-4 py-2 text-xs font-medium text-macos-gray-400 dark:text-macos-gray-500 uppercase tracking-wide">
                Results
              </div>
              {results.map((location, index) => (
                <button
                  key={location.id}
                  onClick={() => handleSelect(location)}
                  className={cn(
                    'w-full px-4 py-3 text-left flex items-center gap-3',
                    'transition-colors duration-150',
                    'hover:bg-macos-gray-100 dark:hover:bg-macos-gray-700',
                    selectedIndex === index &&
                      'bg-macos-blue/10 dark:bg-macos-blue/20'
                  )}
                >
                  <LocationIcon
                    size={18}
                    className="text-macos-gray-400 shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="font-medium text-macos-gray-900 dark:text-white truncate">
                      {location.name}
                    </div>
                    <div className="text-sm text-macos-gray-500 dark:text-macos-gray-400 truncate">
                      {location.admin1 && `${location.admin1}, `}
                      {location.country}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Recent searches (when no query) */}
          {!isLoading && results.length === 0 && query.length < 2 && recentSearches.length > 0 && (
            <div>
              <div className="px-4 py-2 text-xs font-medium text-macos-gray-400 dark:text-macos-gray-500 uppercase tracking-wide">
                Recent
              </div>
              {recentSearches.map((location, index) => (
                <button
                  key={location.id}
                  onClick={() => handleSelect(location)}
                  className={cn(
                    'w-full px-4 py-3 text-left flex items-center gap-3',
                    'transition-colors duration-150',
                    'hover:bg-macos-gray-100 dark:hover:bg-macos-gray-700',
                    selectedIndex === index &&
                      'bg-macos-blue/10 dark:bg-macos-blue/20'
                  )}
                >
                  <span className="text-macos-gray-400">🕐</span>
                  <div className="min-w-0">
                    <div className="font-medium text-macos-gray-900 dark:text-white truncate">
                      {location.name}
                    </div>
                    <div className="text-sm text-macos-gray-500 dark:text-macos-gray-400 truncate">
                      {location.admin1 && `${location.admin1}, `}
                      {location.country}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* No results */}
          {!isLoading && results.length === 0 && query.length >= 2 && (
            <div className="px-4 py-3 text-sm text-macos-gray-500 dark:text-macos-gray-400">
              No locations found for "{query}"
            </div>
          )}
        </div>
      )}
    </div>
  )
}
