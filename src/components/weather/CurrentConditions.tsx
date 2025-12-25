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

  const { current } = weather
  const icon = getWeatherIcon(current.weatherCode, current.isDay)
  const description = getWeatherDescription(current.weatherCode)

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

        {/* Main temperature and icon */}
        <div className="flex items-center justify-between">
          <div>
            <div className="text-6xl font-light text-macos-gray-900 dark:text-white">
              {formatTemperature(current.temperature, settings.temperatureUnit, false)}
            </div>
            <p className="text-lg text-macos-gray-600 dark:text-macos-gray-300 mt-1">
              {description}
            </p>
          </div>
          <div className="text-7xl">{icon}</div>
        </div>

        {/* Additional info */}
        <div className="mt-6 flex flex-wrap gap-4 text-sm text-macos-gray-600 dark:text-macos-gray-400">
          <div>
            <span className="text-macos-gray-400 dark:text-macos-gray-500">
              Feels like{' '}
            </span>
            <span className="text-macos-gray-900 dark:text-white font-medium">
              {formatTemperature(
                current.apparentTemperature,
                settings.temperatureUnit
              )}
            </span>
          </div>
          <div>
            <span className="text-macos-gray-400 dark:text-macos-gray-500">
              Wind{' '}
            </span>
            <span className="text-macos-gray-900 dark:text-white font-medium">
              {formatWindSpeed(current.windSpeed, settings.speedUnit)}
            </span>
          </div>
          <div>
            <span className="text-macos-gray-400 dark:text-macos-gray-500">
              Humidity{' '}
            </span>
            <span className="text-macos-gray-900 dark:text-white font-medium">
              {current.humidity}%
            </span>
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
