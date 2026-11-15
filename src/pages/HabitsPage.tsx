import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  ArrowCounterClockwise,
  Check,
  DotsThree,
  Flame,
  Plus,
  Trash,
} from '@phosphor-icons/react'
import { useApp } from '../store/AppContext'
import { PageHeader } from '../components/layout/PageHeader'
import { Button } from '../components/ui/Button'
import { EmptyState } from '../components/ui/EmptyState'
import { ProgressRing } from '../components/ui/ProgressRing'
import { Sheet } from '../components/ui/Sheet'
import { useToast } from '../components/ui/ToastProvider'
import { HabitSheet } from '../components/forms/HabitSheet'
import { HabitIconBadge, StreakBadge } from '../components/habits/HabitBits'
import { HabitWeekGrid } from '../components/habits/HabitWeekGrid'
import { habitColors } from '../lib/icons'
import {
  cn,
  dateKey,
  getHabitStreak,
  lastNDays,
  todayKey,
} from '../lib/utils'
import type { Habit } from '../types'

export function HabitsPage() {
  const { habits, habitLogs, toggleHabit, deleteHabit } = useApp()
  const { toast } = useToast()
  const [searchParams, setSearchParams] = useSearchParams()
  const [formOpen, setFormOpen] = useState(searchParams.get('new') === '1')
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null)

  useEffect(() => {
    if (searchParams.get('new') === '1') {
      setFormOpen(true)
      const next = new URLSearchParams(searchParams)
      next.delete('new')
      setSearchParams(next, { replace: true })
    }
  }, [searchParams, setSearchParams])

  const today = todayKey()

  const isDoneOn = (habitId: string, date: string) =>
    habitLogs.some((log) => log.habitId === habitId && log.date === date && log.done)

  const doneToday = habits.filter((habit) => isDoneOn(habit.id, today)).length
  const bestStreak = habits.reduce(
    (best, habit) => Math.max(best, getHabitStreak(habitLogs, habit.id)),
    0,
  )

  const weekCheckins = useMemo(() => {
    const weekKeys = new Set(lastNDays(7).map(dateKey))
    const habitIds = new Set(habits.map((habit) => habit.id))
    return habitLogs.filter(
      (log) => log.done && habitIds.has(log.habitId) && weekKeys.has(log.date),
    ).length
  }, [habitLogs, habits])

  const handleToggle = (habit: Habit, date = today) => {
    const wasDone = isDoneOn(habit.id, date)
    toggleHabit(habit.id, date)
    toast(
      wasDone
        ? `${habit.name} dibatalkan`
        : date === today
          ? `${habit.name} selesai!`
          : `${habit.name} dicatat`,
      wasDone ? 'default' : 'success',
    )
  }

  const handleDelete = () => {
    if (!selectedHabit) return
    deleteHabit(selectedHabit.id)
    setSelectedHabit(null)
    toast('Kebiasaan dihapus', 'default')
  }

  const handleMenuToggle = () => {
    if (!selectedHabit) return
    const wasDone = isDoneOn(selectedHabit.id, today)
    toggleHabit(selectedHabit.id)
    setSelectedHabit(null)
    toast(
      wasDone ? `${selectedHabit.name} dibatalkan` : `${selectedHabit.name} selesai!`,
      wasDone ? 'default' : 'success',
    )
  }

  return (
    <div>
      <PageHeader
        title="Kebiasaan"
        subtitle="Rutinitas kecil, hasil yang besar."
        right={
          <Button
            variant="soft"
            size="icon"
            onClick={() => setFormOpen(true)}
            aria-label="Tambah kebiasaan baru"
          >
            <Plus size={19} weight="bold" aria-hidden="true" />
          </Button>
        }
      />

      <div className="space-y-4 px-4">
        <section className="rounded-[30px] bg-hero p-5 text-hero-ink">
          <div className="flex items-center gap-5">
            <ProgressRing
              value={doneToday}
              max={habits.length}
              size={82}
              stroke={6}
              tone="hero"
              label="Progres kebiasaan hari ini"
            />
            <div className="min-w-0 flex-1">
              <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-hero-muted">
                Hari ini
              </p>
              <p className="mt-1.5 text-[21px] font-bold leading-tight tracking-[-0.035em]">
                {doneToday} dari {habits.length} selesai
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
                <span className="flex items-center gap-1 text-[10px] font-bold text-hero-ink">
                  <Flame size={12} weight="fill" aria-hidden="true" />
                  Streak {bestStreak} hari
                </span>
                <span className="text-[10px] font-medium text-hero-muted">
                  {weekCheckins} check-in minggu ini
                </span>
              </div>
            </div>
          </div>
        </section>

        {habits.length === 0 ? (
          <div className="rounded-[30px] bg-surface">
            <EmptyState
              icon={Flame}
              title="Belum ada kebiasaan"
              description="Mulai dari satu kebiasaan kecil yang mudah kamu jaga setiap hari."
              action={
                <Button size="sm" onClick={() => setFormOpen(true)}>
                  Buat kebiasaan
                </Button>
              }
            />
          </div>
        ) : (
          <div className="space-y-3">
            {habits.map((habit) => {
              const color = habitColors[habit.color]
              const done = isDoneOn(habit.id, today)
              const weekKeys = new Set(lastNDays(7).map(dateKey))
              const weekDone = habitLogs.filter(
                (log) =>
                  log.habitId === habit.id && log.done && weekKeys.has(log.date),
              ).length

              return (
                <article key={habit.id} className="rounded-[30px] bg-surface p-4">
                  <div className="flex items-center gap-3">
                    <HabitIconBadge habit={habit} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[14px] font-semibold tracking-[-0.01em] text-ink">
                        {habit.name}
                      </p>
                      <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5">
                        <StreakBadge habit={habit} logs={habitLogs} />
                        <span className="text-[9.5px] font-medium leading-snug text-muted">
                          {weekDone}/7 minggu ini
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedHabit(habit)}
                      aria-label={`Aksi untuk kebiasaan ${habit.name}`}
                      className="-mr-1 flex size-11 shrink-0 items-center justify-center rounded-full text-muted transition-colors hover:bg-surface-2 hover:text-ink"
                    >
                      <DotsThree size={19} weight="bold" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleToggle(habit)}
                      aria-pressed={done}
                      aria-label={
                        done
                          ? `Batalkan ${habit.name} hari ini`
                          : `Tandai ${habit.name} selesai hari ini`
                      }
                      className="flex size-11 shrink-0 items-center justify-center rounded-full border transition-all duration-150 active:scale-95"
                      style={{
                        backgroundColor: done ? color.hex : 'transparent',
                        borderColor: done ? color.hex : 'var(--line)',
                        color: done ? color.onColor : 'var(--text)',
                      }}
                    >
                      {done ? (
                        <Check size={18} weight="bold" aria-hidden="true" />
                      ) : (
                        <Plus size={18} weight="bold" aria-hidden="true" />
                      )}
                    </button>
                  </div>

                  <div className="mt-3.5 border-t border-line/60 pt-3">
                    <HabitWeekGrid
                      habit={habit}
                      logs={habitLogs}
                      onToggleDay={(date) => handleToggle(habit, date)}
                    />
                  </div>
                </article>
              )
            })}
          </div>
        )}

        <p className="px-2 pb-2 pt-1 text-center text-[9.5px] font-medium text-muted">
          Konsistensi lebih penting daripada kesempurnaan
        </p>
      </div>

      <HabitSheet open={formOpen} onClose={() => setFormOpen(false)} />

      <Sheet
        open={Boolean(selectedHabit)}
        onClose={() => setSelectedHabit(null)}
        title="Aksi kebiasaan"
        description={selectedHabit?.name}
      >
        {selectedHabit && (
          <div className="space-y-2 pb-2">
            <div
              className={cn(
                'mb-3 flex items-center gap-3 rounded-[20px] bg-surface-2 px-3.5 py-3.5',
              )}
            >
              <HabitIconBadge habit={selectedHabit} size="sm" />
              <div>
                <p className="text-[12px] font-semibold text-ink">{selectedHabit.name}</p>
                <p className="text-[9.5px] font-medium text-muted">
                  Streak {getHabitStreak(habitLogs, selectedHabit.id)} hari
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleMenuToggle}
              className="flex min-h-[52px] w-full items-center gap-3 rounded-full bg-surface-2 px-4 text-left transition-colors active:bg-line"
            >
              {isDoneOn(selectedHabit.id, today) ? (
                <ArrowCounterClockwise size={19} className="text-ink" aria-hidden="true" />
              ) : (
                <Check size={19} weight="bold" className="text-brand-strong" aria-hidden="true" />
              )}
              <span className="text-[13px] font-semibold text-ink">
                {isDoneOn(selectedHabit.id, today)
                  ? 'Batalkan hari ini'
                  : 'Tandai selesai hari ini'}
              </span>
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="flex min-h-[52px] w-full items-center gap-3 rounded-full bg-danger-soft px-4 text-left transition-opacity active:opacity-80"
            >
              <Trash size={19} className="text-danger" aria-hidden="true" />
              <span className="text-[13px] font-semibold text-danger">Hapus kebiasaan</span>
            </button>
          </div>
        )}
      </Sheet>
    </div>
  )
}
