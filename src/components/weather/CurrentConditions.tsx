import { GlassCard } from '../common/GlassCard'
import { SkeletonWeatherCard } from '../common/Skeleton'
import { RefreshIcon } from '../common/Icon'
import { useWeather } from '../../context/WeatherContext'
import { useLocation } from '../../context/LocationContext'
import { useSettings } from '../../context/SettingsContext'
import {
  formatTemperature,
  formatWindSpeed,
  formatRelativeTime,
} from '../../utils/formatters'
import { getWeatherIcon, getWeatherDescription } from '../../utils/weatherCodes'
import { cn } from '../../utils/cn'

// Helper to get UV Index level and color
function getUVLevel(uv: number): { label: string; color: string } {
  if (uv <= 2) return { label: 'Low', color: 'text-green-500' }
  if (uv <= 5) return { label: 'Moderate', color: 'text-yellow-500' }
  if (uv <= 7) return { label: 'High', color: 'text-orange-500' }
  if (uv <= 10) return { label: 'Very High', color: 'text-red-500' }
  return { label: 'Extreme', color: 'text-purple-500' }
}

// Helper to get wind direction as compass
function getWindDirection(degrees: number): string {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW']
  const index = Math.round(degrees / 22.5) % 16
  return directions[index]
}

export function CurrentConditions() {
  const { weather, isLoading, error, lastUpdated, refetch } = useWeather()
  const { currentLocation } = useLocation()
  const { settings } = useSettings()

  if (!currentLocation) {
    return (
      <GlassCard className="text-center py-12">
        <p className="text-macos-gray-500 dark:text-macos-gray-400">
          Search for a location to see weather data
        </p>
      </GlassCard>
    )
  }

  if (isLoading && !weather) {
    return <SkeletonWeatherCard />
  }

  if (error) {
    return (
      <GlassCard className="text-center py-8">
        <p className="text-macos-red mb-4">{error}</p>
        <button
          onClick={refetch}
          className="text-macos-blue hover:underline"
        >
          Try again
        </button>
      </GlassCard>
    )
  }

  if (!weather) {
    return null
  }

  const { current, daily, hourly } = weather
  const today = daily[0]
  const currentHour = hourly[0]
  const icon = getWeatherIcon(current.weatherCode, current.isDay)
  const description = getWeatherDescription(current.weatherCode)
  const uvInfo = getUVLevel(currentHour?.uvIndex || 0)
  const windDir = getWindDirection(current.windDirection)

  return (
    <GlassCard variant="elevated" className="relative overflow-hidden">
      {/* Background gradient based on weather */}
      <div
        className={cn(
          'absolute inset-0 opacity-20 dark:opacity-30',
          current.isDay
            ? 'bg-gradient-to-br from-sky-400 to-blue-500'
            : 'bg-gradient-to-br from-indigo-800 to-slate-900'
        )}
      />

      <div className="relative">
        {/* Header with location and refresh */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-macos-gray-900 dark:text-white">
              {currentLocation.name}
            </h2>
            {currentLocation.admin1 && (
              <p className="text-sm text-macos-gray-500 dark:text-macos-gray-400">
                {currentLocation.admin1}, {currentLocation.country}
              </p>
            )}
          </div>
          <button
            onClick={refetch}
            disabled={isLoading}
            className={cn(
              'p-2 rounded-full transition-all',
              'hover:bg-white/20 dark:hover:bg-white/10',
              isLoading && 'animate-spin'
            )}
            aria-label="Refresh weather"
          >
            <RefreshIcon size={20} />
          </button>
        </div>

        {/* Main temperature display */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-3">
              <span className="text-6xl font-light text-macos-gray-900 dark:text-white">
                {formatTemperature(current.temperature, settings.temperatureUnit, false)}
              </span>
              {today && (
                <div className="text-sm">
                  <span className="text-macos-orange font-medium">
                    H:{formatTemperature(today.temperatureMax, settings.temperatureUnit)}
                  </span>
                  <span className="text-macos-gray-400 mx-1">/</span>
                  <span className="text-macos-blue font-medium">
                    L:{formatTemperature(today.temperatureMin, settings.temperatureUnit)}
                  </span>
                </div>
              )}
            </div>
            <p className="text-lg text-macos-gray-600 dark:text-macos-gray-300 mt-1">
              {description}
            </p>
            {/* Feels like - prominent display like AccuWeather's RealFeel */}
            <p className="text-sm text-macos-gray-500 dark:text-macos-gray-400 mt-1">
              Feels like{' '}
              <span className="font-semibold text-macos-gray-700 dark:text-macos-gray-200">
                {formatTemperature(current.apparentTemperature, settings.temperatureUnit)}
              </span>
            </p>
          </div>
          <div className="text-7xl">{icon}</div>
        </div>

        {/* Quick stats grid */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Wind */}
          <div className="bg-white/30 dark:bg-white/5 rounded-lg p-3">
            <div className="text-xs text-macos-gray-500 dark:text-macos-gray-400 mb-1">💨 Wind</div>
            <div className="font-semibold text-macos-gray-900 dark:text-white">
              {formatWindSpeed(current.windSpeed, settings.speedUnit)}
            </div>
            <div className="text-xs text-macos-gray-500 dark:text-macos-gray-400">
              {windDir}
            </div>
          </div>

          {/* Humidity */}
          <div className="bg-white/30 dark:bg-white/5 rounded-lg p-3">
            <div className="text-xs text-macos-gray-500 dark:text-macos-gray-400 mb-1">💧 Humidity</div>
            <div className="font-semibold text-macos-gray-900 dark:text-white">
              {current.humidity}%
            </div>
            <div className="text-xs text-macos-gray-500 dark:text-macos-gray-400">
              {current.humidity < 30 ? 'Dry' : current.humidity < 60 ? 'Comfortable' : 'Humid'}
            </div>
          </div>

          {/* UV Index */}
          <div className="bg-white/30 dark:bg-white/5 rounded-lg p-3">
            <div className="text-xs text-macos-gray-500 dark:text-macos-gray-400 mb-1">☀️ UV Index</div>
            <div className={cn("font-semibold", uvInfo.color)}>
              {currentHour?.uvIndex?.toFixed(1) || '0'}
            </div>
            <div className={cn("text-xs", uvInfo.color)}>
              {uvInfo.label}
            </div>
          </div>

          {/* Precipitation */}
          <div className="bg-white/30 dark:bg-white/5 rounded-lg p-3">
            <div className="text-xs text-macos-gray-500 dark:text-macos-gray-400 mb-1">🌧️ Precip</div>
            <div className="font-semibold text-macos-gray-900 dark:text-white">
              {today?.precipitationProbabilityMax || 0}%
            </div>
            <div className="text-xs text-macos-gray-500 dark:text-macos-gray-400">
              {today?.precipitationSum?.toFixed(1) || 0} mm today
            </div>
          </div>
        </div>

        {/* Last updated */}
        {lastUpdated && (
          <p className="mt-4 text-xs text-macos-gray-400 dark:text-macos-gray-500">
            Updated {formatRelativeTime(lastUpdated.toISOString())}
          </p>
        )}
      </div>
    </GlassCard>
  )
}
