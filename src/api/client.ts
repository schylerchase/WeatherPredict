// Base API client with error handling

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export const API_CONFIG = {
  OPEN_METEO_BASE: 'https://api.open-meteo.com/v1',
  OPEN_METEO_ARCHIVE: 'https://archive-api.open-meteo.com/v1',
  GEOCODING_BASE: 'https://geocoding-api.open-meteo.com/v1',
  RAINVIEWER_BASE: 'https://api.rainviewer.com/public',
} as const

export async function apiClient<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        Accept: 'application/json',
        ...options?.headers,
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new ApiError(response.status, errorText || `HTTP ${response.status}`)
    }

    return response.json()
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(0, error instanceof Error ? error.message : 'Network error')
  }
}

// Cache utility for API responses
const cache = new Map<string, { data: unknown; timestamp: number }>()
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

export async function cachedApiClient<T>(
  url: string,
  options?: RequestInit & { cacheDuration?: number }
): Promise<T> {
  const cacheKey = url
  const cached = cache.get(cacheKey)
  const duration = options?.cacheDuration ?? CACHE_DURATION

  if (cached && Date.now() - cached.timestamp < duration) {
    return cached.data as T
  }

  const data = await apiClient<T>(url, options)
  cache.set(cacheKey, { data, timestamp: Date.now() })
  return data
}

// Clear cache (useful for forcing refresh)
export function clearCache(): void {
  cache.clear()
}
