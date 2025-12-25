import { useState } from 'react'
import { GlassCard } from '../common/GlassCard'
import { Skeleton } from '../common/Skeleton'
import { useWeather } from '../../context/WeatherContext'
import { useSettings } from '../../context/SettingsContext'
import {
  formatTemperature,
  formatShortDate,
  formatPercentage,
  formatWindSpeed,
} from '../../utils/formatters'
import { getWeatherIcon, getWeatherDescription } from '../../utils/weatherCodes'
import { cn } from '../../utils/cn'
import type { DailyForecast as DailyForecastType } from '../../types/weather'

interface DailyRowProps {
  day: DailyForecastType
  minTemp: number
  maxTemp: number
  isToday?: boolean
  expanded?: boolean
  onToggle?: () => void
}

function DailyRow({ day, minTemp, maxTemp, isToday = false, expanded = false, onToggle }: DailyRowProps) {
  const { settings } = useSettings()

  // Calculate position of temperature bar
  const range = maxTemp - minTemp
  const dayRange = day.temperatureMax - day.temperatureMin
  const leftPercent = range > 0 ? ((day.temperatureMin - minTemp) / range) * 100 : 0
  const widthPercent = range > 0 ? (dayRange / range) * 100 : 100

  const description = getWeatherDescription(day.weatherCode)
  const hasRain = day.precipitationProbabilityMax > 30

  return (
    <div
      className={cn(
        'border-b border-macos-gray-100 dark:border-macos-gray-700/50 last:border-b-0',
        isToday && 'bg-macos-blue/5 dark:bg-macos-blue/10 -mx-4 px-4 rounded-macos'
      )}
    >
      {/* Main row - clickable for expand */}
      <div
        className={cn(
          'flex items-center gap-2 py-3 cursor-pointer',
          'hover:bg-white/30 dark:hover:bg-white/5 transition-colors rounded-lg -mx-2 px-2'
        )}
        onClick={onToggle}
      >
        {/* Day name */}
        <div className="w-16 shrink-0">
          <span
            className={cn(
              'text-sm font-medium',
              isToday
                ? 'text-macos-blue'
                : 'text-macos-gray-900 dark:text-white'
            )}
          >
            {isToday ? 'Today' : formatShortDate(day.date)}
          </span>
        </div>

        {/* Weather icon */}
        <div className="w-8 shrink-0 text-center text-xl">
          {getWeatherIcon(day.weatherCode, true)}
        </div>

        {/* Precipitation probability */}
        <div className="w-12 shrink-0 text-center">
          {hasRain ? (
            <span className={cn(
              "text-xs",
              day.precipitationProbabilityMax >= 70 ? "text-macos-blue font-semibold" : "text-macos-blue"
            )}>
              💧{formatPercentage(day.precipitationProbabilityMax)}
            </span>
          ) : (
            <span className="text-xs text-transparent">—</span>
          )}
        </div>

        {/* Min temperature */}
        <div className="w-10 shrink-0 text-right">
          <span className="text-sm text-macos-blue font-medium">
            {formatTemperature(day.temperatureMin, settings.temperatureUnit, false)}
          </span>
        </div>

        {/* Temperature bar */}
        <div className="flex-1 mx-2 min-w-[60px]">
          <div className="relative h-1.5 bg-macos-gray-200 dark:bg-macos-gray-700 rounded-full overflow-hidden">
            <div
              className="absolute h-full rounded-full bg-gradient-to-r from-macos-blue via-macos-green to-macos-orange"
              style={{
                left: `${leftPercent}%`,
                width: `${widthPercent}%`,
              }}
            />
          </div>
        </div>

        {/* Max temperature */}
        <div className="w-10 shrink-0">
          <span className="text-sm font-semibold text-macos-orange">
            {formatTemperature(day.temperatureMax, settings.temperatureUnit, false)}
          </span>
        </div>
      </div>

      {/* Expanded details */}
      {expanded && (
        <div className="pb-3 pt-1 pl-8 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <div className="text-macos-gray-500 dark:text-macos-gray-400">
            <span className="block text-[10px] uppercase tracking-wide mb-0.5">Condition</span>
            <span className="text-macos-gray-900 dark:text-white">{description}</span>
          </div>
          <div className="text-macos-gray-500 dark:text-macos-gray-400">
            <span className="block text-[10px] uppercase tracking-wide mb-0.5">Wind</span>
            <span className="text-macos-gray-900 dark:text-white">
              {formatWindSpeed(day.windSpeedMax, settings.speedUnit)}
              {day.windGustsMax > day.windSpeedMax + 10 && (
                <span className="text-macos-gray-400"> (gusts {Math.round(day.windGustsMax)})</span>
              )}
            </span>
          </div>
          <div className="text-macos-gray-500 dark:text-macos-gray-400">
            <span className="block text-[10px] uppercase tracking-wide mb-0.5">UV Index</span>
            <span className={cn(
              day.uvIndexMax > 7 ? "text-orange-500" : day.uvIndexMax > 5 ? "text-yellow-500" : "text-macos-gray-900 dark:text-white"
            )}>
              {day.uvIndexMax.toFixed(0)} {day.uvIndexMax > 7 ? '(High)' : day.uvIndexMax > 5 ? '(Mod)' : '(Low)'}
            </span>
          </div>
          <div className="text-macos-gray-500 dark:text-macos-gray-400">
            <span className="block text-[10px] uppercase tracking-wide mb-0.5">Precipitation</span>
            <span className="text-macos-gray-900 dark:text-white">
              {day.precipitationSum.toFixed(1)} mm
            </span>
          </div>
        </div>
      )}
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
  const [expandedDay, setExpandedDay] = useState<string | null>(null)

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
      <p className="text-xs text-macos-gray-400 dark:text-macos-gray-500 mb-2">
        Tap a day for details
      </p>

      <div className="-mx-4 px-4">
        {daily.map((day, index) => (
          <DailyRow
            key={day.date}
            day={day}
            minTemp={minTemp}
            maxTemp={maxTemp}
            isToday={index === 0}
            expanded={expandedDay === day.date}
            onToggle={() => setExpandedDay(expandedDay === day.date ? null : day.date)}
          />
        ))}
      </div>
    </GlassCard>
  )
}
