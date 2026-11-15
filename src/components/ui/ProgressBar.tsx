import { cn } from '../../lib/utils'

export function ProgressBar({
  value,
  max = 100,
  className,
  barClassName,
  label,
}: {
  value: number
  max?: number
  className?: string
  barClassName?: string
  label?: string
}) {
  const safeMax = Math.max(max, 1)
  const percentage = Math.min(100, Math.max(0, (value / safeMax) * 100))
  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(value)}
      aria-valuemin={0}
      aria-valuemax={safeMax}
      aria-label={label}
      className={cn('h-1 w-full overflow-hidden rounded-full bg-line', className)}
    >
      <div
        className={cn(
          'h-full rounded-full bg-ink transition-[width] duration-500 ease-out',
          barClassName,
        )}
        style={{ width: `${percentage}%` }}
      />
    </div>
  )
}
