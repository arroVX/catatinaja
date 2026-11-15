import type { ReactNode } from 'react'
import { cn } from '../../lib/utils'

export const inputClass =
  'w-full rounded-[18px] border border-line bg-surface px-4 py-3.5 text-[14px] font-medium text-ink placeholder:text-muted/60 transition-colors focus:border-ink/40 focus:outline-none'

export function Field({
  label,
  hint,
  htmlFor,
  children,
  className,
}: {
  label: string
  hint?: string
  htmlFor?: string
  children: ReactNode
  className?: string
}) {
  return (
    <div className={cn('space-y-2', className)}>
      <label
        htmlFor={htmlFor}
        className="flex items-baseline justify-between gap-3 text-[10px] font-bold uppercase tracking-[0.14em] text-muted"
      >
        <span>{label}</span>
        {hint && <span className="text-[9px] font-semibold tracking-[0.1em]">{hint}</span>}
      </label>
      {children}
    </div>
  )
}
