import type { ButtonHTMLAttributes } from 'react'
import { cn } from '../../lib/utils'

interface ChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean
}

export function Chip({ active = false, className, type = 'button', ...props }: ChipProps) {
  return (
    <button
      type={type}
      aria-pressed={active}
      className={cn(
        'inline-flex min-h-10 shrink-0 items-center justify-center gap-1.5 rounded-full border px-4 text-[12px] font-semibold transition-all duration-150 active:scale-95',
        active
          ? 'border-ink bg-ink text-canvas'
          : 'border-line bg-transparent text-muted hover:border-ink/30 hover:text-ink',
        className,
      )}
      {...props}
    />
  )
}
