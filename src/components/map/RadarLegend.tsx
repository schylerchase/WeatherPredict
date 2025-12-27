import { cn } from '../../utils/cn'

interface RadarLegendProps {
  className?: string
  compact?: boolean
}

// RainViewer color scheme 6 (Rainbow @ SELEX-SI) - matches our radar tiles
const RADAR_COLORS = [
  { color: '#40fffd', label: 'Light' },
  { color: '#3beeec', label: '' },
  { color: '#32d0d2', label: '' },
  { color: '#2cb9bd', label: 'Moderate' },
  { color: '#0da510', label: '' },
  { color: '#0c9210', label: '' },
  { color: '#fdf802', label: 'Heavy' },
  { color: '#e5bc00', label: '' },
  { color: '#fd9500', label: '' },
  { color: '#fd0000', label: 'Intense' },
  { color: '#d40000', label: '' },
  { color: '#bc0000', label: '' },
  { color: '#f800fd', label: 'Extreme' },
]

export function RadarLegend({ className, compact = false }: RadarLegendProps) {
  return (
    <div className={cn(
      "flex flex-col gap-1",
      "bg-white/95 dark:bg-macos-gray-800/95 backdrop-blur-sm",
      "rounded-lg shadow-lg border border-macos-gray-200 dark:border-macos-gray-700",
      compact ? "p-2" : "p-3",
      className
    )}>
      <div className="text-[10px] font-semibold text-macos-gray-500 dark:text-macos-gray-400 uppercase tracking-wide">
        Intensity
      </div>

      {/* Color gradient bar */}
      <div className="flex h-2 rounded-sm overflow-hidden">
        {RADAR_COLORS.map((item, i) => (
          <div
            key={i}
            className="flex-1"
            style={{ backgroundColor: item.color }}
          />
        ))}
      </div>

      {/* Labels */}
      <div className="flex justify-between text-[9px] text-macos-gray-600 dark:text-macos-gray-400">
        <span>Light</span>
        <span>Heavy</span>
        <span>Extreme</span>
      </div>
    </div>
  )
}
