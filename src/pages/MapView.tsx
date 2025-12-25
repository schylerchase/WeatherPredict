import { WeatherMap } from '../components/map/WeatherMap'
import { GlassCard } from '../components/common/GlassCard'
import { useLocation } from '../context/LocationContext'

export function MapView() {
  const { currentLocation } = useLocation()

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-macos-gray-900 dark:text-white">
            Weather Map
          </h1>
          {currentLocation && (
            <p className="text-macos-gray-500 dark:text-macos-gray-400">
              {currentLocation.name}
              {currentLocation.admin1 && `, ${currentLocation.admin1}`}
            </p>
          )}
        </div>
      </div>

      {/* Full-height map */}
      <WeatherMap
        height="calc(100vh - 200px)"
        showControls={true}
        showTimeline={true}
        zoom={7}
      />

      {/* Map info */}
      <GlassCard variant="inset" padding="sm">
        <p className="text-xs text-macos-gray-500 dark:text-macos-gray-400">
          <strong>Tip:</strong> Use the layer controls to toggle radar, satellite, and other weather overlays.
          The timeline slider lets you view past radar data and near-term forecasts.
        </p>
      </GlassCard>
    </div>
  )
}
