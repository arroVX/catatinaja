import { cn } from '../../lib/utils'

export function ProgressRing({
  value,
  max,
  size = 78,
  stroke = 6,
  className,
  label,
  tone = 'default',
}: {
  value: number
  max: number
  size?: number
  stroke?: number
  className?: string
  label?: string
  tone?: 'default' | 'hero'
}) {
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const safeMax = Math.max(max, 1)
  const percentage = Math.min(1, Math.max(0, value / safeMax))
  const offset = circumference * (1 - percentage)

  return (
    <div
      className={cn('relative shrink-0', className)}
      style={{ width: size, height: size }}
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={safeMax}
      aria-label={label}
    >
      <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={tone === 'hero' ? 'var(--hero-line)' : 'var(--line)'}
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={tone === 'hero' ? 'var(--hero-ink)' : 'var(--text)'}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-[stroke-dashoffset] duration-500 ease-out"
        />
      </svg>
      <span className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className={cn(
            'text-[19px] font-bold leading-none tracking-[-0.02em]',
            tone === 'hero' ? 'text-hero-ink' : 'text-ink',
          )}
        >
          {Math.round(percentage * 100)}%
        </span>
        <span
          className={cn(
            'mt-0.5 text-[8px] font-bold uppercase tracking-[0.12em]',
            tone === 'hero' ? 'text-hero-muted' : 'text-muted',
          )}
        >
          hari ini
        </span>
      </span>
    </div>
  )
}
