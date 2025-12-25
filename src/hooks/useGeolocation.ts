import { useState, useCallback } from 'react'
import type { GeolocationState } from '../types/location'

interface UseGeolocationOptions {
  enableHighAccuracy?: boolean
  timeout?: number
  maximumAge?: number
}

const defaultOptions: UseGeolocationOptions = {
  enableHighAccuracy: true,
  timeout: 10000,
  maximumAge: 60000, // 1 minute
}

export function useGeolocation(options: UseGeolocationOptions = {}) {
  const [state, setState] = useState<GeolocationState>({
    loading: false,
    error: null,
    coordinates: null,
  })

  const getPosition = useCallback(() => {
    if (!navigator.geolocation) {
      setState({
        loading: false,
        error: 'Geolocation is not supported by your browser',
        coordinates: null,
      })
      return
    }

    setState((prev) => ({ ...prev, loading: true, error: null }))

    const opts = { ...defaultOptions, ...options }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          loading: false,
          error: null,
          coordinates: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          },
        })
      },
      (error) => {
        let errorMessage: string

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location permission denied'
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable'
            break
          case error.TIMEOUT:
            errorMessage = 'Location request timed out'
            break
          default:
            errorMessage = 'An unknown error occurred'
        }

        setState({
          loading: false,
          error: errorMessage,
          coordinates: null,
        })
      },
      opts
    )
  }, [options])

  return {
    ...state,
    getPosition,
    isSupported: typeof navigator !== 'undefined' && 'geolocation' in navigator,
  }
}
