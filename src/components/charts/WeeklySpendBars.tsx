import { isToday } from 'date-fns'
import {
  cn,
  dateKey,
  formatCompactIDR,
  formatWeekdayShort,
  lastNDays,
} from '../../lib/utils'
import type { Transaction } from '../../types'

export function WeeklySpendBars({ transactions }: { transactions: Transaction[] }) {
  const days = lastNDays(7)
  const totals = days.map((day) => {
    const key = dateKey(day)
    const total = transactions
      .filter((transaction) => transaction.type === 'expense' && transaction.date === key)
      .reduce((sum, transaction) => sum + transaction.amount, 0)
    return { day, key, total }
  })
  const max = Math.max(...totals.map((entry) => entry.total), 1)
  const weekTotal = totals.reduce((sum, entry) => sum + entry.total, 0)

  return (
    <div>
      <div className="mb-3 flex items-baseline justify-between gap-2">
        <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted">
          7 hari terakhir
        </span>
        <span className="text-[11px] font-bold text-ink">{formatCompactIDR(weekTotal)}</span>
      </div>
      <div
        className="flex h-[78px] items-end justify-between gap-1.5"
        role="img"
        aria-label={`Pengeluaran 7 hari terakhir: ${totals
          .map((entry) => `${formatWeekdayShort(entry.day)} ${formatCompactIDR(entry.total)}`)
          .join(', ')}`}
      >
        {totals.map((entry) => {
          const today = isToday(entry.day)
          const height = entry.total === 0 ? 5 : Math.max(12, Math.round((entry.total / max) * 58))
          return (
            <div
              key={entry.key}
              className="flex h-full flex-1 flex-col items-center justify-end gap-2"
              title={`${entry.key}: ${formatCompactIDR(entry.total)}`}
            >
              <div
                className={cn(
                  'w-full max-w-[9px] rounded-full transition-all duration-500',
                  today
                    ? 'bg-brand-strong'
                    : entry.total === 0
                      ? 'bg-ink/10'
                      : 'bg-ink/25',
                )}
                style={{ height }}
              />
              <span
                className={cn(
                  'text-[8.5px] font-bold uppercase tracking-wide',
                  today ? 'text-ink' : 'text-muted',
                )}
              >
                {formatWeekdayShort(entry.day)}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
