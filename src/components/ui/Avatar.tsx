import { cn, initials } from '../../lib/utils'

export function Avatar({
  name,
  size = 'md',
  className,
}: {
  name: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'flex shrink-0 items-center justify-center rounded-full bg-ink font-bold text-canvas',
        size === 'sm' && 'size-9 text-[11px]',
        size === 'md' && 'size-11 text-[13px]',
        size === 'lg' && 'size-16 text-[19px]',
        className,
      )}
    >
      {initials(name)}
    </span>
  )
}
