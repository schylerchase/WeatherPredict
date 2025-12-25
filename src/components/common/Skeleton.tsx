import { cn } from '../../utils/cn'

interface SkeletonProps {
  className?: string
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded'
  width?: string | number
  height?: string | number
  animation?: 'pulse' | 'wave' | 'none'
}

export function Skeleton({
  className,
  variant = 'rectangular',
  width,
  height,
  animation = 'pulse',
}: SkeletonProps) {
  return (
    <div
      className={cn(
        'bg-macos-gray-200 dark:bg-macos-gray-700',

        // Animation
        animation === 'pulse' && 'animate-pulse',
        animation === 'wave' && 'animate-shimmer',

        // Variants
        variant === 'text' && 'h-4 rounded',
        variant === 'circular' && 'rounded-full',
        variant === 'rectangular' && 'rounded-none',
        variant === 'rounded' && 'rounded-macos',

        className
      )}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
      }}
    />
  )
}

// Common skeleton patterns
export function SkeletonText({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          variant="text"
          className={cn(
            'h-4',
            i === lines - 1 ? 'w-3/4' : 'w-full'
          )}
        />
      ))}
    </div>
  )
}

export function SkeletonCard() {
  return (
    <div className="p-4 space-y-3">
      <Skeleton variant="rounded" height={24} width="60%" />
      <Skeleton variant="rounded" height={48} />
      <SkeletonText lines={2} />
    </div>
  )
}

export function SkeletonWeatherCard() {
  return (
    <div className="glass rounded-macos-lg p-6 space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton variant="text" width={120} height={20} />
        <Skeleton variant="circular" width={48} height={48} />
      </div>
      <Skeleton variant="text" width={100} height={48} />
      <Skeleton variant="text" width={80} height={16} />
      <div className="flex gap-4 mt-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} variant="rounded" width={60} height={24} />
        ))}
      </div>
    </div>
  )
}
