import { Check } from '@phosphor-icons/react'
import { isToday } from 'date-fns'
import { habitColors } from '../../lib/icons'
import { cn, dateKey, formatWeekdayShort, lastNDays } from '../../lib/utils'
import type { Habit, HabitLog } from '../../types'

export function HabitWeekGrid({
  habit,
  logs,
  onToggleDay,
}: {
  habit: Habit
  logs: HabitLog[]
  onToggleDay?: (date: string) => void
}) {
  const days = lastNDays(7)
  const doneDates = new Set(
    logs.filter((log) => log.habitId === habit.id && log.done).map((log) => log.date),
  )
  const { hex, onColor } = habitColors[habit.color]

  return (
    <div className="flex w-full gap-0.5" role="group" aria-label={`Riwayat 7 hari ${habit.name}`}>
      {days.map((day) => {
        const key = dateKey(day)
        const done = doneDates.has(key)
        const today = isToday(day)
        const circle = (
          <span
            className={cn(
              'flex size-[26px] items-center justify-center rounded-full border transition-colors',
              today && !done && 'ring-2 ring-offset-2 ring-offset-surface',
            )}
            style={{
              backgroundColor: done ? hex : 'transparent',
              borderColor: done ? hex : today ? hex : 'var(--line)',
              color: done ? onColor : hex,
              ...(today && !done ? { boxShadow: `0 0 0 2px ${hex}22` } : {}),
            }}
          >
            {done && <Check size={12} weight="bold" aria-hidden="true" />}
          </span>
        )
        return (
          <div key={key} className="flex min-w-0 flex-1 flex-col items-center gap-1">
            {onToggleDay ? (
              <button
                type="button"
                onClick={() => onToggleDay(key)}
                aria-label={`${habit.name} ${key}${done ? ', selesai' : ', belum selesai'}`}
                aria-pressed={done}
                className="flex h-10 w-full items-center justify-center rounded-full transition-transform active:scale-90"
              >
                {circle}
              </button>
            ) : (
              <span title={`${key}${done ? ' · selesai' : ' · belum'}`}>{circle}</span>
            )}
            <span
              className={cn(
                'text-[8px] font-bold uppercase tracking-wide',
                today ? 'text-ink' : 'text-muted',
              )}
            >
              {formatWeekdayShort(day)}
            </span>
          </div>
        )
      })}
    </div>
  )
}
