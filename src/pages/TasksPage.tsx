import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  ArrowCounterClockwise,
  CheckCircle,
  ListChecks,
  Plus,
  Trash,
  WarningCircle,
} from '@phosphor-icons/react'
import { addDays, format, isToday } from 'date-fns'
import { useApp } from '../store/AppContext'
import { PageHeader } from '../components/layout/PageHeader'
import { Button } from '../components/ui/Button'
import { EmptyState } from '../components/ui/EmptyState'
import { Sheet } from '../components/ui/Sheet'
import { TaskItem } from '../components/tasks/TaskItem'
import { TaskSheet } from '../components/forms/TaskSheet'
import { useToast } from '../components/ui/ToastProvider'
import {
  cn,
  dateKey,
  formatDateFull,
  formatDateShort,
  formatWeekdayShort,
  percent,
  todayKey,
} from '../lib/utils'
import type { Task } from '../types'

const dateStripLength = 7

export function TasksPage() {
  const { tasks, toggleTask, deleteTask } = useApp()
  const { toast } = useToast()
  const [searchParams, setSearchParams] = useSearchParams()
  const [formOpen, setFormOpen] = useState(searchParams.get('new') === '1')
  const [selectedDate, setSelectedDate] = useState(todayKey())
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)

  useEffect(() => {
    if (searchParams.get('new') === '1') {
      setFormOpen(true)
      const next = new URLSearchParams(searchParams)
      next.delete('new')
      setSearchParams(next, { replace: true })
    }
  }, [searchParams, setSearchParams])

  const today = new Date()
  const days = useMemo(
    () => Array.from({ length: dateStripLength }, (_, index) => addDays(today, index - 2)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [todayKey()],
  )

  const overdueTasks = useMemo(
    () =>
      tasks
        .filter((task) => !task.completed && task.dueDate < todayKey())
        .sort((a, b) => a.dueDate.localeCompare(b.dueDate)),
    [tasks],
  )

  const dayTasks = useMemo(
    () =>
      tasks
        .filter((task) => task.dueDate === selectedDate)
        .sort((a, b) => Number(a.completed) - Number(b.completed)),
    [tasks, selectedDate],
  )

  const completed = dayTasks.filter((task) => task.completed).length
  const progress = percent(completed, dayTasks.length)
  const isSelectedToday = selectedDate === todayKey()

  const handleToggle = (task: Task) => {
    toggleTask(task.id)
    if (!task.completed) {
      toast('Tugas selesai. Mantap!', 'success')
    }
  }

  const handleMenuToggle = () => {
    if (!selectedTask) return
    const wasCompleted = selectedTask.completed
    toggleTask(selectedTask.id)
    setSelectedTask(null)
    if (!wasCompleted) toast('Tugas selesai. Mantap!', 'success')
  }

  const handleMenuDelete = () => {
    if (!selectedTask) return
    deleteTask(selectedTask.id)
    setSelectedTask(null)
    toast('Tugas dihapus', 'default')
  }

  const progressMessage =
    dayTasks.length === 0
      ? 'Belum ada tugas untuk tanggal ini.'
      : completed === dayTasks.length
        ? 'Semua beres. Saatnya istirahat sejenak.'
        : 'Sedikit lagi, kamu bisa menyelesaikannya.'

  return (
    <div>
      <PageHeader
        title="Tugas"
        subtitle={formatDateFull(selectedDate)}
        right={
          <Button
            variant="soft"
            size="icon"
            onClick={() => setFormOpen(true)}
            aria-label="Tambah tugas baru"
          >
            <Plus size={19} weight="bold" aria-hidden="true" />
          </Button>
        }
      />

      <div className="space-y-4">
        <div
          className="flex gap-1.5 overflow-x-auto px-4 pb-1 no-scrollbar"
          aria-label="Pilih tanggal"
        >
          {days.map((day) => {
            const key = dateKey(day)
            const selected = key === selectedDate
            const dayIsToday = isToday(day)
            const hasPending = tasks.some((task) => task.dueDate === key && !task.completed)
            return (
              <button
                key={key}
                type="button"
                onClick={() => setSelectedDate(key)}
                aria-pressed={selected}
                aria-label={`${formatDateFull(day)}${hasPending ? ', ada tugas' : ''}`}
                className={cn(
                  'flex min-h-[72px] min-w-[47px] flex-1 flex-col items-center justify-center gap-0.5 rounded-full border py-3 transition-all duration-150 active:scale-95',
                  selected
                    ? 'border-ink bg-ink text-canvas'
                    : dayIsToday
                      ? 'border-ink/45 bg-surface text-ink'
                      : 'border-line bg-surface text-ink',
                )}
              >
                <span
                  className={cn(
                    'text-[8px] font-bold uppercase tracking-[0.08em]',
                    selected ? 'text-canvas/60' : 'text-muted',
                  )}
                >
                  {formatWeekdayShort(day)}
                </span>
                <span className="text-[16px] font-bold leading-none">{format(day, 'd')}</span>
                <span
                  className={cn(
                    'mt-1.5 size-1 rounded-full',
                    hasPending
                      ? selected
                        ? 'bg-canvas'
                        : 'bg-brand-strong'
                      : 'bg-transparent',
                  )}
                  aria-hidden="true"
                />
              </button>
            )
          })}
        </div>

        <div className="px-4">
          <section className="rounded-[30px] bg-hero p-5 text-hero-ink">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-hero-muted">
                  {isSelectedToday ? 'Hari ini' : formatDateShort(selectedDate)}
                </p>
                <p className="mt-2 text-[27px] font-bold leading-none tracking-[-0.045em]">
                  {completed} dari {dayTasks.length}
                </p>
                <p className="mt-1.5 text-[10.5px] font-medium text-hero-muted">tugas selesai</p>
              </div>
              <span className="text-[32px] font-bold leading-none tracking-[-0.045em]">
                {progress}%
              </span>
            </div>
            <div className="mt-5 h-1 w-full overflow-hidden rounded-full bg-hero-line">
              <div
                className="h-full rounded-full bg-hero-ink transition-[width] duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="mt-3 text-[10.5px] font-medium leading-relaxed text-hero-muted">
              {progressMessage}
            </p>
          </section>
        </div>

        {overdueTasks.length > 0 && (
          <section className="px-4">
            <div className="mb-2 flex items-center gap-1.5 px-1">
              <WarningCircle size={13} weight="fill" className="text-danger" aria-hidden="true" />
              <h2 className="text-[10px] font-bold uppercase tracking-[0.14em] text-danger">
                Terlambat
              </h2>
              <span className="rounded-full bg-danger-soft px-2 py-0.5 text-[9px] font-bold text-danger">
                {overdueTasks.length}
              </span>
            </div>
            <div className="divide-y divide-line/60 rounded-[24px] bg-surface px-3.5">
              {overdueTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggle={() => handleToggle(task)}
                  onMenu={() => setSelectedTask(task)}
                  hideDueLabel
                />
              ))}
            </div>
          </section>
        )}

        <section className="px-4">
          <div className="mb-2 flex items-center justify-between gap-3 px-1">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.14em] text-ink">
              {isSelectedToday ? 'Tugas hari ini' : `Tugas ${formatDateShort(selectedDate)}`}
            </h2>
            <span className="text-[9.5px] font-medium text-muted">{dayTasks.length} tugas</span>
          </div>

          {dayTasks.length === 0 ? (
            <div className="rounded-[30px] bg-surface">
              <EmptyState
                icon={ListChecks}
                title="Belum ada tugas"
                description="Tambahkan tugas untuk tanggal ini agar harimu lebih terarah."
                action={
                  <Button size="sm" onClick={() => setFormOpen(true)}>
                    Tambah tugas
                  </Button>
                }
              />
            </div>
          ) : (
            <div className="divide-y divide-line/60 rounded-[24px] bg-surface px-3.5">
              {dayTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggle={() => handleToggle(task)}
                  onMenu={() => setSelectedTask(task)}
                />
              ))}
            </div>
          )}
        </section>

        <p className="px-2 pt-1 text-center text-[9.5px] font-medium text-muted">
          Ketuk menu titik tiga untuk menghapus tugas
        </p>
      </div>

      <TaskSheet
        open={formOpen}
        onClose={() => setFormOpen(false)}
        defaultDate={selectedDate}
      />

      <Sheet
        open={Boolean(selectedTask)}
        onClose={() => setSelectedTask(null)}
        title="Aksi tugas"
        description={selectedTask?.title}
      >
        {selectedTask && (
          <div className="space-y-2 pb-2">
            <div className="mb-3 rounded-[20px] bg-surface-2 px-4 py-3.5">
              <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-muted">
                Tenggat
              </p>
              <p className="mt-1 text-[12.5px] font-semibold text-ink">
                {formatDateFull(selectedTask.dueDate)}
              </p>
            </div>
            <button
              type="button"
              onClick={handleMenuToggle}
              className="flex min-h-[52px] w-full items-center gap-3 rounded-full bg-surface-2 px-4 text-left transition-colors active:bg-line"
            >
              {selectedTask.completed ? (
                <ArrowCounterClockwise size={19} className="text-ink" aria-hidden="true" />
              ) : (
                <CheckCircle size={19} weight="fill" className="text-brand-strong" aria-hidden="true" />
              )}
              <span className="text-[13px] font-semibold text-ink">
                {selectedTask.completed ? 'Tandai belum selesai' : 'Tandai selesai'}
              </span>
            </button>
            <button
              type="button"
              onClick={handleMenuDelete}
              className="flex min-h-[52px] w-full items-center gap-3 rounded-full bg-danger-soft px-4 text-left transition-opacity active:opacity-80"
            >
              <Trash size={19} className="text-danger" aria-hidden="true" />
              <span className="text-[13px] font-semibold text-danger">Hapus tugas</span>
            </button>
          </div>
        )}
      </Sheet>
    </div>
  )
}
