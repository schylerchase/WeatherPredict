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
      <div
        className={cn(
          'flex items-center rounded-xl',
          'bg-white/90 dark:bg-macos-gray-800/90 backdrop-blur-xl',
          'shadow-lg border border-white/20 dark:border-white/10',
          compact ? 'gap-0.5 px-1.5 py-1' : 'gap-1 px-2 py-1.5'
        )}
      >
        {visibleLayers.map((layer) => {
          const needsApiKey = layer.requiresApiKey && !hasOwmApiKey
          const isDisabled = needsApiKey
          const isActive = layer.visible && !isDisabled
          const isExpanded = expandedLayer === layer.id

          return (
            <div key={layer.id} className="relative">
              <button
                onClick={() => handleLayerClick(layer.id, isDisabled)}
                disabled={isDisabled}
                title={
                  needsApiKey
                    ? `${layer.name} requires API key (Settings)`
                    : layer.name
                }
                className={cn(
                  'flex items-center rounded-lg',
                  'font-medium transition-all duration-200',
                  'focus:outline-none focus:ring-2 focus:ring-macos-blue/50',
                  compact ? 'gap-1 px-2 py-1 text-xs' : 'gap-1.5 px-3 py-1.5 text-sm',
                  isActive
                    ? [
                        'bg-macos-blue text-white',
                        'shadow-sm',
                      ]
                    : [
                        'text-macos-gray-700 dark:text-macos-gray-300',
                        'hover:bg-macos-gray-100 dark:hover:bg-macos-gray-700',
                      ],
                  isDisabled && 'opacity-40 cursor-not-allowed'
                )}
              >
                <span className={compact ? "text-sm" : "text-base"}>{LAYER_ICONS[layer.id] || '🗺️'}</span>
                {!compact && <span className="hidden sm:inline">{layer.name}</span>}
              </button>

              {/* Opacity popup */}
              {isExpanded && isActive && (
                <div
                  className={cn(
                    'absolute bottom-full left-1/2 -translate-x-1/2 mb-2',
                    'w-36 p-2 rounded-lg',
                    'bg-white/95 dark:bg-macos-gray-800/95 backdrop-blur-xl',
                    'shadow-lg border border-white/20 dark:border-white/10',
                    'animate-scale-in'
                  )}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-macos-gray-600 dark:text-macos-gray-400">
                      Opacity
                    </span>
                    <button
                      onClick={() => handleToggleOff(layer.id)}
                      className="text-xs text-macos-red hover:underline"
                    >
                      Turn off
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
