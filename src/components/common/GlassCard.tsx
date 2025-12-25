import { type ReactNode, type HTMLAttributes } from 'react'
import { cn } from '../../utils/cn'

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  blur?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  variant?: 'default' | 'elevated' | 'inset' | 'solid'
  hover?: boolean
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

const blurMap = {
  sm: 'backdrop-blur-sm',
  md: 'backdrop-blur-md',
  lg: 'backdrop-blur-lg',
  xl: 'backdrop-blur-xl',
  '2xl': 'backdrop-blur-2xl',
}

const paddingMap = {
  none: '',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
}

export function GlassCard({
  children,
  className,
  blur = 'xl',
  variant = 'default',
  hover = false,
  padding = 'md',
  ...props
}: GlassCardProps) {
  return (
    <div
      className={cn(
        // Base styles
        'rounded-macos-lg overflow-hidden',
        blurMap[blur],
        paddingMap[padding],

        // Variant styles
        variant === 'default' && [
          'bg-white/60 dark:bg-macos-gray-800/60',
          'border border-white/20 dark:border-white/10',
          'shadow-glass dark:shadow-glass-dark',
        ],
        variant === 'elevated' && [
          'bg-white/70 dark:bg-macos-gray-800/70',
          'border border-white/30 dark:border-white/15',
          'shadow-macos-lg',
        ],
        variant === 'inset' && [
          'bg-black/5 dark:bg-white/5',
          'border border-black/5 dark:border-white/5',
        ],
        variant === 'solid' && [
          'bg-white dark:bg-macos-gray-800',
          'border border-macos-gray-200 dark:border-macos-gray-700',
          'shadow-macos',
        ],

        // Hover effect
        hover && [
          'transition-all duration-300 ease-macos cursor-pointer',
          'hover:bg-white/70 dark:hover:bg-macos-gray-700/70',
          'hover:shadow-macos-hover',
          'hover:scale-[1.02]',
          'hover:-translate-y-0.5',
        ],

        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
