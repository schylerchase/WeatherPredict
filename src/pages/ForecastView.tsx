import { HourlyForecast } from '../components/weather/HourlyForecast'
import { DailyForecast } from '../components/weather/DailyForecast'
import { WeatherMetrics } from '../components/weather/WeatherMetrics'
import { SunriseSunset } from '../components/weather/SunriseSunset'
import { GlassCard } from '../components/common/GlassCard'
import { useLocation } from '../context/LocationContext'
import { useWeather } from '../context/WeatherContext'
import { useSettings } from '../context/SettingsContext'
import { formatTemperature, formatFullDate } from '../utils/formatters'
import { getWeatherIcon, getWeatherDescription } from '../utils/weatherCodes'

export function ForecastView() {
  const { currentLocation } = useLocation()
  const { weather } = useWeather()
  const { settings } = useSettings()

  if (!currentLocation) {
    return (
      <GlassCard className="text-center py-12">
        <h2 className="text-xl font-semibold text-macos-gray-900 dark:text-white mb-2">
          No Location Selected
        </h2>
        <p className="text-macos-gray-500 dark:text-macos-gray-400">
          Search for a location to view the forecast
        </p>
      </GlassCard>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-macos-gray-900 dark:text-white">
          Weather Forecast
        </h1>
        <p className="text-macos-gray-500 dark:text-macos-gray-400">
          {currentLocation.name}
          {currentLocation.admin1 && `, ${currentLocation.admin1}`}
          {currentLocation.country && `, ${currentLocation.country}`}
        </p>
      </div>

      {/* Hourly forecast */}
      <section>
        <h2 className="text-lg font-semibold text-macos-gray-900 dark:text-white mb-3">
          Next 24 Hours
        </h2>
        <HourlyForecast />
      </section>

      {/* 14-day forecast */}
      <section>
        <h2 className="text-lg font-semibold text-macos-gray-900 dark:text-white mb-3">
          Extended Forecast
        </h2>
        <DailyForecast />
      </section>

      {/* Detailed day cards */}
      {weather && (
        <section>
          <h2 className="text-lg font-semibold text-macos-gray-900 dark:text-white mb-3">
            Day by Day
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {weather.daily.slice(0, 6).map((day) => (
              <GlassCard key={day.date} hover>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="font-medium text-macos-gray-900 dark:text-white">
                      {formatFullDate(day.date)}
                    </div>
                    <div className="text-sm text-macos-gray-500 dark:text-macos-gray-400">
                      {getWeatherDescription(day.weatherCode)}
                    </div>
                  </div>
                  <span className="text-3xl">{getWeatherIcon(day.weatherCode, true)}</span>
                </div>

                <div className="flex items-center gap-4 mb-3">
                  <div>
                    <div className="text-2xl font-semibold text-macos-gray-900 dark:text-white">
                      {formatTemperature(day.temperatureMax, settings.temperatureUnit, false)}
                    </div>
                    <div className="text-xs text-macos-gray-500">High</div>
                  </div>
                  <div>
                    <div className="text-2xl font-semibold text-macos-gray-500 dark:text-macos-gray-400">
                      {formatTemperature(day.temperatureMin, settings.temperatureUnit, false)}
                    </div>
                    <div className="text-xs text-macos-gray-500">Low</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span>🌧️</span>
                    <span className="text-macos-gray-600 dark:text-macos-gray-400">
                      {day.precipitationProbabilityMax}%
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>💨</span>
                    <span className="text-macos-gray-600 dark:text-macos-gray-400">
                      {Math.round(day.windSpeedMax)} km/h
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>🔆</span>
                    <span className="text-macos-gray-600 dark:text-macos-gray-400">
                      UV {Math.round(day.uvIndexMax)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>💧</span>
                    <span className="text-macos-gray-600 dark:text-macos-gray-400">
                      {day.precipitationSum} mm
                    </span>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </section>
      )}

      {/* Weather details */}
      <section>
        <h2 className="text-lg font-semibold text-macos-gray-900 dark:text-white mb-3">
          Current Conditions
        </h2>
        <WeatherMetrics />
      </section>

      {/* Sunrise/Sunset */}
      <section className="max-w-md">
        <SunriseSunset />
      </section>
    </div>
  )
}
