import { ArrowLeft } from '@phosphor-icons/react'
import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'

export function PageHeader({
  title,
  subtitle,
  back,
  right,
}: {
  title: string
  subtitle?: string
  back?: boolean
  right?: ReactNode
}) {
  return (
    <header className="px-5 pb-6 pt-[calc(env(safe-area-inset-top)+1.25rem)]">
      {back && (
        <Link
          to="/"
          aria-label="Kembali ke beranda"
          className="mb-5 flex size-11 items-center justify-center rounded-full border border-line text-ink transition-colors hover:bg-surface-2"
        >
          <ArrowLeft size={18} weight="bold" aria-hidden="true" />
        </Link>
      )}
      <div className="flex items-end justify-between gap-4">
        <div className="min-w-0">
          <h1 className="type-title text-[34px] leading-[1.02] text-ink">{title}</h1>
          {subtitle && (
            <p className="mt-2 max-w-[270px] text-[12px] leading-relaxed text-muted">
              {subtitle}
            </p>
          )}
        </div>
        {right && <div className="flex shrink-0 items-center gap-2 pb-1">{right}</div>}
      </div>
    </header>
  )
}
