import { useRef } from 'react'
import { GlassCard } from '../common/GlassCard'
import { ChevronLeftIcon, ChevronRightIcon } from '../common/Icon'
import { Skeleton } from '../common/Skeleton'
import { useWeather } from '../../context/WeatherContext'
import { useSettings } from '../../context/SettingsContext'
import { formatTemperature, formatHour, formatPercentage } from '../../utils/formatters'
import { getWeatherIcon } from '../../utils/weatherCodes'
import { cn } from '../../utils/cn'

interface HourlyItemProps {
  time: string
  temperature: number
  weatherCode: number
  precipitationProbability: number
  isNow?: boolean
}

function HourlyItem({
  time,
  temperature,
  weatherCode,
  precipitationProbability,
  isNow = false,
}: HourlyItemProps) {
  const { settings } = useSettings()

  return (
    <div
      className={cn(
        'flex flex-col items-center gap-1 px-3 py-2 rounded-macos min-w-[60px]',
        'transition-colors duration-200',
        isNow && 'bg-macos-blue/10 dark:bg-macos-blue/20'
      )}
    >
      <span
        className={cn(
          'text-xs font-medium',
          isNow
            ? 'text-macos-blue'
            : 'text-macos-gray-500 dark:text-macos-gray-400'
        )}
      >
        {isNow ? 'Now' : formatHour(time)}
      </span>

      <span className="text-2xl my-1">{getWeatherIcon(weatherCode, true)}</span>

      <span className="text-sm font-semibold text-macos-gray-900 dark:text-white">
        {formatTemperature(temperature, settings.temperatureUnit, false)}
      </span>

      {precipitationProbability > 0 && (
        <span className="text-xs text-macos-blue">
          {formatPercentage(precipitationProbability)}
        </span>
      )}
    </div>
  )
}

function HourlyLoadingSkeleton() {
  return (
    <div className="flex gap-2 overflow-hidden">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="flex flex-col items-center gap-2 px-3 py-2">
          <Skeleton variant="text" width={32} height={12} />
          <Skeleton variant="circular" width={32} height={32} />
          <Skeleton variant="text" width={28} height={16} />
        </div>
      ))}
    </div>
  )
}

export function HourlyForecast() {
  const { weather, isLoading } = useWeather()
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 200
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      })
    }
  }

  if (isLoading && !weather) {
    return (
      <GlassCard>
        <h3 className="text-sm font-semibold text-macos-gray-500 dark:text-macos-gray-400 uppercase tracking-wide mb-3">
          Hourly Forecast
        </h3>
        <HourlyLoadingSkeleton />
      </GlassCard>
    )
  }

  if (!weather) {
    return null
  }

  // Get next 24 hours
  const now = new Date()
  const hourlyData = weather.hourly.slice(0, 48).filter((hour) => {
    return new Date(hour.time) >= now
  }).slice(0, 24)

  return (
    <GlassCard>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-macos-gray-500 dark:text-macos-gray-400 uppercase tracking-wide">
          Hourly Forecast
        </h3>
        <div className="flex gap-1">
          <button
            onClick={() => scroll('left')}
            className="p-1.5 rounded-full hover:bg-macos-gray-100 dark:hover:bg-macos-gray-700 transition-colors"
            aria-label="Scroll left"
          >
            <ChevronLeftIcon size={16} />
          </button>
          <button
            onClick={() => scroll('right')}
            className="p-1.5 rounded-full hover:bg-macos-gray-100 dark:hover:bg-macos-gray-700 transition-colors"
            aria-label="Scroll right"
          >
            <ChevronRightIcon size={16} />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-1 overflow-x-auto scrollbar-hide -mx-1 px-1"
      >
        {hourlyData.map((hour, index) => (
          <HourlyItem
            key={hour.time}
            time={hour.time}
            temperature={hour.temperature}
            weatherCode={hour.weatherCode}
            precipitationProbability={hour.precipitationProbability}
            isNow={index === 0}
          />
        ))}
      </div>
    </GlassCard>
  )
}
