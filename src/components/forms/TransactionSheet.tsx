import { useEffect, useState } from 'react'
import { Check } from '@phosphor-icons/react'
import { useApp } from '../../store/AppContext'
import { useToast } from '../ui/ToastProvider'
import { Sheet } from '../ui/Sheet'
import { Button } from '../ui/Button'
import { Field, inputClass } from '../ui/Field'
import { Segmented } from '../ui/Segmented'
import { CategoryIcon } from '../../lib/icons'
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../../lib/categories'
import {
  cn,
  formatAmountInput,
  parseAmountInput,
  todayKey,
} from '../../lib/utils'
import type { TransactionType } from '../../types'

const QUICK_AMOUNTS = [10_000, 25_000, 50_000, 100_000]

export function TransactionSheet({
  open,
  onClose,
  onSaved,
}: {
  open: boolean
  onClose: () => void
  onSaved?: (date: string) => void
}) {
  const { addTransaction } = useApp()
  const { toast } = useToast()
  const [type, setType] = useState<TransactionType>('expense')
  const [amount, setAmount] = useState('')
  const [categoryId, setCategoryId] = useState('food')
  const [date, setDate] = useState(todayKey())
  const [note, setNote] = useState('')

  useEffect(() => {
    if (!open) return
    setType('expense')
    setAmount('')
    setCategoryId('food')
    setDate(todayKey())
    setNote('')
  }, [open])

  const categories = type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES
  const amountValue = parseAmountInput(amount)

  const changeType = (next: TransactionType) => {
    setType(next)
    setCategoryId(next === 'expense' ? 'food' : 'salary')
  }

  const save = () => {
    if (amountValue <= 0) return
    addTransaction({
      type,
      amount: amountValue,
      categoryId,
      date,
      note: note.trim() || undefined,
    })
    toast(
      type === 'expense' ? 'Pengeluaran tersimpan' : 'Pemasukan tersimpan',
      'success',
    )
    onSaved?.(date)
    onClose()
  }

  return (
    <Sheet
      open={open}
      onClose={onClose}
      title="Catat transaksi"
      description="Catat pemasukan atau pengeluaranmu."
      footer={
        <Button
          fullWidth
          size="lg"
          onClick={save}
          disabled={amountValue <= 0}
        >
          Simpan transaksi
        </Button>
      }
    >
      <div className="space-y-4 pb-1">
        <Segmented
          label="Jenis transaksi"
          value={type}
          onChange={changeType}
          options={[
            { value: 'expense', label: 'Pengeluaran' },
            { value: 'income', label: 'Pemasukan' },
          ]}
        />

        <div className="rounded-[24px] bg-surface-2 px-5 pb-4 pt-4">
          <label
            htmlFor="transaction-amount"
            className="text-[9px] font-bold uppercase tracking-[0.16em] text-muted"
          >
            Nominal
          </label>
          <div className="flex items-center gap-2">
            <span className="text-[19px] font-bold text-muted">Rp</span>
            <input
              id="transaction-amount"
              value={amount}
              onChange={(event) => setAmount(formatAmountInput(event.target.value))}
              inputMode="numeric"
              autoComplete="off"
              placeholder="0"
              className="min-w-0 flex-1 bg-transparent py-1 text-[34px] font-bold leading-tight tracking-[-0.045em] text-ink outline-none placeholder:text-muted/30"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {QUICK_AMOUNTS.map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setAmount(formatAmountInput(String(value)))}
              className="min-h-10 rounded-full border border-line bg-surface px-3.5 text-[10.5px] font-semibold text-muted transition-colors hover:border-ink/30 hover:text-ink active:scale-95"
            >
              +{value / 1000}rb
            </button>
          ))}
        </div>

        <Field label="Kategori" hint="Pilih satu">
          <div className="grid grid-cols-4 gap-2">
            {categories.map((category) => {
              const selected = category.id === categoryId
              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setCategoryId(category.id)}
                  aria-pressed={selected}
                  className={cn(
                    'relative flex min-h-[74px] flex-col items-center justify-center gap-1.5 rounded-[20px] border p-1.5 transition-all duration-150 active:scale-95',
                    selected
                      ? 'border-ink bg-surface'
                      : 'border-line bg-surface hover:border-ink/25',
                  )}
                >
                  <span className="flex size-9 items-center justify-center rounded-full bg-surface-2 text-ink">
                    <CategoryIcon category={category} size={18} />
                  </span>
                  <span className="text-center text-[9px] font-semibold leading-[1.15] text-ink">
                    {category.label}
                  </span>
                  {selected && (
                    <span className="absolute right-1.5 top-1.5 flex size-4 items-center justify-center rounded-full bg-ink text-canvas">
                      <Check size={9} weight="bold" aria-hidden="true" />
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </Field>

        <Field label="Tanggal" htmlFor="transaction-date">
          <input
            id="transaction-date"
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            className={inputClass}
          />
        </Field>

        <Field label="Catatan" hint="Opsional" htmlFor="transaction-note">
          <input
            id="transaction-note"
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder="Misal: makan siang di kantin"
            maxLength={80}
            className={inputClass}
          />
        </Field>
      </div>
    </Sheet>
  )
}
