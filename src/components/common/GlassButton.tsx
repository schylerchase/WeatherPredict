import { type ButtonHTMLAttributes, type ReactNode } from 'react'
import { cn } from '../../utils/cn'

interface GlassButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  icon?: ReactNode
  iconPosition?: 'left' | 'right'
  isLoading?: boolean
  fullWidth?: boolean
}

export function GlassButton({
  children,
  className,
  variant = 'secondary',
  size = 'md',
  icon,
  iconPosition = 'left',
  isLoading = false,
  fullWidth = false,
  disabled,
  ...props
}: GlassButtonProps) {
  const isDisabled = disabled || isLoading

  return (
    <button
      className={cn(
        // Base styles
        'relative inline-flex items-center justify-center gap-2',
        'font-medium rounded-macos',
        'transition-all duration-200 ease-macos',
        'focus:outline-none focus:ring-2 focus:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed',

        // Size variants
        size === 'sm' && 'px-3 py-1.5 text-sm',
        size === 'md' && 'px-4 py-2 text-sm',
        size === 'lg' && 'px-6 py-3 text-base',

        // Color variants
        variant === 'primary' && [
          'bg-macos-blue text-white',
          'hover:bg-macos-blue-light active:bg-macos-blue-dark',
          'focus:ring-macos-blue/50',
        ],
        variant === 'secondary' && [
          'bg-white/60 dark:bg-macos-gray-700/60',
          'backdrop-blur-md',
          'border border-white/20 dark:border-white/10',
          'text-macos-gray-900 dark:text-white',
          'hover:bg-white/80 dark:hover:bg-macos-gray-600/80',
          'focus:ring-macos-gray-400/50',
        ],
        variant === 'ghost' && [
          'bg-transparent',
          'text-macos-gray-700 dark:text-macos-gray-300',
          'hover:bg-macos-gray-100 dark:hover:bg-macos-gray-800',
          'focus:ring-macos-gray-400/50',
        ],
        variant === 'danger' && [
          'bg-macos-red text-white',
          'hover:bg-red-600 active:bg-red-700',
          'focus:ring-red-500/50',
        ],

        // Full width
        fullWidth && 'w-full',

        className
      )}
      disabled={isDisabled}
      {...props}
    >
      {isLoading && (
        <svg
          className="animate-spin h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {!isLoading && icon && iconPosition === 'left' && icon}
      <span className={isLoading ? 'opacity-70' : ''}>{children}</span>
      {!isLoading && icon && iconPosition === 'right' && icon}
    </button>
  )
}
