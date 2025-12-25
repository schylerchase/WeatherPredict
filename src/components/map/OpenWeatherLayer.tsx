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
 */
export function OpenWeatherLayer({
  layerType,
  apiKey,
  opacity = 0.6,
}: OpenWeatherLayerProps) {
  if (!apiKey) {
    return null
  }

  const tileUrl = `https://tile.openweathermap.org/map/${layerType}/{z}/{x}/{y}.png?appid=${apiKey}`

  return (
    <TileLayer
      url={tileUrl}
      opacity={opacity}
      attribution='<a href="https://openweathermap.org/">OpenWeatherMap</a>'
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
