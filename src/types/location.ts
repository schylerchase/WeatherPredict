export interface Location {
  id: number
  name: string
  latitude: number
  longitude: number
  country: string
  countryCode: string
  timezone: string
  admin1?: string // State/Province
  admin2?: string // County/District
  population?: number
  elevation?: number
}

export interface GeocodingResult {
  id: number
  name: string
  latitude: number
  longitude: number
  elevation?: number
  timezone: string
  country: string
  country_code: string
  admin1?: string
  admin2?: string
  population?: number
}

export interface Coordinates {
  latitude: number
  longitude: number
}

export interface GeolocationState {
  loading: boolean
  error: string | null
  coordinates: Coordinates | null
}

export interface FavoriteLocation extends Location {
  addedAt: string
}
