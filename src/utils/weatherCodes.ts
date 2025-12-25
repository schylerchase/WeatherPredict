import type { WeatherCodeInfo, WeatherCondition } from '../types/weather'

// WMO Weather interpretation codes
// https://open-meteo.com/en/docs#weathervariables

const weatherCodes: Record<number, WeatherCodeInfo> = {
  0: {
    code: 0,
    condition: 'clear',
    description: 'Clear sky',
    icon: '☀️',
    iconNight: '🌙',
  },
  1: {
    code: 1,
    condition: 'clear',
    description: 'Mainly clear',
    icon: '🌤️',
    iconNight: '🌙',
  },
  2: {
    code: 2,
    condition: 'partly-cloudy',
    description: 'Partly cloudy',
    icon: '⛅',
    iconNight: '☁️',
  },
  3: {
    code: 3,
    condition: 'cloudy',
    description: 'Overcast',
    icon: '☁️',
    iconNight: '☁️',
  },
  45: {
    code: 45,
    condition: 'foggy',
    description: 'Fog',
    icon: '🌫️',
    iconNight: '🌫️',
  },
  48: {
    code: 48,
    condition: 'foggy',
    description: 'Depositing rime fog',
    icon: '🌫️',
    iconNight: '🌫️',
  },
  51: {
    code: 51,
    condition: 'drizzle',
    description: 'Light drizzle',
    icon: '🌧️',
    iconNight: '🌧️',
  },
  53: {
    code: 53,
    condition: 'drizzle',
    description: 'Moderate drizzle',
    icon: '🌧️',
    iconNight: '🌧️',
  },
  55: {
    code: 55,
    condition: 'drizzle',
    description: 'Dense drizzle',
    icon: '🌧️',
    iconNight: '🌧️',
  },
  56: {
    code: 56,
    condition: 'freezing-rain',
    description: 'Light freezing drizzle',
    icon: '🌨️',
    iconNight: '🌨️',
  },
  57: {
    code: 57,
    condition: 'freezing-rain',
    description: 'Dense freezing drizzle',
    icon: '🌨️',
    iconNight: '🌨️',
  },
  61: {
    code: 61,
    condition: 'rain',
    description: 'Slight rain',
    icon: '🌧️',
    iconNight: '🌧️',
  },
  63: {
    code: 63,
    condition: 'rain',
    description: 'Moderate rain',
    icon: '🌧️',
    iconNight: '🌧️',
  },
  65: {
    code: 65,
    condition: 'rain',
    description: 'Heavy rain',
    icon: '🌧️',
    iconNight: '🌧️',
  },
  66: {
    code: 66,
    condition: 'freezing-rain',
    description: 'Light freezing rain',
    icon: '🌨️',
    iconNight: '🌨️',
  },
  67: {
    code: 67,
    condition: 'freezing-rain',
    description: 'Heavy freezing rain',
    icon: '🌨️',
    iconNight: '🌨️',
  },
  71: {
    code: 71,
    condition: 'snow',
    description: 'Slight snow fall',
    icon: '🌨️',
    iconNight: '🌨️',
  },
  73: {
    code: 73,
    condition: 'snow',
    description: 'Moderate snow fall',
    icon: '🌨️',
    iconNight: '🌨️',
  },
  75: {
    code: 75,
    condition: 'snow',
    description: 'Heavy snow fall',
    icon: '❄️',
    iconNight: '❄️',
  },
  77: {
    code: 77,
    condition: 'snow',
    description: 'Snow grains',
    icon: '🌨️',
    iconNight: '🌨️',
  },
  80: {
    code: 80,
    condition: 'rain',
    description: 'Slight rain showers',
    icon: '🌦️',
    iconNight: '🌧️',
  },
  81: {
    code: 81,
    condition: 'rain',
    description: 'Moderate rain showers',
    icon: '🌦️',
    iconNight: '🌧️',
  },
  82: {
    code: 82,
    condition: 'rain',
    description: 'Violent rain showers',
    icon: '⛈️',
    iconNight: '⛈️',
  },
  85: {
    code: 85,
    condition: 'sleet',
    description: 'Slight snow showers',
    icon: '🌨️',
    iconNight: '🌨️',
  },
  86: {
    code: 86,
    condition: 'sleet',
    description: 'Heavy snow showers',
    icon: '🌨️',
    iconNight: '🌨️',
  },
  95: {
    code: 95,
    condition: 'thunderstorm',
    description: 'Thunderstorm',
    icon: '⛈️',
    iconNight: '⛈️',
  },
  96: {
    code: 96,
    condition: 'thunderstorm',
    description: 'Thunderstorm with slight hail',
    icon: '⛈️',
    iconNight: '⛈️',
  },
  99: {
    code: 99,
    condition: 'thunderstorm',
    description: 'Thunderstorm with heavy hail',
    icon: '⛈️',
    iconNight: '⛈️',
  },
}

const defaultWeatherInfo: WeatherCodeInfo = {
  code: -1,
  condition: 'clear',
  description: 'Unknown',
  icon: '❓',
}

export function getWeatherInfo(code: number): WeatherCodeInfo {
  return weatherCodes[code] || defaultWeatherInfo
}

export function getWeatherIcon(code: number, isDay: boolean = true): string {
  const info = getWeatherInfo(code)
  return isDay ? info.icon : (info.iconNight || info.icon)
}

export function getWeatherDescription(code: number): string {
  return getWeatherInfo(code).description
}

export function getWeatherCondition(code: number): WeatherCondition {
  return getWeatherInfo(code).condition
}

// Get background gradient based on weather condition and time of day
export function getWeatherGradient(
  condition: WeatherCondition,
  isDay: boolean
): string {
  if (!isDay) {
    return 'from-slate-900 via-slate-800 to-indigo-900'
  }

  switch (condition) {
    case 'clear':
      return 'from-sky-400 via-blue-500 to-blue-600'
    case 'partly-cloudy':
      return 'from-sky-400 via-blue-400 to-gray-400'
    case 'cloudy':
      return 'from-gray-400 via-gray-500 to-gray-600'
    case 'foggy':
      return 'from-gray-300 via-gray-400 to-gray-500'
    case 'drizzle':
    case 'rain':
      return 'from-gray-500 via-slate-600 to-slate-700'
    case 'freezing-rain':
    case 'sleet':
      return 'from-slate-400 via-blue-gray-500 to-slate-600'
    case 'snow':
      return 'from-slate-200 via-blue-100 to-gray-300'
    case 'thunderstorm':
      return 'from-gray-700 via-slate-800 to-gray-900'
    default:
      return 'from-sky-400 via-blue-500 to-blue-600'
  }
}
