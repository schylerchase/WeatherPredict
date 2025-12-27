import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, useMap, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import { GlassCard } from '../common/GlassCard'
import { RadarLayer } from './RadarLayer'
import { SatelliteLayer } from './SatelliteLayer'
import { OpenWeatherLayer } from './OpenWeatherLayer'
import { LayerBar } from './LayerBar'
import { MapTimeline } from './MapTimeline'
import { MapZoomControls } from './MapZoomControls'
import { RadarLegend } from './RadarLegend'
import { useLocation } from '../../context/LocationContext'
import { useSettings } from '../../context/SettingsContext'
import { useRainViewer } from '../../hooks/useRainViewer'
import type { MapLayer } from '../../types/map'
import { DEFAULT_LAYERS } from '../../types/map'
import { cn } from '../../utils/cn'
import 'leaflet/dist/leaflet.css'

// Fix for default marker icons in Leaflet with Vite
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

// Component to update map center when location changes
function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap()

  useEffect(() => {
    map.setView(center, map.getZoom())
  }, [center, map])

  return null
}

interface WeatherMapProps {
  className?: string
  showControls?: boolean
  showTimeline?: boolean
  showLocationLabel?: boolean
  showLegend?: boolean
  showZoomControls?: boolean
  height?: string
  zoom?: number
  compact?: boolean
  fullscreenEnabled?: boolean
}

