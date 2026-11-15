import type { Icon } from '@phosphor-icons/react'
import type { ReactNode } from 'react'
import { cn } from '../../lib/utils'

export function EmptyState({
  icon: IconComponent,
  title,
  description,
  action,
  className,
}: {
  icon: Icon
  title: string
  description?: string
  action?: ReactNode
  className?: string
}) {
  return (
    <div className={cn('flex flex-col items-center px-6 py-9 text-center', className)}>
      <span className="mb-4 flex size-12 items-center justify-center rounded-full border border-line text-muted">
        <IconComponent size={22} weight="regular" aria-hidden="true" />
      </span>
      <p className="text-[14px] font-semibold text-ink">{title}</p>
      {description && (
        <p className="mt-1.5 max-w-[250px] text-[12px] leading-relaxed text-muted">
          {description}
        </p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}
