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
  compact?: boolean
  hasOwmApiKey?: boolean
}

export function MapControls({
  layers,
  onToggleLayer,
  onOpacityChange,
  compact = false,
  hasOwmApiKey = false,
}: MapControlsProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [expandedLayer, setExpandedLayer] = useState<string | null>(null)

  const activeLayerCount = layers.filter((l) => l.visible).length

  return (
    <div className="absolute top-3 right-3 z-[1000]">
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
        {!compact && 'Layers'}
        {activeLayerCount > 0 && !isOpen && (
          <span className={cn("px-1.5 py-0.5 text-xs bg-macos-blue text-white rounded-full", !compact && "ml-1")}>
            {activeLayerCount}
          </span>
        )}
      </GlassButton>

      {/* Layer panel - opens to the left on compact mode to avoid overflow */}
      {isOpen && (
        <GlassCard
          variant="elevated"
          padding="sm"
          className={cn(
            "absolute mt-2 animate-scale-in shadow-xl",
            compact
              ? "right-0 w-48 max-h-48 overflow-y-auto"
              : "right-0 w-64 max-h-80 overflow-y-auto"
          )}
        >
          <div className={cn("space-y-2", compact && "space-y-1")}>
            {layers.map((layer) => {
              const needsApiKey = layer.requiresApiKey && !hasOwmApiKey
              const isDisabled = needsApiKey

              return (
                <div key={layer.id} className="space-y-1">
                  <div
                    className={cn(
                      "flex items-center justify-between cursor-pointer rounded-lg p-1.5 -mx-1.5 transition-colors",
                      "hover:bg-white/50 dark:hover:bg-white/10",
                      isDisabled && "opacity-60"
                    )}
                    onClick={() => compact && setExpandedLayer(expandedLayer === layer.id ? null : layer.id)}
                    title={needsApiKey ? 'Requires OpenWeatherMap API key (see Settings)' : undefined}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className={cn(compact ? "text-base" : "text-lg")}>{getLayerIcon(layer.id)}</span>
                      <div className="min-w-0">
                        <span className={cn(
                          "font-medium text-macos-gray-900 dark:text-white truncate block",
                          compact ? "text-xs" : "text-sm"
                        )}>
                          {layer.name}
                        </span>
                        {needsApiKey && !compact && (
                          <span className="text-xs text-macos-orange">
                            API key required
                          </span>
                        )}
                      </div>
                    </div>
                    <Toggle
                      checked={layer.visible && !isDisabled}
                      onChange={() => !isDisabled && onToggleLayer(layer.id)}
                      size="sm"
                      disabled={isDisabled}
                    />
                  </div>

                  {/* Opacity slider - always show in non-compact, click to expand in compact */}
                  {layer.visible && !isDisabled && (!compact || expandedLayer === layer.id) && (
                    <div className={cn("pl-7", compact && "pb-1")}>
                      <Slider
                        value={Math.round(layer.opacity * 100)}
                        onChange={(value) => onOpacityChange(layer.id, value / 100)}
                        min={10}
                        max={100}
                        showValue
                        valueFormatter={(v) => `${v}%`}
                      />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
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
