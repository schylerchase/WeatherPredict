import { format, formatDistanceToNow, isToday, isTomorrow, parseISO } from 'date-fns'
import type { Settings } from '../types/settings'
import {
  TEMPERATURE_CONVERSIONS,
  SPEED_CONVERSIONS,
  PRECIPITATION_CONVERSIONS,
  PRESSURE_CONVERSIONS,
} from '../types/settings'

// Temperature formatting
export function formatTemperature(
  celsius: number,
  unit: Settings['temperatureUnit'] = 'celsius',
  showUnit: boolean = true
): string {
  const value =
    unit === 'fahrenheit'
      ? TEMPERATURE_CONVERSIONS.toFahrenheit(celsius)
      : celsius

  const rounded = Math.round(value)
  const unitSymbol = unit === 'fahrenheit' ? '°F' : '°C'

  return showUnit ? `${rounded}${unitSymbol}` : `${rounded}°`
}

// Wind speed formatting
export function formatWindSpeed(
  kmh: number,
  unit: Settings['speedUnit'] = 'kmh',
  showUnit: boolean = true
): string {
  let value: number
  let unitLabel: string

  switch (unit) {
    case 'mph':
      value = SPEED_CONVERSIONS.kmhToMph(kmh)
      unitLabel = 'mph'
      break
    case 'ms':
      value = SPEED_CONVERSIONS.kmhToMs(kmh)
      unitLabel = 'm/s'
      break
    case 'knots':
      value = SPEED_CONVERSIONS.kmhToKnots(kmh)
      unitLabel = 'kn'
      break
    default:
      value = kmh
      unitLabel = 'km/h'
  }

  const rounded = Math.round(value)
  return showUnit ? `${rounded} ${unitLabel}` : `${rounded}`
}

// Precipitation formatting
export function formatPrecipitation(
  mm: number,
  unit: Settings['precipitationUnit'] = 'mm',
  showUnit: boolean = true
): string {
  const value =
    unit === 'inch' ? PRECIPITATION_CONVERSIONS.mmToInch(mm) : mm

  const formatted = value < 1 ? value.toFixed(1) : Math.round(value).toString()
  const unitLabel = unit === 'inch' ? 'in' : 'mm'

  return showUnit ? `${formatted} ${unitLabel}` : formatted
}

// Pressure formatting
export function formatPressure(
  hPa: number,
  unit: Settings['pressureUnit'] = 'hPa',
  showUnit: boolean = true
): string {
  let value: number
  let unitLabel: string

  switch (unit) {
    case 'inHg':
      value = PRESSURE_CONVERSIONS.hPaToInHg(hPa)
      unitLabel = 'inHg'
      break
    case 'mmHg':
      value = PRESSURE_CONVERSIONS.hPaToMmHg(hPa)
      unitLabel = 'mmHg'
      break
    default:
      value = hPa
      unitLabel = 'hPa'
  }

  const formatted = unit === 'inHg' ? value.toFixed(2) : Math.round(value).toString()
  return showUnit ? `${formatted} ${unitLabel}` : formatted
}

// Percentage formatting
export function formatPercentage(value: number): string {
  return `${Math.round(value)}%`
}

// Visibility formatting
export function formatVisibility(meters: number): string {
  if (meters >= 10000) {
    return `${Math.round(meters / 1000)} km`
  } else if (meters >= 1000) {
    return `${(meters / 1000).toFixed(1)} km`
  } else {
    return `${Math.round(meters)} m`
  }
}

// UV Index formatting with risk level
export function formatUVIndex(value: number): { value: string; level: string; color: string } {
  const rounded = Math.round(value)

  if (rounded <= 2) {
    return { value: rounded.toString(), level: 'Low', color: 'text-green-500' }
  } else if (rounded <= 5) {
    return { value: rounded.toString(), level: 'Moderate', color: 'text-yellow-500' }
  } else if (rounded <= 7) {
    return { value: rounded.toString(), level: 'High', color: 'text-orange-500' }
  } else if (rounded <= 10) {
    return { value: rounded.toString(), level: 'Very High', color: 'text-red-500' }
  } else {
    return { value: rounded.toString(), level: 'Extreme', color: 'text-purple-500' }
  }
}

// Wind direction formatting
export function formatWindDirection(degrees: number): string {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW']
  const index = Math.round(degrees / 22.5) % 16
  return directions[index]
}

// Time formatting
export function formatTime(
  dateString: string,
  format12h: boolean = true
): string {
  const date = parseISO(dateString)
  return format(date, format12h ? 'h:mm a' : 'HH:mm')
}

export function formatHour(dateString: string, format12h: boolean = true): string {
  const date = parseISO(dateString)
  return format(date, format12h ? 'ha' : 'HH:00')
}

// Date formatting
export function formatDate(dateString: string): string {
  const date = parseISO(dateString)

  if (isToday(date)) {
    return 'Today'
  }

  if (isTomorrow(date)) {
    return 'Tomorrow'
  }

  return format(date, 'EEE, MMM d')
}

export function formatShortDate(dateString: string): string {
  const date = parseISO(dateString)

  if (isToday(date)) {
    return 'Today'
  }

  if (isTomorrow(date)) {
    return 'Tomorrow'
  }

  return format(date, 'EEE')
}

export function formatFullDate(dateString: string): string {
  return format(parseISO(dateString), 'EEEE, MMMM d, yyyy')
}

// Relative time
export function formatRelativeTime(dateString: string): string {
  return formatDistanceToNow(parseISO(dateString), { addSuffix: true })
}

// Sunrise/sunset time
export function formatSunTime(dateString: string): string {
  return format(parseISO(dateString), 'h:mm a')
}
