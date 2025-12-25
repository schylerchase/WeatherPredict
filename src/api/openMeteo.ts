import { API_CONFIG, cachedApiClient } from './client'
import type {
  WeatherData,
  CurrentWeather,
  HourlyForecast,
  DailyForecast,
} from '../types/weather'

// Open-Meteo API response types
interface OpenMeteoResponse {
  latitude: number
  longitude: number
  timezone: string
  timezone_abbreviation: string
  current?: {
    time: string
    temperature_2m: number
    relative_humidity_2m: number
    apparent_temperature: number
    is_day: number
    precipitation: number
    weather_code: number
    wind_speed_10m: number
    wind_direction_10m: number
    pressure_msl: number
  }
  hourly?: {
    time: string[]
    temperature_2m: number[]
    relative_humidity_2m: number[]
    apparent_temperature: number[]
    precipitation_probability: number[]
    precipitation: number[]
    weather_code: number[]
    wind_speed_10m: number[]
    wind_direction_10m: number[]
    uv_index: number[]
    visibility: number[]
    pressure_msl: number[]
  }
  daily?: {
    time: string[]
    weather_code: number[]
    temperature_2m_max: number[]
    temperature_2m_min: number[]
    apparent_temperature_max: number[]
    apparent_temperature_min: number[]
    sunrise: string[]
    sunset: string[]
    uv_index_max: number[]
    precipitation_sum: number[]
    precipitation_probability_max: number[]
    wind_speed_10m_max: number[]
    wind_gusts_10m_max: number[]
  }
}

// Default parameters for the forecast request
const DEFAULT_CURRENT = [
  'temperature_2m',
  'relative_humidity_2m',
  'apparent_temperature',
  'is_day',
  'precipitation',
  'weather_code',
  'wind_speed_10m',
  'wind_direction_10m',
  'pressure_msl',
]

const DEFAULT_HOURLY = [
  'temperature_2m',
  'relative_humidity_2m',
  'apparent_temperature',
  'precipitation_probability',
  'precipitation',
  'weather_code',
  'wind_speed_10m',
  'wind_direction_10m',
  'uv_index',
  'visibility',
  'pressure_msl',
]

const DEFAULT_DAILY = [
  'weather_code',
  'temperature_2m_max',
  'temperature_2m_min',
  'apparent_temperature_max',
  'apparent_temperature_min',
  'sunrise',
  'sunset',
  'uv_index_max',
  'precipitation_sum',
  'precipitation_probability_max',
  'wind_speed_10m_max',
  'wind_gusts_10m_max',
]

interface ForecastParams {
  latitude: number
  longitude: number
  forecastDays?: number
  timezone?: string
}

function transformCurrentWeather(
  current: OpenMeteoResponse['current']
): CurrentWeather | null {
  if (!current) return null

  return {
    time: current.time,
    temperature: current.temperature_2m,
    apparentTemperature: current.apparent_temperature,
    humidity: current.relative_humidity_2m,
    isDay: current.is_day === 1,
    precipitation: current.precipitation,
    weatherCode: current.weather_code,
    windSpeed: current.wind_speed_10m,
    windDirection: current.wind_direction_10m,
    pressure: current.pressure_msl,
  }
}

function transformHourlyForecast(
  hourly: OpenMeteoResponse['hourly']
): HourlyForecast[] {
  if (!hourly) return []

  return hourly.time.map((time, i) => ({
    time,
    temperature: hourly.temperature_2m[i],
    apparentTemperature: hourly.apparent_temperature[i],
    humidity: hourly.relative_humidity_2m[i],
    precipitationProbability: hourly.precipitation_probability[i],
    precipitation: hourly.precipitation[i],
    weatherCode: hourly.weather_code[i],
    windSpeed: hourly.wind_speed_10m[i],
    windDirection: hourly.wind_direction_10m[i],
    uvIndex: hourly.uv_index[i],
    visibility: hourly.visibility[i],
    pressure: hourly.pressure_msl[i],
  }))
}

function transformDailyForecast(
  daily: OpenMeteoResponse['daily']
): DailyForecast[] {
  if (!daily) return []

  return daily.time.map((date, i) => ({
    date,
    weatherCode: daily.weather_code[i],
    temperatureMax: daily.temperature_2m_max[i],
    temperatureMin: daily.temperature_2m_min[i],
    apparentTemperatureMax: daily.apparent_temperature_max[i],
    apparentTemperatureMin: daily.apparent_temperature_min[i],
    sunrise: daily.sunrise[i],
    sunset: daily.sunset[i],
    uvIndexMax: daily.uv_index_max[i],
    precipitationSum: daily.precipitation_sum[i],
    precipitationProbabilityMax: daily.precipitation_probability_max[i],
    windSpeedMax: daily.wind_speed_10m_max[i],
    windGustsMax: daily.wind_gusts_10m_max[i],
  }))
}

export async function getWeatherForecast(
  params: ForecastParams
): Promise<WeatherData> {
  const url = new URL(`${API_CONFIG.OPEN_METEO_BASE}/forecast`)

  url.searchParams.set('latitude', params.latitude.toString())
  url.searchParams.set('longitude', params.longitude.toString())
  url.searchParams.set('current', DEFAULT_CURRENT.join(','))
  url.searchParams.set('hourly', DEFAULT_HOURLY.join(','))
  url.searchParams.set('daily', DEFAULT_DAILY.join(','))
  url.searchParams.set('timezone', params.timezone || 'auto')
  url.searchParams.set('forecast_days', (params.forecastDays || 14).toString())

  const response = await cachedApiClient<OpenMeteoResponse>(url.toString())

  const current = transformCurrentWeather(response.current)
  if (!current) {
    throw new Error('No current weather data available')
  }

  return {
    current,
    hourly: transformHourlyForecast(response.hourly),
    daily: transformDailyForecast(response.daily),
    timezone: response.timezone,
    timezoneAbbreviation: response.timezone_abbreviation,
  }
}

// Historical weather API
interface HistoricalParams {
  latitude: number
  longitude: number
  startDate: string // YYYY-MM-DD
  endDate: string // YYYY-MM-DD
}

interface HistoricalResponse {
  daily: {
    time: string[]
    temperature_2m_max: number[]
    temperature_2m_min: number[]
    temperature_2m_mean: number[]
    precipitation_sum: number[]
    wind_speed_10m_max: number[]
  }
}

export async function getHistoricalWeather(params: HistoricalParams) {
  const url = new URL(`${API_CONFIG.OPEN_METEO_ARCHIVE}/archive`)

  url.searchParams.set('latitude', params.latitude.toString())
  url.searchParams.set('longitude', params.longitude.toString())
  url.searchParams.set('start_date', params.startDate)
  url.searchParams.set('end_date', params.endDate)
  url.searchParams.set(
    'daily',
    'temperature_2m_max,temperature_2m_min,temperature_2m_mean,precipitation_sum,wind_speed_10m_max'
  )
  url.searchParams.set('timezone', 'auto')

  const response = await cachedApiClient<HistoricalResponse>(url.toString(), {
    cacheDuration: 60 * 60 * 1000, // 1 hour cache for historical data
  })

  return response.daily.time.map((date, i) => ({
    date,
    temperatureMax: response.daily.temperature_2m_max[i],
    temperatureMin: response.daily.temperature_2m_min[i],
    temperatureMean: response.daily.temperature_2m_mean[i],
    precipitationSum: response.daily.precipitation_sum[i],
    windSpeedMax: response.daily.wind_speed_10m_max[i],
  }))
}
