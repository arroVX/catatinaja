import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  CaretLeft,
  CaretRight,
  ChartPieSlice,
  Plus,
  Receipt,
  Trash,
} from '@phosphor-icons/react'
import { addMonths } from 'date-fns'
import { useApp } from '../store/AppContext'
import { PageHeader } from '../components/layout/PageHeader'
import { Button } from '../components/ui/Button'
import { Chip } from '../components/ui/Chip'
import { EmptyState } from '../components/ui/EmptyState'
import { Sheet } from '../components/ui/Sheet'
import { useToast } from '../components/ui/ToastProvider'
import { SpendingDonut } from '../components/charts/SpendingDonut'
import { TransactionSheet } from '../components/forms/TransactionSheet'
import { CategoryIcon } from '../lib/icons'
import { getCategory } from '../lib/categories'
import {
  cn,
  formatDateNumeric,
  formatIDR,
  formatMonthYear,
  parseKey,
  percent,
  relativeDayLabel,
} from '../lib/utils'
import type { Transaction, TransactionType } from '../types'

type Filter = 'all' | TransactionType

const filters: { value: Filter; label: string }[] = [
  { value: 'all', label: 'Semua' },
  { value: 'expense', label: 'Pengeluaran' },
  { value: 'income', label: 'Pemasukan' },
]

