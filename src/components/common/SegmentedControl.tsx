import { cn } from '../../utils/cn'

interface Option<T extends string> {
  value: T
  label: string
  icon?: React.ReactNode
}

interface SegmentedControlProps<T extends string> {
  options: Option<T>[]
  value: T
  onChange: (value: T) => void
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  size = 'md',
  fullWidth = false,
}: SegmentedControlProps<T>) {
  return (
    <div
      className={cn(
        'inline-flex p-1 rounded-macos',
        'bg-macos-gray-100 dark:bg-macos-gray-800',
        fullWidth && 'w-full'
      )}
    >
      {options.map((option) => {
        const isSelected = option.value === value

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={cn(
              'relative flex items-center justify-center gap-1.5',
              'font-medium rounded-macos',
              'transition-all duration-200 ease-macos',
              'focus:outline-none focus:ring-2 focus:ring-inset focus:ring-macos-blue/50',

              // Size
              size === 'sm' && 'px-2.5 py-1 text-xs',
              size === 'md' && 'px-3 py-1.5 text-sm',
              size === 'lg' && 'px-4 py-2 text-base',

              // Full width
              fullWidth && 'flex-1',

              // Selected state
              isSelected
                ? [
                    'bg-white dark:bg-macos-gray-700',
                    'text-macos-gray-900 dark:text-white',
                    'shadow-sm',
                  ]
                : [
                    'text-macos-gray-600 dark:text-macos-gray-400',
                    'hover:text-macos-gray-900 dark:hover:text-white',
                  ]
            )}
          >
            {option.icon && (
              <span className={cn(size === 'sm' ? 'text-xs' : 'text-sm')}>
                {option.icon}
              </span>
            )}
            <span>{option.label}</span>
          </button>
        )
      })}
    </div>
  )
}
