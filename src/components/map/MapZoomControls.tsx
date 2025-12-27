import { useMap } from 'react-leaflet'
import { cn } from '../../utils/cn'

interface MapZoomControlsProps {
  className?: string
  onFullscreen?: () => void
  isFullscreen?: boolean
}

function PlusIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  )
}

function MinusIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  )
}

function ExpandIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <polyline points="15 3 21 3 21 9" />
      <polyline points="9 21 3 21 3 15" />
      <line x1="21" y1="3" x2="14" y2="10" />
      <line x1="3" y1="21" x2="10" y2="14" />
    </svg>
  )
}

function ShrinkIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <polyline points="4 14 10 14 10 20" />
      <polyline points="20 10 14 10 14 4" />
      <line x1="14" y1="10" x2="21" y2="3" />
      <line x1="3" y1="21" x2="10" y2="14" />
    </svg>
  )
}

function LocateIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <circle cx="12" cy="12" r="4" />
      <line x1="12" y1="2" x2="12" y2="6" />
      <line x1="12" y1="18" x2="12" y2="22" />
      <line x1="2" y1="12" x2="6" y2="12" />
      <line x1="18" y1="12" x2="22" y2="12" />
    </svg>
  )
}

export function MapZoomControls({ className, onFullscreen, isFullscreen = false }: MapZoomControlsProps) {
  const map = useMap()

  const handleZoomIn = () => {
    map.zoomIn()
  }

  const handleZoomOut = () => {
    map.zoomOut()
  }

  const handleLocate = () => {
    map.locate({ setView: true, maxZoom: 12 })
  }

  const buttonClass = cn(
    'flex items-center justify-center w-8 h-8',
    'bg-white dark:bg-macos-gray-800',
    'text-macos-gray-700 dark:text-macos-gray-300',
    'hover:bg-macos-gray-50 dark:hover:bg-macos-gray-700',
    'hover:text-macos-gray-900 dark:hover:text-white',
    'transition-colors duration-150',
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-macos-blue',
    'disabled:opacity-40 disabled:cursor-not-allowed'
  )

  return (
    <div className={cn(
      "flex flex-col",
      "bg-white dark:bg-macos-gray-800",
      "rounded-lg shadow-lg border border-macos-gray-200 dark:border-macos-gray-700",
      "overflow-hidden",
      className
    )}>
      <button
        onClick={handleZoomIn}
        className={cn(buttonClass, 'border-b border-macos-gray-200 dark:border-macos-gray-700')}
        title="Zoom in"
        aria-label="Zoom in"
      >
        <PlusIcon />
      </button>

      <button
        onClick={handleZoomOut}
        className={cn(buttonClass, 'border-b border-macos-gray-200 dark:border-macos-gray-700')}
        title="Zoom out"
        aria-label="Zoom out"
      >
        <MinusIcon />
      </button>

      <button
        onClick={handleLocate}
        className={cn(buttonClass, onFullscreen && 'border-b border-macos-gray-200 dark:border-macos-gray-700')}
        title="Go to my location"
        aria-label="Go to my location"
      >
        <LocateIcon />
      </button>

      {onFullscreen && (
        <button
          onClick={onFullscreen}
          className={buttonClass}
          title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
          aria-label={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
        >
          {isFullscreen ? <ShrinkIcon /> : <ExpandIcon />}
        </button>
      )}
    </div>
  )
}
