import { API_CONFIG, cachedApiClient } from './client'
import type { Location, GeocodingResult } from '../types/location'

interface GeocodingResponse {
  results?: GeocodingResult[]
}

export async function searchLocations(
  query: string,
  options: { count?: number; language?: string } = {}
): Promise<Location[]> {
  if (query.length < 2) {
    return []
  }

  const url = new URL(`${API_CONFIG.GEOCODING_BASE}/search`)
  url.searchParams.set('name', query)
  url.searchParams.set('count', (options.count || 10).toString())
  url.searchParams.set('language', options.language || 'en')
  url.searchParams.set('format', 'json')

  const response = await cachedApiClient<GeocodingResponse>(url.toString(), {
    cacheDuration: 30 * 60 * 1000, // 30 minute cache for geocoding
  })

  if (!response.results) {
    return []
  }

  return response.results.map((result) => ({
    id: result.id,
    name: result.name,
    latitude: result.latitude,
    longitude: result.longitude,
    country: result.country,
    countryCode: result.country_code,
    timezone: result.timezone,
    admin1: result.admin1,
    admin2: result.admin2,
    population: result.population,
    elevation: result.elevation,
  }))
}

// Reverse geocoding - get location name from coordinates
export async function reverseGeocode(
  latitude: number,
  longitude: number
): Promise<Location | null> {
  // Open-Meteo doesn't have a direct reverse geocoding API
  // We'll use a workaround by searching for a location near these coordinates
  // For now, we'll return a basic location object

  return {
    id: 0,
    name: 'Current Location',
    latitude,
    longitude,
    country: '',
    countryCode: '',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  }
}

// Format location display name
export function formatLocationName(location: Location): string {
  const parts = [location.name]

  if (location.admin1) {
    parts.push(location.admin1)
  }

  if (location.country) {
    parts.push(location.country)
  }

  return parts.join(', ')
}

// Get short location name (city and country)
export function getShortLocationName(location: Location): string {
  if (location.country) {
    return `${location.name}, ${location.countryCode || location.country}`
  }
  return location.name
}
