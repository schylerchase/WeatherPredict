import { useState } from 'react'
import { GlassCard } from '../common/GlassCard'
import { GlassButton } from '../common/GlassButton'
import { Toggle } from '../common/Toggle'
import { Slider } from '../common/Slider'
import { LayersIcon, CloseIcon } from '../common/Icon'
import type { MapLayer } from '../../types/map'
import { cn } from '../../utils/cn'

interface MapControlsProps {
  layers: MapLayer[]
  onToggleLayer: (layerId: string) => void
  onOpacityChange: (layerId: string, opacity: number) => void
}

export function MapControls({
  layers,
  onToggleLayer,
  onOpacityChange,
}: MapControlsProps) {
  const [isOpen, setIsOpen] = useState(false)

  const activeLayerCount = layers.filter((l) => l.visible).length

  return (
    <div className="absolute top-4 right-4 z-[1000]">
      {/* Toggle button */}
      <GlassButton
        variant="secondary"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'shadow-lg',
          isOpen && 'bg-macos-blue text-white hover:bg-macos-blue-light'
        )}
        icon={isOpen ? <CloseIcon size={16} /> : <LayersIcon size={16} />}
      >
        Layers
        {activeLayerCount > 0 && !isOpen && (
          <span className="ml-1 px-1.5 py-0.5 text-xs bg-macos-blue text-white rounded-full">
            {activeLayerCount}
          </span>
        )}
      </GlassButton>

      {/* Layer panel */}
      {isOpen && (
        <GlassCard
          variant="elevated"
          padding="sm"
          className="absolute top-full right-0 mt-2 w-64 animate-scale-in"
        >
          <h3 className="text-xs font-semibold text-macos-gray-500 dark:text-macos-gray-400 uppercase tracking-wide mb-3">
            Map Layers
          </h3>

          <div className="space-y-4">
            {layers.map((layer) => (
              <div key={layer.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{getLayerIcon(layer.id)}</span>
                    <div>
                      <div className="text-sm font-medium text-macos-gray-900 dark:text-white">
                        {layer.name}
                      </div>
                      <div className="text-xs text-macos-gray-500 dark:text-macos-gray-400">
                        {layer.description}
                      </div>
                    </div>
                  </div>
                  <Toggle
                    checked={layer.visible}
                    onChange={() => onToggleLayer(layer.id)}
                    size="sm"
                  />
                </div>

                {/* Opacity slider (only shown when layer is visible) */}
                {layer.visible && (
                  <Slider
                    value={Math.round(layer.opacity * 100)}
                    onChange={(value) => onOpacityChange(layer.id, value / 100)}
                    min={10}
                    max={100}
                    showValue
                    valueFormatter={(v) => `${v}%`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Note about available layers */}
          <p className="mt-4 text-xs text-macos-gray-400 dark:text-macos-gray-500">
            Radar data from RainViewer
          </p>
        </GlassCard>
      )}
    </div>
  )
}

function getLayerIcon(layerId: string): string {
  const icons: Record<string, string> = {
    radar: '📡',
    satellite: '🛰️',
    temperature: '🌡️',
    precipitation: '🌧️',
    wind: '💨',
    clouds: '☁️',
    pressure: '📊',
  }
  return icons[layerId] || '🗺️'
}
