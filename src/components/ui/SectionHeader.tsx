import { ArrowUpRight } from '@phosphor-icons/react'
import { Link } from 'react-router-dom'

export function SectionHeader({
  title,
  actionLabel,
  actionTo,
  onAction,
}: {
  title: string
  actionLabel?: string
  actionTo?: string
  onAction?: () => void
}) {
  const actionClass =
    'flex min-h-9 items-center gap-1 rounded-full border border-line bg-transparent px-3 text-[11px] font-semibold text-ink transition-colors hover:bg-surface-2'
  return (
    <div className="mb-3 flex items-center justify-between gap-3">
      <h2 className="type-title text-[17px] text-ink">{title}</h2>
      {actionLabel && actionTo && (
        <Link to={actionTo} className={actionClass}>
          {actionLabel}
          <ArrowUpRight size={13} weight="bold" aria-hidden="true" />
        </Link>
      )}
      {actionLabel && onAction && (
        <button type="button" onClick={onAction} className={actionClass}>
          {actionLabel}
          <ArrowUpRight size={13} weight="bold" aria-hidden="true" />
        </button>
      )}
    </div>
  )
}
