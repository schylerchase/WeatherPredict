import { GlassCard } from '../common/GlassCard'
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
}

export function TimelineSlider({
  frames,
  currentIndex,
  isPlaying,
  onIndexChange,
  onPlayToggle,
}: TimelineSliderProps) {
  if (frames.length === 0) return null

  const currentFrame = frames[currentIndex]
  const currentTime = currentFrame ? formatFrameTime(currentFrame.time) : '--:--'

  // Check if current frame is in the future (nowcast)
  const now = Date.now() / 1000
  const isNowcast = currentFrame && currentFrame.time > now

  return (
    <GlassCard
      variant="elevated"
      padding="sm"
      className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[1000] w-80 max-w-[calc(100%-2rem)]"
    >
      <div className="flex items-center gap-3">
        {/* Previous button */}
        <button
          onClick={() => onIndexChange(Math.max(0, currentIndex - 1))}
          disabled={currentIndex === 0}
          className={cn(
            'p-1.5 rounded-full transition-colors',
            'hover:bg-macos-gray-100 dark:hover:bg-macos-gray-700',
            'disabled:opacity-30 disabled:cursor-not-allowed'
          )}
          aria-label="Previous frame"
        >
          <ChevronLeftIcon size={16} />
        </button>

        {/* Play/Pause button */}
        <button
          onClick={onPlayToggle}
          className={cn(
            'p-2 rounded-full transition-colors',
            'bg-macos-blue text-white',
            'hover:bg-macos-blue-light'
          )}
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? <PauseIcon size={16} /> : <PlayIcon size={16} />}
        </button>

        {/* Next button */}
        <button
          onClick={() => onIndexChange(Math.min(frames.length - 1, currentIndex + 1))}
          disabled={currentIndex === frames.length - 1}
          className={cn(
            'p-1.5 rounded-full transition-colors',
            'hover:bg-macos-gray-100 dark:hover:bg-macos-gray-700',
            'disabled:opacity-30 disabled:cursor-not-allowed'
          )}
          aria-label="Next frame"
        >
          <ChevronRightIcon size={16} />
        </button>

        {/* Timeline slider */}
        <div className="flex-1">
          <Slider
            value={currentIndex}
            onChange={onIndexChange}
            min={0}
            max={frames.length - 1}
          />
        </div>

        {/* Time display */}
        <div className="text-right min-w-[60px]">
          <div className="text-sm font-medium text-macos-gray-900 dark:text-white">
            {currentTime}
          </div>
          <div className="text-xs text-macos-gray-500 dark:text-macos-gray-400">
            {isNowcast ? 'Forecast' : 'Past'}
          </div>
        </div>
      </div>
    </GlassCard>
  )
}
