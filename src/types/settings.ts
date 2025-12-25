export type TemperatureUnit = 'celsius' | 'fahrenheit'
export type SpeedUnit = 'kmh' | 'mph' | 'ms' | 'knots'
export type PrecipitationUnit = 'mm' | 'inch'
export type PressureUnit = 'hPa' | 'inHg' | 'mmHg'
export type TimeFormat = '12h' | '24h'
export type Theme = 'light' | 'dark' | 'system'

export interface Settings {
  temperatureUnit: TemperatureUnit
  speedUnit: SpeedUnit
  precipitationUnit: PrecipitationUnit
  pressureUnit: PressureUnit
  timeFormat: TimeFormat
  defaultLocation?: {
    latitude: number
    longitude: number
    name: string
  }
  // API Keys for enhanced features
  openWeatherMapApiKey?: string
}

export const DEFAULT_SETTINGS: Settings = {
  temperatureUnit: 'celsius',
  speedUnit: 'kmh',
  precipitationUnit: 'mm',
  pressureUnit: 'hPa',
  timeFormat: '12h',
}

// Unit conversion helpers
export const TEMPERATURE_CONVERSIONS = {
  toFahrenheit: (c: number) => (c * 9) / 5 + 32,
  toCelsius: (f: number) => ((f - 32) * 5) / 9,
}

export const SPEED_CONVERSIONS = {
  kmhToMph: (kmh: number) => kmh * 0.621371,
  kmhToMs: (kmh: number) => kmh / 3.6,
  kmhToKnots: (kmh: number) => kmh * 0.539957,
  mphToKmh: (mph: number) => mph / 0.621371,
}

export const PRECIPITATION_CONVERSIONS = {
  mmToInch: (mm: number) => mm * 0.0393701,
  inchToMm: (inch: number) => inch / 0.0393701,
}

export const PRESSURE_CONVERSIONS = {
  hPaToInHg: (hPa: number) => hPa * 0.02953,
  hPaToMmHg: (hPa: number) => hPa * 0.750062,
  inHgToHPa: (inHg: number) => inHg / 0.02953,
}
