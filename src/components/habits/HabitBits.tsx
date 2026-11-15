import { Flame } from '@phosphor-icons/react'
import { cn, getHabitStreak } from '../../lib/utils'
import { habitColors, HabitGlyph } from '../../lib/icons'
import type { Habit, HabitLog } from '../../types'

export function HabitIconBadge({
  habit,
  size = 'md',
}: {
  habit: Habit
  size?: 'sm' | 'md' | 'lg'
}) {
  const color = habitColors[habit.color].hex
  return (
    <span
      className={cn(
        'relative flex shrink-0 items-center justify-center rounded-full bg-surface-2 text-ink',
        size === 'sm' && 'size-9',
        size === 'md' && 'size-11',
        size === 'lg' && 'size-14',
      )}
    >
      <HabitGlyph icon={habit.icon} size={size === 'lg' ? 24 : size === 'md' ? 20 : 17} />
      <span
        className="absolute bottom-0 right-0 size-2.5 rounded-full ring-2 ring-surface"
        style={{ backgroundColor: color }}
        aria-hidden="true"
      />
    </span>
  )
}

export function StreakBadge({ habit, logs }: { habit: Habit; logs: HabitLog[] }) {
  const streak = getHabitStreak(logs, habit.id)
  if (streak === 0) {
    return <span className="text-[10.5px] font-medium text-muted">Mulai hari ini</span>
  }
  return (
    <span className="flex items-center gap-0.5 text-[10.5px] font-bold text-accent">
      <Flame size={11} weight="fill" aria-hidden="true" />
      {streak} hari
    </span>
  )
}
