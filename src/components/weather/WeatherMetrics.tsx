import { GlassCard } from '../common/GlassCard'
import { Skeleton } from '../common/Skeleton'
import { useWeather } from '../../context/WeatherContext'
import { useSettings } from '../../context/SettingsContext'
import {
  formatWindSpeed,
  formatWindDirection,
  formatPressure,
  formatVisibility,
  formatUVIndex,
  formatSunTime,
} from '../../utils/formatters'
import { cn } from '../../utils/cn'

interface MetricCardProps {
  title: string
  icon: string
  value: string | React.ReactNode
  subtitle?: string
  className?: string
}

function MetricCard({ title, icon, value, subtitle, className }: MetricCardProps) {
  return (
    <GlassCard variant="inset" padding="sm" className={cn('', className)}>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-lg">{icon}</span>
        <span className="text-xs font-medium text-macos-gray-500 dark:text-macos-gray-400 uppercase tracking-wide">
          {title}
        </span>
      </div>
      <div className="text-xl font-semibold text-macos-gray-900 dark:text-white">
        {value}
      </div>
      {subtitle && (
        <div className="text-xs text-macos-gray-500 dark:text-macos-gray-400 mt-1">
          {subtitle}
        </div>
      )}
    </GlassCard>
  )
}

function MetricsSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
      {Array.from({ length: 8 }).map((_, i) => (
        <GlassCard key={i} variant="inset" padding="sm">
          <div className="flex items-center gap-2 mb-2">
            <Skeleton variant="circular" width={20} height={20} />
            <Skeleton variant="text" width={60} height={12} />
          </div>
          <Skeleton variant="text" width={80} height={24} />
          <Skeleton variant="text" width={100} height={12} className="mt-1" />
        </GlassCard>
      ))}
    </div>
  )
}

export function WeatherMetrics() {
  const { weather, isLoading } = useWeather()
  const { settings } = useSettings()

  if (isLoading && !weather) {
    return <MetricsSkeleton />
  }

  if (!weather) {
    return null
  }

  const { current, daily } = weather
  const today = daily[0]

  const uvInfo = formatUVIndex(today?.uvIndexMax || 0)

  // Find current hour for hourly data
  const now = new Date()
  const currentHour = weather.hourly.find((h) => {
    const hourTime = new Date(h.time)
    return hourTime.getHours() === now.getHours() &&
           hourTime.getDate() === now.getDate()
  })

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
      {/* UV Index */}
      <MetricCard
        title="UV Index"
        icon="🔆"
        value={
          <span className={uvInfo.color}>
            {uvInfo.value}
          </span>
        }
        subtitle={uvInfo.level}
      />

      {/* Wind */}
      <MetricCard
        title="Wind"
        icon="💨"
        value={formatWindSpeed(current.windSpeed, settings.speedUnit)}
        subtitle={`Direction: ${formatWindDirection(current.windDirection)}`}
      />

      {/* Humidity */}
      <MetricCard
        title="Humidity"
        icon="💧"
        value={`${current.humidity}%`}
        subtitle={
          current.humidity > 70
            ? 'High humidity'
            : current.humidity < 30
            ? 'Low humidity'
            : 'Comfortable'
        }
      />

      {/* Pressure */}
      <MetricCard
        title="Pressure"
        icon="📊"
        value={formatPressure(current.pressure, settings.pressureUnit)}
        subtitle={
          current.pressure > 1020
            ? 'High pressure'
            : current.pressure < 1000
            ? 'Low pressure'
            : 'Normal'
        }
      />

      {/* Visibility */}
      {currentHour && (
        <MetricCard
          title="Visibility"
          icon="👁️"
          value={formatVisibility(currentHour.visibility)}
          subtitle={
            currentHour.visibility >= 10000
              ? 'Clear'
              : currentHour.visibility >= 5000
              ? 'Moderate'
              : 'Poor'
          }
        />
      )}

      {/* Sunrise */}
      {today && (
        <MetricCard
          title="Sunrise"
          icon="🌅"
          value={formatSunTime(today.sunrise)}
        />
      )}

      {/* Sunset */}
      {today && (
        <MetricCard
          title="Sunset"
          icon="🌇"
          value={formatSunTime(today.sunset)}
        />
      )}

      {/* Precipitation */}
      {currentHour && (
        <MetricCard
          title="Precipitation"
          icon="🌧️"
          value={`${currentHour.precipitationProbability}%`}
          subtitle={`${currentHour.precipitation} mm expected`}
        />
      )}
    </div>
  )
}
