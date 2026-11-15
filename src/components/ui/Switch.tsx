import { cn } from '../../lib/utils'

export function Switch({
  checked,
  onChange,
  label,
}: {
  checked: boolean
  onChange: (checked: boolean) => void
  label: string
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className="flex h-11 w-12 shrink-0 items-center justify-center rounded-full"
    >
      <span
        className={cn(
          'relative block h-7 w-12 rounded-full transition-colors duration-200',
          checked ? 'bg-ink' : 'bg-surface-2 ring-1 ring-line',
        )}
        aria-hidden="true"
      >
        <span
          className={cn(
            'absolute left-0.5 top-[3px] size-[22px] rounded-full transition-transform duration-200',
            checked ? 'translate-x-[22px] bg-canvas' : 'translate-x-0 bg-muted',
          )}
        />
      </span>
    </button>
  )
}
