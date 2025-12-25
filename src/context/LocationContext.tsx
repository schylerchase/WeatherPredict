import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from 'react'
import type { Location, FavoriteLocation } from '../types/location'

interface LocationContextType {
  currentLocation: Location | null
  favorites: FavoriteLocation[]
  recentSearches: Location[]
  isLoading: boolean
  setCurrentLocation: (location: Location) => void
  addFavorite: (location: Location) => void
  removeFavorite: (locationId: number) => void
  isFavorite: (locationId: number) => boolean
  addRecentSearch: (location: Location) => void
  clearRecentSearches: () => void
}

const LocationContext = createContext<LocationContextType | undefined>(undefined)

const FAVORITES_KEY = 'weather_favorites'
const RECENT_KEY = 'weather_recent'
const LAST_LOCATION_KEY = 'weather_last_location'
const MAX_RECENT = 5

function loadFromStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue

  try {
    const stored = localStorage.getItem(key)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (e) {
    console.error(`Failed to load ${key}:`, e)
  }

  return defaultValue
}

function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (e) {
    console.error(`Failed to save ${key}:`, e)
  }
}

export function LocationProvider({ children }: { children: ReactNode }) {
  const [currentLocation, setCurrentLocationState] = useState<Location | null>(
    () => {
      const stored = loadFromStorage<Location | null>(LAST_LOCATION_KEY, null)
      // Clear stale "Current Location" placeholder names from old versions
      if (stored?.name === 'Current Location') {
        localStorage.removeItem(LAST_LOCATION_KEY)
        return null
      }
      return stored
    }
  )
  const [favorites, setFavorites] = useState<FavoriteLocation[]>(() =>
    loadFromStorage<FavoriteLocation[]>(FAVORITES_KEY, [])
  )
  const [recentSearches, setRecentSearches] = useState<Location[]>(() =>
    loadFromStorage<Location[]>(RECENT_KEY, [])
  )
  const [isLoading] = useState(false)

  // Persist favorites
  useEffect(() => {
    saveToStorage(FAVORITES_KEY, favorites)
  }, [favorites])

  // Persist recent searches
  useEffect(() => {
    saveToStorage(RECENT_KEY, recentSearches)
  }, [recentSearches])

  // Persist last location
  useEffect(() => {
    if (currentLocation) {
      saveToStorage(LAST_LOCATION_KEY, currentLocation)
    }
  }, [currentLocation])

  const setCurrentLocation = useCallback((location: Location) => {
    setCurrentLocationState(location)
  }, [])

  const addFavorite = useCallback((location: Location) => {
    setFavorites((prev) => {
      // Don't add duplicates
      if (prev.some((f) => f.id === location.id)) {
        return prev
      }

      const favorite: FavoriteLocation = {
        ...location,
        addedAt: new Date().toISOString(),
      }

      return [favorite, ...prev]
    })
  }, [])

  const removeFavorite = useCallback((locationId: number) => {
    setFavorites((prev) => prev.filter((f) => f.id !== locationId))
  }, [])

  const isFavorite = useCallback(
    (locationId: number) => {
      return favorites.some((f) => f.id === locationId)
    },
    [favorites]
  )

  const addRecentSearch = useCallback((location: Location) => {
    setRecentSearches((prev) => {
      // Remove if already exists
      const filtered = prev.filter((l) => l.id !== location.id)
      // Add to front and limit to MAX_RECENT
      return [location, ...filtered].slice(0, MAX_RECENT)
    })
  }, [])

  const clearRecentSearches = useCallback(() => {
    setRecentSearches([])
    localStorage.removeItem(RECENT_KEY)
  }, [])

  const value = useMemo(
    () => ({
      currentLocation,
      favorites,
      recentSearches,
      isLoading,
      setCurrentLocation,
      addFavorite,
      removeFavorite,
      isFavorite,
      addRecentSearch,
      clearRecentSearches,
    }),
    [
      currentLocation,
      favorites,
      recentSearches,
      isLoading,
      setCurrentLocation,
      addFavorite,
      removeFavorite,
      isFavorite,
      addRecentSearch,
      clearRecentSearches,
    ]
  )

  return (
    <LocationContext.Provider value={value}>{children}</LocationContext.Provider>
  )
}

export function useLocation(): LocationContextType {
  const context = useContext(LocationContext)
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider')
  }
  return context
}
