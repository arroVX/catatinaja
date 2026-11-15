import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts'
import { getCategory } from '../../lib/categories'
import { formatCompactIDR, formatIDR, percent } from '../../lib/utils'
import type { Transaction } from '../../types'

interface Slice {
  id: string
  label: string
  value: number
  color: string
}

const chartVars = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)',
]

export function buildCategorySlices(transactions: Transaction[]): {
  slices: Slice[]
  total: number
} {
  const grouped = new Map<string, number>()
  transactions
    .filter((transaction) => transaction.type === 'expense')
    .forEach((transaction) => {
      grouped.set(
        transaction.categoryId,
        (grouped.get(transaction.categoryId) ?? 0) + transaction.amount,
      )
    })

  const sorted = [...grouped.entries()]
    .map(([id, value]) => {
      const category = getCategory(id)
      return { id, label: category.label, value }
    })
    .filter((slice) => slice.value > 0)
    .sort((a, b) => b.value - a.value)

  const total = sorted.reduce((sum, slice) => sum + slice.value, 0)

  if (sorted.length <= 5) {
    return {
      slices: sorted.map((slice, index) => ({ ...slice, color: chartVars[index] })),
      total,
    }
  }

  const top = sorted.slice(0, 4)
  const rest = sorted.slice(4).reduce((sum, slice) => sum + slice.value, 0)
  return {
    slices: [
      ...top.map((slice, index) => ({ ...slice, color: chartVars[index] })),
      { id: 'rest', label: 'Lainnya', value: rest, color: 'var(--chart-5)' },
    ],
    total,
  }
}

export function SpendingDonut({ transactions }: { transactions: Transaction[] }) {
  const { slices, total } = buildCategorySlices(transactions)

  if (total <= 0) return null

  return (
    <div>
      <div className="relative mx-auto h-[176px] w-full max-w-[230px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={slices}
              dataKey="value"
              nameKey="label"
              innerRadius={60}
              outerRadius={84}
              paddingAngle={3}
              cornerRadius={4}
              stroke="none"
              isAnimationActive={false}
            >
              {slices.map((slice) => (
                <Cell key={slice.id} fill={slice.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-muted">
            Total
          </span>
          <span className="mt-1 text-[20px] font-bold tracking-[-0.03em] text-ink">
            {formatCompactIDR(total)}
          </span>
        </div>
      </div>

      <ul className="mt-5 space-y-3" aria-label="Rincian pengeluaran per kategori">
        {slices.map((slice) => (
          <li key={slice.id} className="flex items-center gap-2.5">
            <span
              className="size-2 shrink-0 rounded-full"
              style={{ backgroundColor: slice.color }}
              aria-hidden="true"
            />
            <span className="min-w-0 flex-1 truncate text-[12.5px] font-semibold text-ink">
              {slice.label}
            </span>
            <span className="text-[11px] font-medium text-muted">
              {formatIDR(slice.value)}
            </span>
            <span className="w-8 text-right text-[10.5px] font-bold text-ink">
              {percent(slice.value, total)}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
