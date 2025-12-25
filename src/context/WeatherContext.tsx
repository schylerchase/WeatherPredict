import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from 'react'
import type { WeatherData } from '../types/weather'
import type { Location } from '../types/location'
import { getWeatherForecast } from '../api/openMeteo'
import { useLocation } from './LocationContext'

interface WeatherContextType {
  weather: WeatherData | null
  isLoading: boolean
  error: string | null
  lastUpdated: Date | null
  refetch: () => Promise<void>
}

const WeatherContext = createContext<WeatherContextType | undefined>(undefined)

// Auto-refresh interval (10 minutes)
const REFRESH_INTERVAL = 10 * 60 * 1000

export function WeatherProvider({ children }: { children: ReactNode }) {
  const { currentLocation } = useLocation()
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const fetchWeather = useCallback(async (location: Location) => {
    setIsLoading(true)
    setError(null)

    try {
      const data = await getWeatherForecast({
        latitude: location.latitude,
        longitude: location.longitude,
        timezone: location.timezone,
      })

      setWeather(data)
      setLastUpdated(new Date())
    } catch (err) {
      console.error('Failed to fetch weather:', err)
      setError(
        err instanceof Error ? err.message : 'Failed to fetch weather data'
      )
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Fetch weather when location changes
  useEffect(() => {
    if (currentLocation) {
      fetchWeather(currentLocation)
    } else {
      setWeather(null)
    }
  }, [currentLocation, fetchWeather])

  // Auto-refresh weather data
  useEffect(() => {
    if (!currentLocation) return

    const interval = setInterval(() => {
      fetchWeather(currentLocation)
    }, REFRESH_INTERVAL)

    return () => clearInterval(interval)
  }, [currentLocation, fetchWeather])

  const refetch = useCallback(async () => {
    if (currentLocation) {
      await fetchWeather(currentLocation)
    }
  }, [currentLocation, fetchWeather])

  const value = useMemo(
    () => ({
      weather,
      isLoading,
      error,
      lastUpdated,
      refetch,
    }),
    [weather, isLoading, error, lastUpdated, refetch]
  )

  return (
    <WeatherContext.Provider value={value}>{children}</WeatherContext.Provider>
  )
}

export function useWeather(): WeatherContextType {
  const context = useContext(WeatherContext)
  if (context === undefined) {
    throw new Error('useWeather must be used within a WeatherProvider')
  }
  return context
}