export function FinancePage() {
  const { transactions, deleteTransaction } = useApp()
  const { toast } = useToast()
  const [searchParams, setSearchParams] = useSearchParams()
  const [formOpen, setFormOpen] = useState(searchParams.get('new') === '1')
  const [viewDate, setViewDate] = useState(new Date())
  const [filter, setFilter] = useState<Filter>('all')
  const [selected, setSelected] = useState<Transaction | null>(null)

  useEffect(() => {
    if (searchParams.get('new') === '1') {
      setFormOpen(true)
      const next = new URLSearchParams(searchParams)
      next.delete('new')
      setSearchParams(next, { replace: true })
    }
  }, [searchParams, setSearchParams])

  const now = new Date()
  const isCurrentMonth =
    viewDate.getFullYear() === now.getFullYear() &&
    viewDate.getMonth() === now.getMonth()

  const monthPrefix = `${viewDate.getFullYear()}-${String(viewDate.getMonth() + 1).padStart(2, '0')}`
  const monthTransactions = useMemo(
    () => transactions.filter((transaction) => transaction.date.startsWith(monthPrefix)),
    [transactions, monthPrefix],
  )

  const stats = useMemo(() => {
    const income = monthTransactions
      .filter((transaction) => transaction.type === 'income')
      .reduce((sum, transaction) => sum + transaction.amount, 0)
    const expense = monthTransactions
      .filter((transaction) => transaction.type === 'expense')
      .reduce((sum, transaction) => sum + transaction.amount, 0)
    return { income, expense, balance: income - expense }
  }, [monthTransactions])

  const groups = useMemo(() => {
    const filtered = monthTransactions
      .filter((transaction) => filter === 'all' || transaction.type === filter)
      .slice()
      .sort((a, b) => b.date.localeCompare(a.date))

    const map = new Map<string, Transaction[]>()
    filtered.forEach((transaction) => {
      const items = map.get(transaction.date) ?? []
      items.push(transaction)
      map.set(transaction.date, items)
    })
    return [...map.entries()]
  }, [monthTransactions, filter])

  const handleDelete = () => {
    if (!selected) return
    deleteTransaction(selected.id)
    setSelected(null)
    toast('Transaksi dihapus', 'default')
  }

  const selectedCategory = selected ? getCategory(selected.categoryId) : null
  const visibleCount = monthTransactions.filter(
    (transaction) => filter === 'all' || transaction.type === filter,
  ).length
  const expenseShare = percent(stats.expense, Math.max(stats.income, stats.expense, 1))

  return (
    <div>
      <PageHeader
        title="Keuangan"
        subtitle="Catat arus kasmu, satu transaksi setiap hari."
        right={
          <Button
            variant="soft"
            size="icon"
            onClick={() => setFormOpen(true)}
            aria-label="Catat transaksi baru"
          >
            <Plus size={19} weight="bold" aria-hidden="true" />
          </Button>
        }
      />

      <div className="space-y-4 px-4">
        <div className="flex items-center justify-between px-1">
          <button
            type="button"
            onClick={() => setViewDate(addMonths(viewDate, -1))}
            aria-label="Bulan sebelumnya"
            className="flex size-11 items-center justify-center rounded-full border border-line text-ink transition-colors hover:bg-surface-2 active:scale-95"
          >
            <CaretLeft size={17} weight="bold" aria-hidden="true" />
          </button>
          <div className="text-center">
            <p className="type-title text-[15px] text-ink">{formatMonthYear(viewDate)}</p>
            <p className="mt-0.5 text-[9px] font-bold uppercase tracking-[0.1em] text-muted">
              {isCurrentMonth ? 'Bulan ini' : 'Arsip transaksi'} · {visibleCount} transaksi
            </p>
          </div>
          <button
            type="button"
            onClick={() => setViewDate(addMonths(viewDate, 1))}
            disabled={isCurrentMonth}
            aria-label="Bulan berikutnya"
            className="flex size-11 items-center justify-center rounded-full border border-line text-ink transition-colors hover:bg-surface-2 active:scale-95 disabled:pointer-events-none disabled:opacity-25"
          >
            <CaretRight size={17} weight="bold" aria-hidden="true" />
          </button>
        </div>

        <section className="rounded-[30px] bg-hero p-5 text-hero-ink">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-hero-muted">
                Pengeluaran bulan ini
              </p>
              <p className="mt-2 text-[30px] font-bold leading-none tracking-[-0.045em]">
                {formatIDR(stats.expense)}
              </p>
            </div>
            <span className="mt-0.5 shrink-0 rounded-full border border-hero-line px-2.5 py-1 text-[9px] font-semibold text-hero-ink">
              {stats.income > 0 ? `${percent(stats.expense, stats.income)}% pemasukan` : 'Tanpa pemasukan'}
            </span>
          </div>

          <div className="mt-5">
            <div className="h-1 w-full overflow-hidden rounded-full bg-hero-line">
              <div
                className="h-full rounded-full bg-hero-ink"
                style={{ width: `${Math.min(100, expenseShare)}%` }}
              />
            </div>
            <div className="mt-2 flex items-center justify-between text-[9px] font-medium text-hero-muted">
              <span>Pengeluaran</span>
              <span>Pemasukan</span>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-4 border-t border-hero-line pt-4">
            <div className="min-w-0">
              <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-hero-muted">
                Pemasukan
              </p>
              <p className="mt-1 truncate text-[14px] font-semibold">{formatIDR(stats.income)}</p>
            </div>
            <div className="min-w-0">
              <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-hero-muted">
                Sisa bulan ini
              </p>
              <p className={cn('mt-1 truncate text-[14px] font-semibold')}>
                {formatIDR(stats.balance)}
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-[30px] bg-surface p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="type-eyebrow">Kategori</p>
              <h2 className="type-title mt-1 text-[19px] text-ink">Ke mana uangmu pergi?</h2>
            </div>
          </div>
          {stats.expense > 0 ? (
            <div className="mt-4">
              <SpendingDonut transactions={monthTransactions} />
            </div>
          ) : (
            <EmptyState
              icon={ChartPieSlice}
              title="Belum ada pengeluaran"
              description="Grafik kategori akan muncul setelah kamu mencatat transaksi."
              className="py-6"
            />
          )}
        </section>

        <div className="flex items-center gap-2 overflow-x-auto px-1 pb-1 no-scrollbar">
          {filters.map((item) => (
            <Chip
              key={item.value}
              active={filter === item.value}
              onClick={() => setFilter(item.value)}
            >
              {item.label}
            </Chip>
          ))}
        </div>

        {groups.length === 0 ? (
          <div className="rounded-[30px] bg-surface">
            <EmptyState
              icon={Receipt}
              title="Belum ada transaksi"
              description="Mulai catat pengeluaran atau pemasukan pertamamu bulan ini."
              action={
                <Button size="sm" onClick={() => setFormOpen(true)}>
                  Catat transaksi
                </Button>
              }
            />
          </div>
        ) : (
          <div className="space-y-4">
            {groups.map(([date, items]) => (
              <section key={date}>
                <div className="mb-2 flex items-center justify-between gap-3 px-1">
                  <h2 className="text-[10px] font-bold uppercase tracking-[0.14em] text-ink">
                    {relativeDayLabel(date)}
                  </h2>
                  <span className="text-[9.5px] font-medium text-muted">
                    {items.length} transaksi
                  </span>
                </div>
                <div className="overflow-hidden rounded-[24px] bg-surface">
                  {items.map((transaction, index) => {
                    const category = getCategory(transaction.categoryId)
                    return (
                      <button
                        key={transaction.id}
                        type="button"
                        onClick={() => setSelected(transaction)}
                        className={cn(
                          'flex min-h-[64px] w-full items-center gap-3 px-3.5 py-3 text-left transition-colors active:bg-surface-2',
                          index > 0 && 'border-t border-line/60',
                        )}
                      >
                        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-surface-2">
                          <CategoryIcon
                            category={category}
                            size={19}
                            className="text-ink"
                          />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[12.5px] font-semibold text-ink">
                            {category.label}
                          </p>
                          <p className="mt-0.5 truncate text-[10.5px] font-medium text-muted">
                            {transaction.note ?? 'Tanpa catatan'}
                          </p>
                        </div>
                        <p
                          className={cn(
                            'shrink-0 text-[12.5px] font-bold',
                            transaction.type === 'income' ? 'text-brand-strong' : 'text-ink',
                          )}
                        >
                          {transaction.type === 'income' ? '+' : '−'}
                          {formatIDR(transaction.amount)}
                        </p>
                      </button>
                    )
                  })}
                </div>
              </section>
            ))}
          </div>
        )}

        <p className="px-2 pb-2 pt-1 text-center text-[9.5px] font-medium text-muted">
          Ketuk transaksi untuk melihat detail
        </p>
      </div>

      <TransactionSheet
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSaved={(date) => setViewDate(parseKey(date))}
      />

      <Sheet
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        title="Detail transaksi"
        description={selected ? relativeDayLabel(selected.date) : undefined}
        footer={
          <Button variant="danger" fullWidth size="lg" onClick={handleDelete}>
            <Trash size={17} weight="bold" aria-hidden="true" />
            Hapus transaksi
          </Button>
        }
      >
        {selected && selectedCategory && (
          <div className="pb-2">
            <div className="flex flex-col items-center rounded-[28px] bg-surface-2 px-4 py-7">
              <span className="flex size-14 items-center justify-center rounded-full bg-surface">
                <CategoryIcon category={selectedCategory} size={26} className="text-ink" />
              </span>
              <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.14em] text-muted">
                {selectedCategory.label}
              </p>
              <p
                className={cn(
                  'mt-1.5 text-[30px] font-bold leading-none tracking-[-0.045em]',
                  selected.type === 'income' ? 'text-brand-strong' : 'text-ink',
                )}
              >
                {selected.type === 'income' ? '+' : '−'}
                {formatIDR(selected.amount)}
              </p>
            </div>
            <dl className="mt-5 space-y-3.5">
              <div className="flex items-center justify-between gap-3 border-b border-line/70 pb-3.5">
                <dt className="text-[11px] font-medium text-muted">Jenis</dt>
                <dd className="text-[12px] font-semibold text-ink">
                  {selected.type === 'income' ? 'Pemasukan' : 'Pengeluaran'}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-3 border-b border-line/70 pb-3.5">
                <dt className="text-[11px] font-medium text-muted">Tanggal</dt>
                <dd className="text-[12px] font-semibold text-ink">
                  {formatDateNumeric(selected.date)}
                </dd>
              </div>
              <div className="flex items-start justify-between gap-3">
                <dt className="text-[11px] font-medium text-muted">Catatan</dt>
                <dd className="max-w-[220px] text-right text-[12px] font-semibold leading-relaxed text-ink">
                  {selected.note ?? '—'}
                </dd>
              </div>
            </dl>
          </div>
        )}
      </Sheet>
    </div>
  )
}