export function WeatherMap({
  className,
  showControls = true,
  showTimeline = true,
  showLocationLabel = true,
  showLegend = true,
  showZoomControls = true,
  height = '400px',
  zoom = 8,
  compact = false,
  fullscreenEnabled = false,
}: WeatherMapProps) {
  const { currentLocation } = useLocation()
  const { settings } = useSettings()
  const [layers, setLayers] = useState<MapLayer[]>(DEFAULT_LAYERS)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const rainViewer = useRainViewer({
    autoPlay: false,
    animationSpeed: 500,
  })

  const owmApiKey = settings.openWeatherMapApiKey

  // Default center (will be overridden by currentLocation)
  const center: [number, number] = currentLocation
    ? [currentLocation.latitude, currentLocation.longitude]
    : [40.7128, -74.006] // NYC default

  const toggleLayer = (layerId: string) => {
    setLayers((prev) =>
      prev.map((layer) =>
        layer.id === layerId ? { ...layer, visible: !layer.visible } : layer
      )
    )
  }

  const setLayerOpacity = (layerId: string, opacity: number) => {
    setLayers((prev) =>
      prev.map((layer) =>
        layer.id === layerId ? { ...layer, opacity } : layer
      )
    )
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  const radarLayer = layers.find((l) => l.id === 'radar')
  const satelliteLayer = layers.find((l) => l.id === 'satellite')
  const temperatureLayer = layers.find((l) => l.id === 'temperature')
  const precipitationLayer = layers.find((l) => l.id === 'precipitation')
  const windLayer = layers.find((l) => l.id === 'wind')
  const cloudsLayer = layers.find((l) => l.id === 'clouds')

  // Determine which frames to show in timeline
  const activeAnimatedLayer = radarLayer?.visible ? 'radar' : satelliteLayer?.visible ? 'satellite' : null
  const timelineFrames = activeAnimatedLayer === 'radar' ? rainViewer.frames : rainViewer.satelliteFrames
  const currentFrameIndex = activeAnimatedLayer === 'radar' ? rainViewer.currentFrameIndex : rainViewer.currentSatelliteFrameIndex
  const onFrameChange = activeAnimatedLayer === 'radar' ? rainViewer.goToFrame : rainViewer.goToSatelliteFrame

  if (!currentLocation) {
    return (
      <GlassCard className={cn('flex items-center justify-center', className)} style={{ height }}>
        <p className="text-macos-gray-500 dark:text-macos-gray-400">
          Select a location to view the weather map
        </p>
      </GlassCard>
    )
  }

  const mapContent = (
    <div className={cn(
      "relative flex flex-col",
      isFullscreen && "fixed inset-0 z-50 bg-white dark:bg-macos-gray-900"
    )} style={{ height: isFullscreen ? '100vh' : height }}>
      {/* Map container */}
      <div className="flex-1 relative">
        <MapContainer
          center={center}
          zoom={zoom}
          className="w-full h-full"
          zoomControl={false}
        >
          {/* Update map when location changes */}
          <MapUpdater center={center} />

          {/* Base map layer - CartoDB Positron for clean look */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          />

          {/* Satellite layer (RainViewer) */}
          {satelliteLayer?.visible && rainViewer.data && rainViewer.currentSatelliteFrame && (
            <SatelliteLayer
              host={rainViewer.data.host}
              path={rainViewer.currentSatelliteFrame.path}
              opacity={satelliteLayer.opacity}
            />
          )}

          {/* Radar layer (RainViewer) */}
          {radarLayer?.visible && rainViewer.data && rainViewer.currentFrame && (
            <RadarLayer
              host={rainViewer.data.host}
              path={rainViewer.currentFrame.path}
              opacity={radarLayer.opacity}
            />
          )}

          {/* OpenWeatherMap layers (require API key) */}
          {owmApiKey && (
            <>
              {cloudsLayer?.visible && (
                <OpenWeatherLayer
                  layerType="clouds_new"
                  apiKey={owmApiKey}
                  opacity={cloudsLayer.opacity}
                />
              )}
              {precipitationLayer?.visible && (
                <OpenWeatherLayer
                  layerType="precipitation_new"
                  apiKey={owmApiKey}
                  opacity={precipitationLayer.opacity}
                />
              )}
              {temperatureLayer?.visible && (
                <OpenWeatherLayer
                  layerType="temp_new"
                  apiKey={owmApiKey}
                  opacity={temperatureLayer.opacity}
                />
              )}
              {windLayer?.visible && (
                <OpenWeatherLayer
                  layerType="wind_new"
                  apiKey={owmApiKey}
                  opacity={windLayer.opacity}
                />
              )}
            </>
          )}

          {/* Location marker */}
          <Marker position={center}>
            <Popup>
              <div className="text-sm font-medium">{currentLocation.name}</div>
              {currentLocation.admin1 && (
                <div className="text-xs text-gray-500">
                  {currentLocation.admin1}, {currentLocation.country}
                </div>
              )}
            </Popup>
          </Marker>

          {/* Zoom controls - inside MapContainer for access to map instance */}
          {showZoomControls && !compact && (
            <MapZoomControls
              className="absolute top-3 right-3 z-[1000]"
              onFullscreen={fullscreenEnabled ? toggleFullscreen : undefined}
              isFullscreen={isFullscreen}
            />
          )}
        </MapContainer>

        {/* Location label overlay */}
        {showLocationLabel && (
          <div className="absolute top-3 left-3 z-[1000]">
            <div className={cn(
              "px-3 py-2 rounded-lg",
              "bg-white/95 dark:bg-macos-gray-800/95 backdrop-blur-sm",
              "shadow-lg border border-macos-gray-200 dark:border-macos-gray-700"
            )}>
              <div className={cn(
                "font-semibold text-macos-gray-900 dark:text-white",
                compact ? "text-sm" : "text-base"
              )}>
                {currentLocation.name}
              </div>
              {currentLocation.admin1 && !compact && (
                <div className="text-xs text-macos-gray-500 dark:text-macos-gray-400">
                  {currentLocation.admin1}, {currentLocation.country}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Radar legend */}
        {showLegend && radarLayer?.visible && !compact && (
          <RadarLegend className="absolute bottom-3 left-3 z-[1000]" />
        )}

        {/* Layer bar */}
        {showControls && (
          <LayerBar
            layers={layers}
            onToggleLayer={toggleLayer}
            onOpacityChange={setLayerOpacity}
            hasOwmApiKey={!!owmApiKey}
            compact={compact}
          />
        )}

        {/* Loading overlay */}
        {rainViewer.isLoading && (
          <div className="absolute inset-0 bg-white/50 dark:bg-black/50 backdrop-blur-sm flex items-center justify-center z-[1001]">
            <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-macos-gray-800 rounded-lg shadow-lg">
              <div className="w-4 h-4 border-2 border-macos-blue border-t-transparent rounded-full animate-spin" />
              <span className="text-sm text-macos-gray-600 dark:text-macos-gray-400">
                Loading radar data...
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Timeline - full width at bottom */}
      {showTimeline && activeAnimatedLayer && timelineFrames.length > 0 && !compact && (
        <MapTimeline
          frames={timelineFrames}
          currentIndex={currentFrameIndex}
          isPlaying={rainViewer.isPlaying}
          onIndexChange={onFrameChange}
          onPlayToggle={rainViewer.togglePlay}
          onSpeedChange={rainViewer.setAnimationSpeed}
          speed={rainViewer.animationSpeed}
          label={activeAnimatedLayer === 'radar' ? 'Radar' : 'Satellite'}
        />
      )}

      {/* Compact timeline */}
      {showTimeline && activeAnimatedLayer && timelineFrames.length > 0 && compact && (
        <div className="absolute bottom-14 left-1/2 -translate-x-1/2 z-[1000]">
          <div className={cn(
            "flex items-center gap-2 px-3 py-2 rounded-lg",
            "bg-white dark:bg-macos-gray-800",
            "shadow-lg border border-macos-gray-200 dark:border-macos-gray-700"
          )}>
            <button
              onClick={rainViewer.togglePlay}
              className={cn(
                "w-8 h-8 flex items-center justify-center rounded-full",
                "bg-macos-blue text-white",
                "hover:bg-blue-600"
              )}
            >
              {rainViewer.isPlaying ? (
                <svg width={14} height={14} viewBox="0 0 24 24" fill="currentColor">
                  <rect x="6" y="4" width="4" height="16" />
                  <rect x="14" y="4" width="4" height="16" />
                </svg>
              ) : (
                <svg width={14} height={14} viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
              )}
            </button>
            <span className="text-xs font-medium text-macos-gray-700 dark:text-macos-gray-300 min-w-[60px]">
              {currentFrameIndex + 1} / {timelineFrames.length}
            </span>
          </div>
        </div>
      )}
    </div>
  )

  if (compact) {
    return (
      <div className={cn('rounded-lg overflow-hidden', className)} style={{ height }}>
        {mapContent}
      </div>
    )
  }

  return (
    <div className={cn('rounded-lg overflow-hidden shadow-lg border border-macos-gray-200 dark:border-macos-gray-700', className)}>
      {mapContent}
    </div>
  )
}
