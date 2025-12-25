import { cn } from '../../utils/cn'

interface ToggleProps {
  checked: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
  label?: string
  labelPosition?: 'left' | 'right'
}

const sizeStyles = {
  sm: {
    track: 'w-8 h-5',
    thumb: 'w-3.5 h-3.5',
    translate: 'translate-x-3.5',
  },
  md: {
    track: 'w-11 h-6',
    thumb: 'w-5 h-5',
    translate: 'translate-x-5',
  },
  lg: {
    track: 'w-14 h-7',
    thumb: 'w-6 h-6',
    translate: 'translate-x-7',
  },
}

export function Toggle({
  checked,
  onChange,
  disabled = false,
  size = 'md',
  label,
  labelPosition = 'right',
}: ToggleProps) {
  const styles = sizeStyles[size]

  const toggle = (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        // Track
        'relative inline-flex shrink-0 cursor-pointer rounded-full',
        'transition-colors duration-200 ease-macos',
        'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-macos-blue/50',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        styles.track,
        checked
          ? 'bg-macos-blue'
          : 'bg-macos-gray-300 dark:bg-macos-gray-600'
      )}
    >
      {/* Thumb */}
      <span
        className={cn(
          'pointer-events-none inline-block rounded-full',
          'bg-white shadow-md',
          'transform transition-transform duration-200 ease-macos',
          'mt-0.5 ml-0.5',
          styles.thumb,
          checked ? styles.translate : 'translate-x-0'
        )}
      />
    </button>
  )

  if (!label) {
    return toggle
  }

  return (
    <label className="inline-flex items-center gap-3 cursor-pointer">
      {labelPosition === 'left' && (
        <span className="text-sm text-macos-gray-700 dark:text-macos-gray-300">
          {label}
        </span>
      )}
      {toggle}
      {labelPosition === 'right' && (
        <span className="text-sm text-macos-gray-700 dark:text-macos-gray-300">
          {label}
        </span>
      )}
    </label>
  )
}
