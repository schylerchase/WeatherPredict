import { useState } from 'react'
import { PlayIcon, PauseIcon, ChevronLeftIcon, ChevronRightIcon } from '../common/Icon'
import type { RainViewerFrame } from '../../types/map'
import { formatFrameTime } from '../../api/rainviewer'
import { cn } from '../../utils/cn'

interface MapTimelineProps {
  frames: RainViewerFrame[]
  currentIndex: number
  isPlaying: boolean
  onIndexChange: (index: number) => void
  onPlayToggle: () => void
  onSpeedChange?: (speed: number) => void
  speed?: number
  label?: string
}

const SPEED_OPTIONS = [
  { value: 1000, label: '0.5x' },
  { value: 500, label: '1x' },
  { value: 250, label: '2x' },
]

export function MapTimeline({
  frames,
  currentIndex,
  isPlaying,
  onIndexChange,
  onPlayToggle,
  onSpeedChange,
  speed = 500,
  label,
}: MapTimelineProps) {
  const [showSpeedMenu, setShowSpeedMenu] = useState(false)

  if (frames.length === 0) return null

  const currentFrame = frames[currentIndex]
  const currentTime = currentFrame ? formatFrameTime(currentFrame.time) : '--:--'

  // Check if current frame is in the future (nowcast)
  const now = Date.now() / 1000
  const isNowcast = currentFrame && currentFrame.time > now

  // Find the "now" index for visual indicator
  const nowIndex = frames.findIndex(f => f.time > now) - 1

  const currentSpeedLabel = SPEED_OPTIONS.find(s => s.value === speed)?.label || '1x'

  return (
    <div className={cn(
      "bg-white dark:bg-macos-gray-800",
      "border-t border-macos-gray-200 dark:border-macos-gray-700",
      "px-4 py-3"
    )}>
      <div className="flex items-center gap-4">
        {/* Playback controls */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => onIndexChange(Math.max(0, currentIndex - 1))}
            disabled={currentIndex === 0}
            className={cn(
              'flex items-center justify-center w-8 h-8 rounded',
              'text-macos-gray-600 dark:text-macos-gray-400',
              'hover:bg-macos-gray-100 dark:hover:bg-macos-gray-700',
              'disabled:opacity-30 disabled:cursor-not-allowed',
              'transition-colors'
            )}
            title="Previous frame"
          >
            <ChevronLeftIcon size={18} />
          </button>

          <button
            onClick={onPlayToggle}
            className={cn(
              'flex items-center justify-center w-10 h-10 rounded-full',
              'bg-macos-blue text-white',
              'hover:bg-blue-600 active:scale-95',
              'transition-all shadow-sm'
            )}
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <PauseIcon size={18} /> : <PlayIcon size={18} />}
          </button>

          <button
            onClick={() => onIndexChange(Math.min(frames.length - 1, currentIndex + 1))}
            disabled={currentIndex === frames.length - 1}
            className={cn(
              'flex items-center justify-center w-8 h-8 rounded',
              'text-macos-gray-600 dark:text-macos-gray-400',
              'hover:bg-macos-gray-100 dark:hover:bg-macos-gray-700',
              'disabled:opacity-30 disabled:cursor-not-allowed',
              'transition-colors'
            )}
            title="Next frame"
          >
            <ChevronRightIcon size={18} />
          </button>
        </div>

        {/* Timeline scrubber */}
        <div className="flex-1 flex flex-col gap-1">
          {/* Time markers */}
          <div className="relative h-6">
            {/* Track background */}
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-1.5 bg-macos-gray-200 dark:bg-macos-gray-700 rounded-full" />

            {/* Progress fill */}
            <div
              className="absolute top-1/2 -translate-y-1/2 h-1.5 bg-macos-blue rounded-full transition-all duration-100"
              style={{ width: `${(currentIndex / (frames.length - 1)) * 100}%` }}
            />

            {/* Now marker */}
            {nowIndex >= 0 && nowIndex < frames.length && (
              <div
                className="absolute top-1/2 -translate-y-1/2 w-0.5 h-3 bg-macos-gray-400 dark:bg-macos-gray-500"
                style={{ left: `${(nowIndex / (frames.length - 1)) * 100}%` }}
                title="Now"
              />
            )}

            {/* Draggable thumb */}
            <input
              type="range"
              min={0}
              max={frames.length - 1}
              value={currentIndex}
              onChange={(e) => onIndexChange(parseInt(e.target.value))}
              className={cn(
                "absolute inset-0 w-full opacity-0 cursor-pointer",
                "[&::-webkit-slider-thumb]:opacity-100 [&::-webkit-slider-thumb]:appearance-none",
                "[&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4",
                "[&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full",
                "[&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:border-2",
                "[&::-webkit-slider-thumb]:border-macos-blue [&::-webkit-slider-thumb]:cursor-pointer"
              )}
            />

            {/* Visual thumb */}
            <div
              className={cn(
                "absolute top-1/2 -translate-y-1/2 -translate-x-1/2",
                "w-4 h-4 bg-white rounded-full shadow-md",
                "border-2 border-macos-blue",
                "pointer-events-none transition-all duration-100"
              )}
              style={{ left: `${(currentIndex / (frames.length - 1)) * 100}%` }}
            />
          </div>

          {/* Labels below */}
          <div className="flex justify-between text-[10px] text-macos-gray-500 dark:text-macos-gray-400">
            <span>{frames[0] ? formatFrameTime(frames[0].time) : ''}</span>
            <span className="font-medium">
              {nowIndex >= 0 && nowIndex < frames.length ? 'Now ↓' : ''}
            </span>
            <span>{frames[frames.length - 1] ? formatFrameTime(frames[frames.length - 1].time) : ''}</span>
          </div>
        </div>

        {/* Current time display */}
        <div className="text-right min-w-[70px]">
          <div className="text-lg font-semibold tabular-nums text-macos-gray-900 dark:text-white">
            {currentTime}
          </div>
          <div className="text-xs text-macos-gray-500 dark:text-macos-gray-400">
            {label || (isNowcast ? 'Forecast' : 'Past')}
          </div>
        </div>

        {/* Speed control */}
        {onSpeedChange && (
          <div className="relative">
            <button
              onClick={() => setShowSpeedMenu(!showSpeedMenu)}
              className={cn(
                'flex items-center gap-1 px-2 py-1 rounded',
                'text-xs font-medium',
                'text-macos-gray-600 dark:text-macos-gray-400',
                'hover:bg-macos-gray-100 dark:hover:bg-macos-gray-700',
                'border border-macos-gray-200 dark:border-macos-gray-700',
                'transition-colors'
              )}
              title="Animation speed"
            >
              {currentSpeedLabel}
              <svg width={10} height={10} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {showSpeedMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowSpeedMenu(false)} />
                <div className={cn(
                  "absolute bottom-full right-0 mb-1 z-20",
                  "bg-white dark:bg-macos-gray-800",
                  "rounded-lg shadow-xl border border-macos-gray-200 dark:border-macos-gray-700",
                  "overflow-hidden min-w-[60px]"
                )}>
                  {SPEED_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        onSpeedChange(option.value)
                        setShowSpeedMenu(false)
                      }}
                      className={cn(
                        'w-full px-3 py-1.5 text-xs text-left',
                        'hover:bg-macos-gray-100 dark:hover:bg-macos-gray-700',
                        speed === option.value
                          ? 'text-macos-blue font-semibold'
                          : 'text-macos-gray-700 dark:text-macos-gray-300'
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* Frame counter */}
        <div className="text-xs text-macos-gray-500 dark:text-macos-gray-400 tabular-nums min-w-[50px] text-right">
          {currentIndex + 1} / {frames.length}
        </div>
      </div>
    </div>
  )
}
