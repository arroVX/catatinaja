import { Check, DotsThree, Flag } from '@phosphor-icons/react'
import { cn, isOverdue } from '../../lib/utils'
import type { Priority, Task } from '../../types'

const priorityMeta: Record<Priority, { label: string; className: string }> = {
  high: { label: 'Prioritas tinggi', className: 'text-danger' },
  medium: { label: 'Prioritas sedang', className: 'text-accent' },
  low: { label: 'Prioritas rendah', className: 'text-muted' },
}

export function TaskItem({
  task,
  onToggle,
  onMenu,
  hideDueLabel = false,
}: {
  task: Task
  onToggle: () => void
  onMenu?: () => void
  hideDueLabel?: boolean
}) {
  const overdue = !task.completed && isOverdue(task.dueDate)
  const priority = priorityMeta[task.priority]

  return (
    <div className="flex items-start gap-2.5 py-3">
      <button
        type="button"
        onClick={onToggle}
        aria-label={task.completed ? `Tandai belum selesai: ${task.title}` : `Tandai selesai: ${task.title}`}
        aria-pressed={task.completed}
        className="-ml-2 flex size-11 shrink-0 items-center justify-center"
      >
        <span
          className={cn(
            'flex size-[22px] items-center justify-center rounded-full border transition-all duration-150',
            task.completed
              ? 'border-ink bg-ink text-canvas'
              : 'border-ink/25 bg-transparent hover:border-ink',
          )}
        >
          {task.completed && <Check size={12} weight="bold" aria-hidden="true" />}
        </span>
      </button>

      <div className="min-w-0 flex-1 pt-0.5">
        <p
          className={cn(
            'text-[13.5px] font-semibold leading-snug tracking-[-0.01em] text-ink',
            task.completed && 'text-muted line-through decoration-muted/50',
          )}
        >
          {task.title}
        </p>
        <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
          {task.tag && (
            <span className="rounded-full border border-line px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.08em] text-muted">
              {task.tag}
            </span>
          )}
          <span
            className={cn('flex items-center gap-0.5 text-[9.5px] font-semibold', priority.className)}
            title={priority.label}
          >
            <Flag size={10} weight="fill" aria-hidden="true" />
            {priority.label.replace('Prioritas ', '')}
          </span>
          {overdue && (
            <span className="rounded-full bg-danger-soft px-2 py-0.5 text-[9px] font-bold text-danger">
              Terlambat
            </span>
          )}
          {!hideDueLabel && task.completed && (
            <span className="text-[9.5px] font-medium text-muted">Selesai</span>
          )}
        </div>
      </div>

      {onMenu && (
        <button
          type="button"
          onClick={onMenu}
          aria-label={`Aksi untuk tugas ${task.title}`}
          className="-mr-2 flex size-11 shrink-0 items-center justify-center rounded-full text-muted transition-colors hover:bg-surface-2 hover:text-ink"
        >
          <DotsThree size={19} weight="bold" aria-hidden="true" />
        </button>
      )}
    </div>
  )
}
