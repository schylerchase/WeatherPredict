import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, useMap, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import { GlassCard } from '../common/GlassCard'
import { RadarLayer } from './RadarLayer'
import { MapControls } from './MapControls'
import { TimelineSlider } from './TimelineSlider'
import { useLocation } from '../../context/LocationContext'
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
  height?: string
  zoom?: number
  compact?: boolean
}

export function WeatherMap({
  className,
  showControls = true,
  showTimeline = true,
  showLocationLabel = true,
  height = '400px',
  zoom = 8,
  compact = false,
}: WeatherMapProps) {
  const { currentLocation } = useLocation()
  const [layers, setLayers] = useState<MapLayer[]>(DEFAULT_LAYERS)

  const rainViewer = useRainViewer({
    autoPlay: false,
    animationSpeed: 500,
  })

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

  const radarLayer = layers.find((l) => l.id === 'radar')

  if (!currentLocation) {
    return (
      <GlassCard className={cn('flex items-center justify-center', className)} style={{ height }}>
        <p className="text-macos-gray-500 dark:text-macos-gray-400">
          Select a location to view the weather map
        </p>
      </GlassCard>
    )
  }

  return (
    <div className={cn('relative rounded-macos-lg', className)} style={{ height }}>
      <MapContainer
        center={center}
        zoom={zoom}
        className="w-full h-full rounded-macos-lg overflow-hidden"
        zoomControl={false}
      >
        {/* Update map when location changes */}
        <MapUpdater center={center} />

        {/* Base map layer - CartoDB Positron for clean look */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />

        {/* Dark mode alternative */}
        {/* <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        /> */}

        {/* Radar layer */}
        {radarLayer?.visible && rainViewer.data && rainViewer.currentFrame && (
          <RadarLayer
            host={rainViewer.data.host}
            path={rainViewer.currentFrame.path}
            opacity={radarLayer.opacity}
          />
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
      </MapContainer>

      {/* Location label overlay */}
      {showLocationLabel && (
        <div className="absolute top-3 left-3 z-[1000]">
          <div className={cn(
            "px-3 py-2 rounded-xl shadow-lg",
            "bg-white/90 dark:bg-macos-gray-800/90 backdrop-blur-md",
            "border border-white/30 dark:border-white/10"
          )}>
            <div className="flex items-center gap-2">
              <span className="text-base">📍</span>
              <div>
                <div className={cn(
                  "font-semibold text-macos-gray-900 dark:text-white",
                  compact ? "text-sm" : "text-base"
                )}>
                  {currentLocation.name}
                </div>
                {currentLocation.admin1 && (
                  <div className="text-xs text-macos-gray-500 dark:text-macos-gray-400">
                    {currentLocation.admin1}, {currentLocation.country}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Map controls overlay */}
      {showControls && (
        <MapControls
          layers={layers}
          onToggleLayer={toggleLayer}
          onOpacityChange={setLayerOpacity}
          compact={compact}
        />
      )}

      {/* Timeline slider for radar animation */}
      {showTimeline && radarLayer?.visible && rainViewer.frames.length > 0 && (
        <TimelineSlider
          frames={rainViewer.frames}
          currentIndex={rainViewer.currentFrameIndex}
          isPlaying={rainViewer.isPlaying}
          onIndexChange={rainViewer.goToFrame}
          onPlayToggle={rainViewer.togglePlay}
        />
      )}

      {/* Loading overlay */}
      {rainViewer.isLoading && (
        <div className="absolute inset-0 bg-white/50 dark:bg-black/50 backdrop-blur-sm flex items-center justify-center">
          <div className="text-sm text-macos-gray-600 dark:text-macos-gray-400">
            Loading radar data...
          </div>
        </div>
      )}
    </div>
  )
}
