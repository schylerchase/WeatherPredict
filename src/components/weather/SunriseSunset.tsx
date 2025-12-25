import { useMemo } from 'react'
import { GlassCard } from '../common/GlassCard'
import { Skeleton } from '../common/Skeleton'
import { useWeather } from '../../context/WeatherContext'
import { formatSunTime } from '../../utils/formatters'
import { parseISO } from 'date-fns'

export function SunriseSunset() {
  const { weather, isLoading } = useWeather()

  const sunData = useMemo(() => {
    if (!weather?.daily?.[0]) return null

    const today = weather.daily[0]
    const sunrise = parseISO(today.sunrise)
    const sunset = parseISO(today.sunset)
    const now = new Date()

    // Calculate sun position (0 = sunrise, 100 = sunset)
    const dayLength = sunset.getTime() - sunrise.getTime()
    const currentPosition = now.getTime() - sunrise.getTime()
    const percentage = Math.max(0, Math.min(100, (currentPosition / dayLength) * 100))

    // Calculate if it's currently day or night
    const isDay = now >= sunrise && now <= sunset

    // Calculate day length in hours and minutes
    const dayHours = Math.floor(dayLength / (1000 * 60 * 60))
    const dayMinutes = Math.floor((dayLength % (1000 * 60 * 60)) / (1000 * 60))

    return {
      sunrise: today.sunrise,
      sunset: today.sunset,
      percentage,
      isDay,
      dayLength: `${dayHours}h ${dayMinutes}m`,
    }
  }, [weather])

  if (isLoading && !weather) {
    return (
      <GlassCard>
        <div className="flex items-center gap-2 mb-4">
          <Skeleton variant="circular" width={20} height={20} />
          <Skeleton variant="text" width={100} height={14} />
        </div>
        <Skeleton variant="rounded" height={80} />
      </GlassCard>
    )
  }

  if (!sunData) {
    return null
  }

  return (
    <GlassCard>
      <div className="flex items-center gap-2 mb-4">
        <span className="text-lg">{sunData.isDay ? '☀️' : '🌙'}</span>
        <span className="text-xs font-medium text-macos-gray-500 dark:text-macos-gray-400 uppercase tracking-wide">
          Sunrise & Sunset
        </span>
      </div>

      {/* Sun arc visualization */}
      <div className="relative h-24 mb-4">
        {/* Arc path */}
        <svg
          viewBox="0 0 200 100"
          className="w-full h-full"
          preserveAspectRatio="xMidYMax meet"
        >
          {/* Arc background */}
          <path
            d="M 10 90 Q 100 10 190 90"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-macos-gray-200 dark:text-macos-gray-700"
            strokeDasharray="4 4"
          />

          {/* Filled arc (day portion) */}
          {sunData.isDay && (
            <path
              d="M 10 90 Q 100 10 190 90"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-macos-orange"
              strokeDasharray={`${sunData.percentage * 2.6} 1000`}
            />
          )}

          {/* Sun position indicator */}
          {sunData.isDay && (
            <>
              {/* Calculate sun position on arc */}
              {(() => {
                const t = sunData.percentage / 100
                const x = 10 + t * 180
                const y = 90 - Math.sin(t * Math.PI) * 80
                return (
                  <g transform={`translate(${x}, ${y})`}>
                    <circle
                      r="10"
                      fill="currentColor"
                      className="text-macos-orange"
                    />
                    <circle
                      r="6"
                      fill="currentColor"
                      className="text-macos-yellow"
                    />
                  </g>
                )
              })()}
            </>
          )}

          {/* Horizon line */}
          <line
            x1="0"
            y1="90"
            x2="200"
            y2="90"
            stroke="currentColor"
            strokeWidth="1"
            className="text-macos-gray-300 dark:text-macos-gray-600"
          />
        </svg>
      </div>

      {/* Times */}
      <div className="flex justify-between items-end">
        <div className="text-center">
          <div className="text-2xl mb-1">🌅</div>
          <div className="text-sm font-semibold text-macos-gray-900 dark:text-white">
            {formatSunTime(sunData.sunrise)}
          </div>
          <div className="text-xs text-macos-gray-500 dark:text-macos-gray-400">
            Sunrise
          </div>
        </div>

        <div className="text-center">
          <div className="text-xs text-macos-gray-500 dark:text-macos-gray-400">
            Day length
          </div>
          <div className="text-sm font-medium text-macos-gray-700 dark:text-macos-gray-300">
            {sunData.dayLength}
          </div>
        </div>

        <div className="text-center">
          <div className="text-2xl mb-1">🌇</div>
          <div className="text-sm font-semibold text-macos-gray-900 dark:text-white">
            {formatSunTime(sunData.sunset)}
          </div>
          <div className="text-xs text-macos-gray-500 dark:text-macos-gray-400">
            Sunset
          </div>
        </div>
      </div>
    </GlassCard>
  )
}
