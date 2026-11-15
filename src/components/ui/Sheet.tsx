import { useEffect, useId, useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { X } from '@phosphor-icons/react'
import { cn } from '../../lib/utils'

interface SheetProps {
  open: boolean
  onClose: () => void
  title: string
  description?: string
  children: ReactNode
  footer?: ReactNode
  className?: string
}

export function Sheet({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  className,
}: SheetProps) {
  const titleId = useId()
  const descriptionId = useId()
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return

    const previousFocus = document.activeElement as HTMLElement | null
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const frame = requestAnimationFrame(() => panelRef.current?.focus())

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      cancelAnimationFrame(frame)
      document.body.style.overflow = originalOverflow
      document.removeEventListener('keydown', handleKeyDown)
      previousFocus?.focus?.()
    }
  }, [open, onClose])

  if (!open) return null

  return createPortal(
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        tabIndex={-1}
        aria-label="Tutup panel"
        onClick={onClose}
        className="absolute inset-0 animate-fade-in bg-[#0b0d0b]/50 backdrop-blur-[3px]"
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        tabIndex={-1}
        className={cn(
          'absolute inset-x-0 bottom-0 mx-auto flex max-h-[92dvh] w-full max-w-[430px] animate-sheet-up flex-col overflow-hidden rounded-t-[32px] border-t border-line/70 bg-surface outline-none',
          className,
        )}
      >
        <div className="shrink-0 px-5 pb-2 pt-3">
          <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-line" aria-hidden="true" />
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 pt-0.5">
              <h2
                id={titleId}
                className="type-title text-[26px] leading-[1.05] text-ink"
              >
                {title}
              </h2>
              {description && (
                <p id={descriptionId} className="mt-1.5 text-[12px] leading-relaxed text-muted">
                  {description}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Tutup"
              className="-mr-2 flex size-11 shrink-0 items-center justify-center rounded-full bg-surface-2 text-ink transition-colors hover:bg-line"
            >
              <X size={18} weight="bold" aria-hidden="true" />
            </button>
          </div>
        </div>

        <div
          className={cn(
            'min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pt-4',
            footer ? 'pb-5' : 'pb-[calc(env(safe-area-inset-bottom)+1.5rem)]',
          )}
        >
          {children}
        </div>

        {footer && (
          <div className="shrink-0 border-t border-line/70 bg-surface px-5 pb-[calc(env(safe-area-inset-bottom)+1rem)] pt-4">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body,
  )
}
