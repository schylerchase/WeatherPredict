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

// Nominatim reverse geocoding response
interface NominatimReverseResponse {
  place_id: number
  display_name: string
  address: {
    city?: string
    town?: string
    village?: string
    municipality?: string
    county?: string
    state?: string
    country?: string
    country_code?: string
  }
}

// Reverse geocoding - get location name from coordinates using OpenStreetMap Nominatim
export async function reverseGeocode(
  latitude: number,
  longitude: number
): Promise<Location | null> {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'WeatherPredict/1.0 (weather app)',
      },
    })

    if (!response.ok) {
      throw new Error('Reverse geocoding failed')
    }

    const data: NominatimReverseResponse = await response.json()

    // Get the most specific city-level name
    const cityName =
      data.address.city ||
      data.address.town ||
      data.address.village ||
      data.address.municipality ||
      data.address.county ||
      'Unknown Location'

    return {
      id: data.place_id,
      name: cityName,
      latitude,
      longitude,
      country: data.address.country || '',
      countryCode: data.address.country_code?.toUpperCase() || '',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      admin1: data.address.state,
    }
  } catch (error) {
    console.error('Reverse geocoding error:', error)
    // Fallback to generic name if reverse geocoding fails
    return {
      id: 0,
      name: 'My Location',
      latitude,
      longitude,
      country: '',
      countryCode: '',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    }
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
