// Weather data types based on Open-Meteo API responses

export interface CurrentWeather {
  time: string
  temperature: number
  apparentTemperature: number
  humidity: number
  isDay: boolean
  precipitation: number
  weatherCode: number
  windSpeed: number
  windDirection: number
  pressure: number
}

export interface HourlyForecast {
  time: string
  temperature: number
  apparentTemperature: number
  humidity: number
  precipitationProbability: number
  precipitation: number
  weatherCode: number
  windSpeed: number
  windDirection: number
  uvIndex: number
  visibility: number
  pressure: number
}

export interface DailyForecast {
  date: string
  weatherCode: number
  temperatureMax: number
  temperatureMin: number
  apparentTemperatureMax: number
  apparentTemperatureMin: number
  sunrise: string
  sunset: string
  uvIndexMax: number
  precipitationSum: number
  precipitationProbabilityMax: number
  windSpeedMax: number
  windGustsMax: number
}

export interface WeatherData {
  current: CurrentWeather
  hourly: HourlyForecast[]
  daily: DailyForecast[]
  timezone: string
  timezoneAbbreviation: string
}

export interface HistoricalWeather {
  date: string
  temperatureMax: number
  temperatureMin: number
  temperatureMean: number
  precipitationSum: number
  windSpeedMax: number
}

export interface ClimateNormal {
  month: number
  temperatureMax: number
  temperatureMin: number
  precipitationSum: number
}

// WMO Weather interpretation codes
export type WeatherCondition =
  | 'clear'
  | 'partly-cloudy'
  | 'cloudy'
  | 'foggy'
  | 'drizzle'
  | 'rain'
  | 'freezing-rain'
  | 'snow'
  | 'sleet'
  | 'thunderstorm'

export interface WeatherCodeInfo {
  code: number
  condition: WeatherCondition
  description: string
  icon: string
  iconNight?: string
}
