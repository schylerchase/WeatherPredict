import { GlassCard } from '../common/GlassCard'
import { Skeleton } from '../common/Skeleton'
import { useWeather } from '../../context/WeatherContext'
import { useSettings } from '../../context/SettingsContext'
import {
  formatTemperature,
  formatShortDate,
  formatPercentage,
} from '../../utils/formatters'
import { getWeatherIcon } from '../../utils/weatherCodes'
import { cn } from '../../utils/cn'
import type { DailyForecast as DailyForecastType } from '../../types/weather'

interface DailyRowProps {
  day: DailyForecastType
  minTemp: number
  maxTemp: number
  isToday?: boolean
}

function DailyRow({ day, minTemp, maxTemp, isToday = false }: DailyRowProps) {
  const { settings } = useSettings()

  // Calculate position of temperature bar
  const range = maxTemp - minTemp
  const dayRange = day.temperatureMax - day.temperatureMin
  const leftPercent = range > 0 ? ((day.temperatureMin - minTemp) / range) * 100 : 0
  const widthPercent = range > 0 ? (dayRange / range) * 100 : 100

  return (
    <div
      className={cn(
        'flex items-center gap-3 py-3 border-b border-macos-gray-100 dark:border-macos-gray-700/50 last:border-b-0',
        isToday && 'bg-macos-blue/5 dark:bg-macos-blue/10 -mx-4 px-4 rounded-macos'
      )}
    >
      {/* Day name */}
      <div className="w-20 shrink-0">
        <span
          className={cn(
            'text-sm font-medium',
            isToday
              ? 'text-macos-blue'
              : 'text-macos-gray-900 dark:text-white'
          )}
        >
          {formatShortDate(day.date)}
        </span>
      </div>

      {/* Weather icon */}
      <div className="w-10 shrink-0 text-center text-xl">
        {getWeatherIcon(day.weatherCode, true)}
      </div>

      {/* Precipitation probability */}
      <div className="w-12 shrink-0 text-right">
        {day.precipitationProbabilityMax > 0 ? (
          <span className="text-xs text-macos-blue">
            {formatPercentage(day.precipitationProbabilityMax)}
          </span>
        ) : (
          <span className="text-xs text-transparent">0%</span>
        )}
      </div>

      {/* Min temperature */}
      <div className="w-10 shrink-0 text-right">
        <span className="text-sm text-macos-gray-500 dark:text-macos-gray-400">
          {formatTemperature(day.temperatureMin, settings.temperatureUnit, false)}
        </span>
      </div>

      {/* Temperature bar */}
      <div className="flex-1 mx-2">
        <div className="relative h-1 bg-macos-gray-200 dark:bg-macos-gray-700 rounded-full">
          <div
            className="absolute h-full rounded-full bg-gradient-to-r from-macos-blue to-macos-orange"
            style={{
              left: `${leftPercent}%`,
              width: `${widthPercent}%`,
            }}
          />
        </div>
      </div>

      {/* Max temperature */}
      <div className="w-10 shrink-0">
        <span className="text-sm font-medium text-macos-gray-900 dark:text-white">
          {formatTemperature(day.temperatureMax, settings.temperatureUnit, false)}
        </span>
      </div>
    </div>
  )
}

function DailyLoadingSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 7 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 py-2">
          <Skeleton variant="text" width={60} height={16} />
          <Skeleton variant="circular" width={24} height={24} />
          <Skeleton variant="text" width={32} height={14} />
          <div className="flex-1">
            <Skeleton variant="rounded" height={4} />
          </div>
          <Skeleton variant="text" width={32} height={14} />
        </div>
      ))}
    </div>
  )
}

export function DailyForecast() {
  const { weather, isLoading } = useWeather()

  if (isLoading && !weather) {
    return (
      <GlassCard>
        <h3 className="text-sm font-semibold text-macos-gray-500 dark:text-macos-gray-400 uppercase tracking-wide mb-3">
          14-Day Forecast
        </h3>
        <DailyLoadingSkeleton />
      </GlassCard>
    )
  }

  if (!weather) {
    return null
  }

  const { daily } = weather

  // Find min and max temperatures across all days for bar scaling
  const allTemps = daily.flatMap((d) => [d.temperatureMin, d.temperatureMax])
  const minTemp = Math.min(...allTemps)
  const maxTemp = Math.max(...allTemps)

  return (
    <GlassCard>
      <h3 className="text-sm font-semibold text-macos-gray-500 dark:text-macos-gray-400 uppercase tracking-wide mb-3">
        14-Day Forecast
      </h3>

      <div className="-mx-4 px-4">
        {daily.map((day, index) => (
          <DailyRow
            key={day.date}
            day={day}
            minTemp={minTemp}
            maxTemp={maxTemp}
            isToday={index === 0}
          />
        ))}
      </div>
    </GlassCard>
  )
}
