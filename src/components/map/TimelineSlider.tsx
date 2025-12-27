import { Slider } from '../common/Slider'
import { PlayIcon, PauseIcon, ChevronLeftIcon, ChevronRightIcon } from '../common/Icon'
import type { RainViewerFrame } from '../../types/map'
import { formatFrameTime } from '../../api/rainviewer'
import { cn } from '../../utils/cn'

interface TimelineSliderProps {
  frames: RainViewerFrame[]
  currentIndex: number
  isPlaying: boolean
  onIndexChange: (index: number) => void
  onPlayToggle: () => void
  label?: string
  compact?: boolean
}

export function TimelineSlider({
  frames,
  currentIndex,
  isPlaying,
  onIndexChange,
  onPlayToggle,
  label,
  compact = false,
}: TimelineSliderProps) {
  if (frames.length === 0) return null

  const currentFrame = frames[currentIndex]
  const currentTime = currentFrame ? formatFrameTime(currentFrame.time) : '--:--'

  // Check if current frame is in the future (nowcast)
  const now = Date.now() / 1000
  const isNowcast = currentFrame && currentFrame.time > now

  return (
    <div
      className={cn(
        "absolute left-1/2 -translate-x-1/2 z-[1000]",
        "bg-white dark:bg-macos-gray-800",
        "shadow-lg border border-macos-gray-200 dark:border-macos-gray-700",
        "rounded-lg",
        compact
          ? "bottom-[60px] px-2 py-1.5"
          : "bottom-[70px] px-3 py-2"
      )}
    >
      <div className={cn("flex items-center", compact ? "gap-1.5" : "gap-2")}>
        {/* Previous button */}
        <button
          onClick={() => onIndexChange(Math.max(0, currentIndex - 1))}
          disabled={currentIndex === 0}
          className={cn(
            'flex items-center justify-center rounded transition-colors',
            'text-macos-gray-600 dark:text-macos-gray-400',
            'hover:bg-macos-gray-100 dark:hover:bg-macos-gray-700',
            'disabled:opacity-30 disabled:cursor-not-allowed',
            compact ? 'w-6 h-6' : 'w-7 h-7'
          )}
          aria-label="Previous frame"
          title="Previous frame"
        >
          <ChevronLeftIcon size={compact ? 14 : 16} />
        </button>

        {/* Play/Pause button - prominent affordance */}
        <button
          onClick={onPlayToggle}
          className={cn(
            'flex items-center justify-center rounded-full transition-all',
            'bg-macos-blue text-white',
            'hover:bg-macos-blue-dark active:scale-95',
            'shadow-sm',
            compact ? 'w-7 h-7' : 'w-8 h-8'
          )}
          aria-label={isPlaying ? 'Pause animation' : 'Play animation'}
          title={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? (
            <PauseIcon size={compact ? 12 : 14} />
          ) : (
            <PlayIcon size={compact ? 12 : 14} />
          )}
        </button>

        {/* Next button */}
        <button
          onClick={() => onIndexChange(Math.min(frames.length - 1, currentIndex + 1))}
          disabled={currentIndex === frames.length - 1}
          className={cn(
            'flex items-center justify-center rounded transition-colors',
            'text-macos-gray-600 dark:text-macos-gray-400',
            'hover:bg-macos-gray-100 dark:hover:bg-macos-gray-700',
            'disabled:opacity-30 disabled:cursor-not-allowed',
            compact ? 'w-6 h-6' : 'w-7 h-7'
          )}
          aria-label="Next frame"
          title="Next frame"
        >
          <ChevronRightIcon size={compact ? 14 : 16} />
        </button>

        {/* Divider */}
        <div className="w-px h-5 bg-macos-gray-200 dark:bg-macos-gray-700 mx-1" />

        {/* Timeline slider */}
        <div className={compact ? "w-20" : "w-28"}>
          <Slider
            value={currentIndex}
            onChange={onIndexChange}
            min={0}
            max={frames.length - 1}
          />
        </div>

        {/* Time display */}
        <div className={cn(
          "text-right",
          compact ? "min-w-[50px]" : "min-w-[60px]"
        )}>
          <div className={cn(
            "font-semibold tabular-nums text-macos-gray-900 dark:text-white",
            compact ? "text-xs" : "text-sm"
          )}>
            {currentTime}
          </div>
          <div className={cn(
            "text-macos-gray-500 dark:text-macos-gray-400",
            compact ? "text-[10px]" : "text-xs"
          )}>
            {label || (isNowcast ? 'Forecast' : 'Past')}
          </div>
        </div>
      </div>
    </div>
  )
}
