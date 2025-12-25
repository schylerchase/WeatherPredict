import { useState, useEffect } from 'react'
import { GlassCard } from '../components/common/GlassCard'
import { GlassButton } from '../components/common/GlassButton'
import { GlassInput } from '../components/common/GlassInput'
import { Skeleton } from '../components/common/Skeleton'
import { useLocation } from '../context/LocationContext'
import { useSettings } from '../context/SettingsContext'
import { getHistoricalWeather } from '../api/openMeteo'
import { formatTemperature } from '../utils/formatters'
import type { HistoricalWeather } from '../types/weather'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { format, subDays } from 'date-fns'

export function HistoricalView() {
  const { currentLocation } = useLocation()
  const { settings } = useSettings()

  const [startDate, setStartDate] = useState(() =>
    format(subDays(new Date(), 30), 'yyyy-MM-dd')
  )
  const [endDate, setEndDate] = useState(() =>
    format(subDays(new Date(), 1), 'yyyy-MM-dd')
  )
  const [data, setData] = useState<HistoricalWeather[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    if (!currentLocation) return

    setIsLoading(true)
    setError(null)

    try {
      const historical = await getHistoricalWeather({
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        startDate,
        endDate,
      })
      setData(historical)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch historical data')
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch initial data
  useEffect(() => {
    if (currentLocation) {
      fetchData()
    }
  }, [currentLocation])

  if (!currentLocation) {
    return (
      <GlassCard className="text-center py-12">
        <h2 className="text-xl font-semibold text-macos-gray-900 dark:text-white mb-2">
          No Location Selected
        </h2>
        <p className="text-macos-gray-500 dark:text-macos-gray-400">
          Search for a location to view historical weather data
        </p>
      </GlassCard>
    )
  }

  // Prepare chart data
  const chartData = data.map((d) => ({
    date: format(new Date(d.date), 'MMM d'),
    max: Math.round(
      settings.temperatureUnit === 'fahrenheit'
        ? (d.temperatureMax * 9) / 5 + 32
        : d.temperatureMax
    ),
    min: Math.round(
      settings.temperatureUnit === 'fahrenheit'
        ? (d.temperatureMin * 9) / 5 + 32
        : d.temperatureMin
    ),
    precipitation: d.precipitationSum,
  }))

  // Calculate statistics
  const stats = data.length > 0
    ? {
        avgHigh: data.reduce((sum, d) => sum + d.temperatureMax, 0) / data.length,
        avgLow: data.reduce((sum, d) => sum + d.temperatureMin, 0) / data.length,
        totalPrecip: data.reduce((sum, d) => sum + d.precipitationSum, 0),
        maxTemp: Math.max(...data.map((d) => d.temperatureMax)),
        minTemp: Math.min(...data.map((d) => d.temperatureMin)),
      }
    : null

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-macos-gray-900 dark:text-white">
          Historical Weather
        </h1>
        <p className="text-macos-gray-500 dark:text-macos-gray-400">
          {currentLocation.name}
          {currentLocation.admin1 && `, ${currentLocation.admin1}`}
        </p>
      </div>

      {/* Date range selector */}
      <GlassCard>
        <h3 className="text-sm font-semibold text-macos-gray-500 dark:text-macos-gray-400 uppercase tracking-wide mb-3">
          Date Range
        </h3>
        <div className="flex flex-wrap items-end gap-4">
          <div>
            <label className="block text-sm text-macos-gray-600 dark:text-macos-gray-400 mb-1">
              Start Date
            </label>
            <GlassInput
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              max={endDate}
              fullWidth={false}
            />
          </div>
          <div>
            <label className="block text-sm text-macos-gray-600 dark:text-macos-gray-400 mb-1">
              End Date
            </label>
            <GlassInput
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              min={startDate}
              max={format(subDays(new Date(), 1), 'yyyy-MM-dd')}
              fullWidth={false}
            />
          </div>
          <GlassButton
            variant="primary"
            onClick={fetchData}
            isLoading={isLoading}
          >
            Load Data
          </GlassButton>
        </div>
      </GlassCard>

      {/* Error message */}
      {error && (
        <GlassCard className="bg-macos-red/10 border-macos-red/20">
          <p className="text-macos-red">{error}</p>
        </GlassCard>
      )}

      {/* Loading skeleton */}
      {isLoading && (
        <GlassCard>
          <Skeleton variant="rounded" height={300} />
        </GlassCard>
      )}

      {/* Statistics */}
      {!isLoading && stats && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <GlassCard variant="inset" padding="sm" className="text-center">
            <div className="text-xs text-macos-gray-500 dark:text-macos-gray-400 mb-1">
              Avg High
            </div>
            <div className="text-xl font-semibold text-macos-gray-900 dark:text-white">
              {formatTemperature(stats.avgHigh, settings.temperatureUnit)}
            </div>
          </GlassCard>
          <GlassCard variant="inset" padding="sm" className="text-center">
            <div className="text-xs text-macos-gray-500 dark:text-macos-gray-400 mb-1">
              Avg Low
            </div>
            <div className="text-xl font-semibold text-macos-gray-900 dark:text-white">
              {formatTemperature(stats.avgLow, settings.temperatureUnit)}
            </div>
          </GlassCard>
          <GlassCard variant="inset" padding="sm" className="text-center">
            <div className="text-xs text-macos-gray-500 dark:text-macos-gray-400 mb-1">
              Record High
            </div>
            <div className="text-xl font-semibold text-macos-orange">
              {formatTemperature(stats.maxTemp, settings.temperatureUnit)}
            </div>
          </GlassCard>
          <GlassCard variant="inset" padding="sm" className="text-center">
            <div className="text-xs text-macos-gray-500 dark:text-macos-gray-400 mb-1">
              Record Low
            </div>
            <div className="text-xl font-semibold text-macos-blue">
              {formatTemperature(stats.minTemp, settings.temperatureUnit)}
            </div>
          </GlassCard>
          <GlassCard variant="inset" padding="sm" className="text-center">
            <div className="text-xs text-macos-gray-500 dark:text-macos-gray-400 mb-1">
              Total Precip
            </div>
            <div className="text-xl font-semibold text-macos-gray-900 dark:text-white">
              {stats.totalPrecip.toFixed(1)} mm
            </div>
          </GlassCard>
        </div>
      )}

      {/* Temperature chart */}
      {!isLoading && data.length > 0 && (
        <GlassCard>
          <h3 className="text-sm font-semibold text-macos-gray-500 dark:text-macos-gray-400 uppercase tracking-wide mb-4">
            Temperature History
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  unit={settings.temperatureUnit === 'fahrenheit' ? '°F' : '°C'}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    borderRadius: '10px',
                    border: 'none',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="max"
                  name="High"
                  stroke="#FF9F0A"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="min"
                  name="Low"
                  stroke="#007AFF"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      )}

      {/* Data table */}
      {!isLoading && data.length > 0 && (
        <GlassCard>
          <h3 className="text-sm font-semibold text-macos-gray-500 dark:text-macos-gray-400 uppercase tracking-wide mb-4">
            Daily Data
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-macos-gray-200 dark:border-macos-gray-700">
                  <th className="text-left py-2 px-3 font-medium text-macos-gray-500">
                    Date
                  </th>
                  <th className="text-right py-2 px-3 font-medium text-macos-gray-500">
                    High
                  </th>
                  <th className="text-right py-2 px-3 font-medium text-macos-gray-500">
                    Low
                  </th>
                  <th className="text-right py-2 px-3 font-medium text-macos-gray-500">
                    Mean
                  </th>
                  <th className="text-right py-2 px-3 font-medium text-macos-gray-500">
                    Precip
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.slice(0, 14).map((day) => (
                  <tr
                    key={day.date}
                    className="border-b border-macos-gray-100 dark:border-macos-gray-800"
                  >
                    <td className="py-2 px-3 text-macos-gray-900 dark:text-white">
                      {format(new Date(day.date), 'MMM d, yyyy')}
                    </td>
                    <td className="py-2 px-3 text-right text-macos-orange font-medium">
                      {formatTemperature(day.temperatureMax, settings.temperatureUnit)}
                    </td>
                    <td className="py-2 px-3 text-right text-macos-blue font-medium">
                      {formatTemperature(day.temperatureMin, settings.temperatureUnit)}
                    </td>
                    <td className="py-2 px-3 text-right text-macos-gray-600 dark:text-macos-gray-400">
                      {formatTemperature(day.temperatureMean, settings.temperatureUnit)}
                    </td>
                    <td className="py-2 px-3 text-right text-macos-gray-600 dark:text-macos-gray-400">
                      {day.precipitationSum.toFixed(1)} mm
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      )}
    </div>
  )
}
