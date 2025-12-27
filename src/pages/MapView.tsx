import { WeatherMap } from '../components/map/WeatherMap'
import { useLocation } from '../context/LocationContext'

export function MapView() {
  const { currentLocation } = useLocation()

  return (
    <div className="h-full flex flex-col -m-6">
      {/* Header */}
      <div className="px-6 py-4 border-b border-macos-gray-200 dark:border-macos-gray-700 bg-white/50 dark:bg-macos-gray-800/50 backdrop-blur-sm">
        <h1 className="text-xl font-bold text-macos-gray-900 dark:text-white">
          Weather Map
        </h1>
        {currentLocation && (
          <p className="text-sm text-macos-gray-500 dark:text-macos-gray-400">
            {currentLocation.name}
            {currentLocation.admin1 && `, ${currentLocation.admin1}`}
          </p>
        )}
      </div>

      {/* Full-height map */}
      <div className="flex-1 min-h-0">
        <WeatherMap
          height="100%"
          showControls={true}
          showTimeline={true}
          showLegend={true}
          showZoomControls={true}
          showLocationLabel={false}
          fullscreenEnabled={true}
          zoom={7}
          className="h-full rounded-none"
        />
      </div>
    </div>
  )
}
