import { type InputHTMLAttributes } from 'react'
import { cn } from '../../utils/cn'

interface SliderProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
  showValue?: boolean
  valueFormatter?: (value: number) => string
}

export function Slider({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  showValue = false,
  valueFormatter = (v) => v.toString(),
  className,
  disabled,
  ...props
}: SliderProps) {
  const percentage = ((value - min) / (max - min)) * 100

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div className="relative flex-1">
        {/* Track background */}
        <div className="absolute inset-0 h-1.5 top-1/2 -translate-y-1/2 rounded-full bg-macos-gray-200 dark:bg-macos-gray-700" />

        {/* Filled track */}
        <div
          className="absolute h-1.5 top-1/2 -translate-y-1/2 rounded-full bg-macos-blue"
          style={{ width: `${percentage}%` }}
        />

        {/* Input */}
        <input
          type="range"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          className={cn(
            'relative w-full h-6 appearance-none bg-transparent cursor-pointer',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            // Thumb styles (WebKit)
            '[&::-webkit-slider-thumb]:appearance-none',
            '[&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5',
            '[&::-webkit-slider-thumb]:rounded-full',
            '[&::-webkit-slider-thumb]:bg-white',
            '[&::-webkit-slider-thumb]:shadow-md',
            '[&::-webkit-slider-thumb]:border-0',
            '[&::-webkit-slider-thumb]:cursor-pointer',
            '[&::-webkit-slider-thumb]:transition-transform',
            '[&::-webkit-slider-thumb]:hover:scale-110',
            // Thumb styles (Firefox)
            '[&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5',
            '[&::-moz-range-thumb]:rounded-full',
            '[&::-moz-range-thumb]:bg-white',
            '[&::-moz-range-thumb]:shadow-md',
            '[&::-moz-range-thumb]:border-0',
            '[&::-moz-range-thumb]:cursor-pointer'
          )}
          {...props}
        />
      </div>

      {showValue && (
        <span className="min-w-[3rem] text-right text-sm text-macos-gray-600 dark:text-macos-gray-400">
          {valueFormatter(value)}
        </span>
      )}
    </div>
  )
}
