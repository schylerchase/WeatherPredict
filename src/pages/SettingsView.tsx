import { useState } from 'react'
import { GlassCard } from '../components/common/GlassCard'
import { GlassButton } from '../components/common/GlassButton'
import { GlassInput } from '../components/common/GlassInput'
import { SegmentedControl } from '../components/common/SegmentedControl'
import { useTheme } from '../context/ThemeContext'
import { useSettings } from '../context/SettingsContext'
import type {
  TemperatureUnit,
  SpeedUnit,
  PrecipitationUnit,
  TimeFormat,
  Theme,
} from '../types/settings'

export function SettingsView() {
  const { theme, setTheme } = useTheme()
  const { settings, updateSettings, resetSettings } = useSettings()
  const [apiKeyInput, setApiKeyInput] = useState(settings.openWeatherMapApiKey || '')

  const themeOptions: { value: Theme; label: string }[] = [
    { value: 'light', label: '☀️ Light' },
    { value: 'dark', label: '🌙 Dark' },
    { value: 'system', label: '🔄 Auto' },
  ]

  const temperatureOptions: { value: TemperatureUnit; label: string }[] = [
    { value: 'celsius', label: '°C' },
    { value: 'fahrenheit', label: '°F' },
  ]

  const speedOptions: { value: SpeedUnit; label: string }[] = [
    { value: 'kmh', label: 'km/h' },
    { value: 'mph', label: 'mph' },
    { value: 'ms', label: 'm/s' },
    { value: 'knots', label: 'knots' },
  ]

  const precipOptions: { value: PrecipitationUnit; label: string }[] = [
    { value: 'mm', label: 'mm' },
    { value: 'inch', label: 'in' },
  ]

  const timeOptions: { value: TimeFormat; label: string }[] = [
    { value: '12h', label: '12-hour' },
    { value: '24h', label: '24-hour' },
  ]

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-macos-gray-900 dark:text-white">
          Settings
        </h1>
        <p className="text-macos-gray-500 dark:text-macos-gray-400">
          Customize your weather experience
        </p>
      </div>

      {/* Appearance */}
      <GlassCard>
        <h2 className="text-lg font-semibold text-macos-gray-900 dark:text-white mb-4">
          Appearance
        </h2>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-macos-gray-900 dark:text-white">
                Theme
              </div>
              <div className="text-sm text-macos-gray-500 dark:text-macos-gray-400">
                Choose your preferred color scheme
              </div>
            </div>
            <SegmentedControl
              options={themeOptions}
              value={theme}
              onChange={setTheme}
              size="sm"
            />
          </div>
        </div>
      </GlassCard>

      {/* Units */}
      <GlassCard>
        <h2 className="text-lg font-semibold text-macos-gray-900 dark:text-white mb-4">
          Units
        </h2>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-macos-gray-900 dark:text-white">
                Temperature
              </div>
              <div className="text-sm text-macos-gray-500 dark:text-macos-gray-400">
                Celsius or Fahrenheit
              </div>
            </div>
            <SegmentedControl
              options={temperatureOptions}
              value={settings.temperatureUnit}
              onChange={(value) => updateSettings({ temperatureUnit: value })}
              size="sm"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-macos-gray-900 dark:text-white">
                Wind Speed
              </div>
              <div className="text-sm text-macos-gray-500 dark:text-macos-gray-400">
                Speed measurement unit
              </div>
            </div>
            <SegmentedControl
              options={speedOptions}
              value={settings.speedUnit}
              onChange={(value) => updateSettings({ speedUnit: value })}
              size="sm"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-macos-gray-900 dark:text-white">
                Precipitation
              </div>
              <div className="text-sm text-macos-gray-500 dark:text-macos-gray-400">
                Rainfall measurement
              </div>
            </div>
            <SegmentedControl
              options={precipOptions}
              value={settings.precipitationUnit}
              onChange={(value) => updateSettings({ precipitationUnit: value })}
              size="sm"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-macos-gray-900 dark:text-white">
                Time Format
              </div>
              <div className="text-sm text-macos-gray-500 dark:text-macos-gray-400">
                12-hour or 24-hour clock
              </div>
            </div>
            <SegmentedControl
              options={timeOptions}
              value={settings.timeFormat}
              onChange={(value) => updateSettings({ timeFormat: value })}
              size="sm"
            />
          </div>
        </div>
      </GlassCard>

      {/* API Keys */}
      <GlassCard>
        <h2 className="text-lg font-semibold text-macos-gray-900 dark:text-white mb-4">
          Map Layers
        </h2>

        <div className="space-y-4">
          <div>
            <div className="font-medium text-macos-gray-900 dark:text-white">
              OpenWeatherMap API Key
            </div>
            <div className="text-sm text-macos-gray-500 dark:text-macos-gray-400 mb-3">
              Required for temperature, wind, precipitation, and cloud map layers.{' '}
              <a
                href="https://openweathermap.org/api"
                target="_blank"
                rel="noopener noreferrer"
                className="text-macos-blue hover:underline"
              >
                Get a free API key
              </a>
              <br />
              <span className="text-macos-orange">
                ⚠️ New API keys can take up to 2 hours to activate!
              </span>
            </div>
            <div className="flex gap-2">
              <GlassInput
                type="password"
                placeholder="Enter your API key"
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                className="flex-1"
              />
              <GlassButton
                variant="secondary"
                size="sm"
                onClick={() => {
                  updateSettings({ openWeatherMapApiKey: apiKeyInput || undefined })
                }}
              >
                Save
              </GlassButton>
            </div>
            {settings.openWeatherMapApiKey && (
              <div className="mt-2 flex items-center gap-2 text-sm text-macos-green">
                <span>✓</span>
                <span>API key saved</span>
              </div>
            )}
          </div>

          <div className="pt-2 text-sm text-macos-gray-600 dark:text-macos-gray-400">
            <strong>Free layers (no API key):</strong> Radar, Satellite
            <br />
            <strong>With API key:</strong> Temperature, Precipitation, Wind, Clouds
          </div>
        </div>
      </GlassCard>

      {/* Data & Privacy */}
      <GlassCard>
        <h2 className="text-lg font-semibold text-macos-gray-900 dark:text-white mb-4">
          Data & Privacy
        </h2>

        <div className="space-y-4">
          <p className="text-sm text-macos-gray-600 dark:text-macos-gray-400">
            WeatherPredict stores your preferences and favorite locations locally in your browser.
            No personal data is sent to any server. Weather data is fetched from Open-Meteo.
          </p>

          <div className="pt-2">
            <GlassButton
              variant="danger"
              size="sm"
              onClick={() => {
                if (confirm('Reset all settings to defaults?')) {
                  resetSettings()
                }
              }}
            >
              Reset All Settings
            </GlassButton>
          </div>
        </div>
      </GlassCard>

      {/* About */}
      <GlassCard>
        <h2 className="text-lg font-semibold text-macos-gray-900 dark:text-white mb-4">
          About
        </h2>

        <div className="space-y-3 text-sm text-macos-gray-600 dark:text-macos-gray-400">
          <p>
            <strong>WeatherPredict</strong> is an open-source weather application with a beautiful
            macOS-inspired interface.
          </p>
          <p>
            Weather data provided by{' '}
            <a
              href="https://open-meteo.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-macos-blue hover:underline"
            >
              Open-Meteo
            </a>
          </p>
          <p>
            Radar imagery provided by{' '}
            <a
              href="https://www.rainviewer.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-macos-blue hover:underline"
            >
              RainViewer
            </a>
          </p>
          <p>
            Map tiles by{' '}
            <a
              href="https://carto.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-macos-blue hover:underline"
            >
              CARTO
            </a>
            {' '}and{' '}
            <a
              href="https://www.openstreetmap.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-macos-blue hover:underline"
            >
              OpenStreetMap
            </a>
          </p>
        </div>
      </GlassCard>
    </div>
  )
}
