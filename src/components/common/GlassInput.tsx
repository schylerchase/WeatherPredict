import { type InputHTMLAttributes, forwardRef, type ReactNode } from 'react'
import { cn } from '../../utils/cn'

interface GlassInputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: ReactNode
  iconPosition?: 'left' | 'right'
  error?: string
  fullWidth?: boolean
}

export const GlassInput = forwardRef<HTMLInputElement, GlassInputProps>(
  (
    {
      className,
      icon,
      iconPosition = 'left',
      error,
      fullWidth = true,
      ...props
    },
    ref
  ) => {
    return (
      <div className={cn('relative', fullWidth && 'w-full')}>
        {icon && iconPosition === 'left' && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-macos-gray-400 dark:text-macos-gray-500">
            {icon}
          </div>
        )}
        <input
          ref={ref}
          className={cn(
            // Base styles
            'w-full px-4 py-2.5',
            'bg-white/50 dark:bg-macos-gray-800/50',
            'backdrop-blur-md',
            'border rounded-macos',
            'text-macos-gray-900 dark:text-white',
            'placeholder:text-macos-gray-400 dark:placeholder:text-macos-gray-500',
            'transition-all duration-200 ease-macos',
            'focus:outline-none focus:ring-2',

            // Default border
            !error && [
              'border-macos-gray-200 dark:border-macos-gray-700',
              'focus:ring-macos-blue/50 focus:border-macos-blue',
            ],

            // Error state
            error && [
              'border-macos-red',
              'focus:ring-macos-red/50 focus:border-macos-red',
            ],

            // Icon padding
            icon && iconPosition === 'left' && 'pl-10',
            icon && iconPosition === 'right' && 'pr-10',

            className
          )}
          {...props}
        />
        {icon && iconPosition === 'right' && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-macos-gray-400 dark:text-macos-gray-500">
            {icon}
          </div>
        )}
        {error && (
          <p className="mt-1.5 text-sm text-macos-red">{error}</p>
        )}
      </div>
    )
  }
)

GlassInput.displayName = 'GlassInput'
