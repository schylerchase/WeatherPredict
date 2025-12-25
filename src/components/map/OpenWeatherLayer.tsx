import { useEffect } from 'react'
import { TileLayer } from 'react-leaflet'

// OpenWeatherMap layer types
export type OWMLayerType =
  | 'temp_new'      // Temperature
  | 'precipitation_new'  // Precipitation
  | 'wind_new'      // Wind speed
  | 'clouds_new'    // Cloud coverage
  | 'pressure_new'  // Sea level pressure

interface OpenWeatherLayerProps {
  layerType: OWMLayerType
  apiKey: string
  opacity?: number
}

/**
 * OpenWeatherMap tile layer component.
 * Requires a free API key from https://openweathermap.org/api
 *
 * Free tier includes:
 * - 1,000 API calls/day
 * - Weather maps 1.0 tiles
 *
 * NOTE: New API keys can take up to 2 hours to activate!
 */
export function OpenWeatherLayer({
  layerType,
  apiKey,
  opacity = 0.6,
}: OpenWeatherLayerProps) {
  // Log for debugging
  useEffect(() => {
    console.log(`[OpenWeatherLayer] Loading ${layerType} layer with API key: ${apiKey.substring(0, 8)}...`)
  }, [layerType, apiKey])

  if (!apiKey) {
    return null
  }

  const tileUrl = `https://tile.openweathermap.org/map/${layerType}/{z}/{x}/{y}.png?appid=${apiKey}`

  return (
    <TileLayer
      url={tileUrl}
      opacity={opacity}
      attribution='<a href="https://openweathermap.org/">OpenWeatherMap</a>'
      eventHandlers={{
        tileerror: (error) => {
          console.error(`[OpenWeatherLayer] Failed to load ${layerType} tile:`, error)
        },
        tileload: () => {
          // Tile loaded successfully
        },
      }}
    />
  )
}

// Helper to get the display name for a layer type
export function getOWMLayerDisplayName(layerType: OWMLayerType): string {
  switch (layerType) {
    case 'temp_new':
      return 'Temperature'
    case 'precipitation_new':
      return 'Precipitation'
    case 'wind_new':
      return 'Wind Speed'
    case 'clouds_new':
      return 'Cloud Coverage'
    case 'pressure_new':
      return 'Pressure'
    default:
      return layerType
  }
}
