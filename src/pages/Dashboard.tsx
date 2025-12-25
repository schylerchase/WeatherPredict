import { CurrentConditions } from '../components/weather/CurrentConditions'
import { HourlyForecast } from '../components/weather/HourlyForecast'
import { DailyForecast } from '../components/weather/DailyForecast'
import { WeatherMetrics } from '../components/weather/WeatherMetrics'
import { SunriseSunset } from '../components/weather/SunriseSunset'
import { WeatherMap } from '../components/map/WeatherMap'
import { useLocation } from '../context/LocationContext'

export function Dashboard() {
  const { currentLocation } = useLocation()

  return (
    <div className="space-y-6">
      {/* Welcome message when no location */}
      {!currentLocation && (
        <div className="text-center py-12">
          <h1 className="text-3xl font-bold text-macos-gray-900 dark:text-white mb-4">
            Welcome to WeatherPredict
          </h1>
          <p className="text-macos-gray-500 dark:text-macos-gray-400 max-w-md mx-auto">
            Search for a location or use your current location to get started with accurate weather forecasts.
          </p>
        </div>
      )}

      {/* Main content when location is selected */}
      {currentLocation && (
        <>
          {/* Current conditions */}
          <CurrentConditions />

          {/* Hourly forecast */}
          <HourlyForecast />

          {/* Grid layout for map and daily forecast */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Weather map */}
            <div>
              <h3 className="text-sm font-semibold text-macos-gray-500 dark:text-macos-gray-400 uppercase tracking-wide mb-3">
                Radar Map
              </h3>
              <WeatherMap height="350px" showTimeline={true} />
            </div>

            {/* Daily forecast */}
            <DailyForecast />
          </div>

          {/* Weather metrics grid */}
          <div>
            <h3 className="text-sm font-semibold text-macos-gray-500 dark:text-macos-gray-400 uppercase tracking-wide mb-3">
              Weather Details
            </h3>
            <WeatherMetrics />
          </div>

          {/* Sunrise/Sunset */}
          <div className="max-w-md">
            <SunriseSunset />
          </div>
        </>
      )}
    </div>
  )
}
