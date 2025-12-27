import { useState } from 'react'
import { Slider } from '../common/Slider'
import type { MapLayer } from '../../types/map'
import { cn } from '../../utils/cn'

interface LayerBarProps {
  layers: MapLayer[]
  onToggleLayer: (layerId: string) => void
  onOpacityChange: (layerId: string, opacity: number) => void
  hasOwmApiKey?: boolean
  compact?: boolean
}

const LAYER_ICONS: Record<string, string> = {
  radar: '📡',
  satellite: '🛰️',
  temperature: '🌡️',
  precipitation: '🌧️',
  wind: '💨',
  clouds: '☁️',
}

const LAYER_LABELS: Record<string, string> = {
  radar: 'Radar',
  satellite: 'Satellite',
  temperature: 'Temp',
  precipitation: 'Rain',
  wind: 'Wind',
  clouds: 'Clouds',
}

export function LayerBar({
  layers,
  onToggleLayer,
  onOpacityChange,
  hasOwmApiKey = false,
  compact = false,
}: LayerBarProps) {
  const [expandedLayer, setExpandedLayer] = useState<string | null>(null)

  // In compact mode, only show the free layers (radar, satellite)
  const visibleLayers = compact
    ? layers.filter(l => !l.requiresApiKey)
    : layers

  const handleLayerClick = (layerId: string, isDisabled: boolean | undefined) => {
    if (isDisabled) return

    const layer = layers.find((l) => l.id === layerId)
    if (!layer) return

    // If layer is active and we click again, show opacity slider
    if (layer.visible) {
      setExpandedLayer(expandedLayer === layerId ? null : layerId)
    } else {
      // Turn on the layer
      onToggleLayer(layerId)
      setExpandedLayer(null)
    }
  }

  const handleToggleOff = (layerId: string) => {
    onToggleLayer(layerId)
    setExpandedLayer(null)
  }

  return (
    <div className={cn(
      "absolute left-1/2 -translate-x-1/2 z-[1000]",
      compact ? "bottom-2" : "bottom-3"
    )}>
      {/* Clear "Layers" label for context */}
      <div
        className={cn(
          'flex flex-col items-center gap-1',
        )}
      >
        {/* Layer toggle buttons with clear affordance */}
        <div
          className={cn(
            'flex items-center rounded-lg',
            'bg-white dark:bg-macos-gray-800',
            'shadow-lg border border-macos-gray-200 dark:border-macos-gray-700',
            compact ? 'gap-0' : 'gap-0'
          )}
        >
          {visibleLayers.map((layer, index) => {
            const needsApiKey = layer.requiresApiKey && !hasOwmApiKey
            const isDisabled = needsApiKey
            const isActive = layer.visible && !isDisabled
            const isExpanded = expandedLayer === layer.id
            const isFirst = index === 0
            const isLast = index === visibleLayers.length - 1

            return (
              <div key={layer.id} className="relative">
                <button
                  onClick={() => handleLayerClick(layer.id, isDisabled)}
                  disabled={isDisabled}
                  title={
                    needsApiKey
                      ? `${layer.name} requires API key (Settings)`
                      : isActive
                        ? `${layer.name} (click to adjust)`
                        : `Show ${layer.name}`
                  }
                  className={cn(
                    'flex flex-col items-center justify-center',
                    'font-medium transition-all duration-150',
                    'focus:outline-none focus:ring-2 focus:ring-inset focus:ring-macos-blue',
                    'border-r border-macos-gray-200 dark:border-macos-gray-700',
                    isLast && 'border-r-0',
                    isFirst && 'rounded-l-lg',
                    isLast && 'rounded-r-lg',
                    compact
                      ? 'w-14 h-12 text-xs gap-0.5'
                      : 'w-16 h-14 text-xs gap-1',
                    isActive
                      ? [
                          'bg-macos-blue text-white',
                        ]
                      : [
                          'bg-white dark:bg-macos-gray-800',
                          'text-macos-gray-700 dark:text-macos-gray-300',
                          'hover:bg-macos-gray-50 dark:hover:bg-macos-gray-700',
                        ],
                    isDisabled && 'opacity-40 cursor-not-allowed'
                  )}
                >
                  <span className={compact ? "text-base" : "text-lg"}>
                    {LAYER_ICONS[layer.id] || '🗺️'}
                  </span>
                  <span className="font-medium">
                    {LAYER_LABELS[layer.id] || layer.name}
                  </span>
                </button>

                {/* Opacity popup - appears above the button */}
                {isExpanded && isActive && (
                  <div
                    className={cn(
                      'absolute bottom-full left-1/2 -translate-x-1/2 mb-2',
                      'w-32 p-3 rounded-lg',
                      'bg-white dark:bg-macos-gray-800',
                      'shadow-xl border border-macos-gray-200 dark:border-macos-gray-700',
                      'animate-scale-in'
                    )}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-macos-gray-900 dark:text-white">
                        Opacity
                      </span>
                      <button
                        onClick={() => handleToggleOff(layer.id)}
                        className="text-xs font-medium text-macos-red hover:underline"
                      >
                        Hide
                      </button>
                    </div>
                    <Slider
                      value={Math.round(layer.opacity * 100)}
                      onChange={(value) => onOpacityChange(layer.id, value / 100)}
                      min={20}
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
      </div>

      {/* Click outside to close */}
      {expandedLayer && (
        <div
          className="fixed inset-0 z-[-1]"
          onClick={() => setExpandedLayer(null)}
        />
      )}
    </div>
  )
}
