import { useEffect, useState } from 'react'
import { Check } from '@phosphor-icons/react'
import { useApp } from '../../store/AppContext'
import { useToast } from '../ui/ToastProvider'
import { Sheet } from '../ui/Sheet'
import { Button } from '../ui/Button'
import { Field, inputClass } from '../ui/Field'
import { HabitGlyph, habitColors, habitIcons } from '../../lib/icons'
import { cn } from '../../lib/utils'
import type { HabitColorKey, HabitIconKey } from '../../types'

const iconKeys = Object.keys(habitIcons) as HabitIconKey[]
const colorKeys = Object.keys(habitColors) as HabitColorKey[]

export function HabitSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { addHabit } = useApp()
  const { toast } = useToast()
  const [name, setName] = useState('')
  const [icon, setIcon] = useState<HabitIconKey>('water')
  const [color, setColor] = useState<HabitColorKey>('teal')

  useEffect(() => {
    if (!open) return
    setName('')
    setIcon('water')
    setColor('teal')
  }, [open])

  const hex = habitColors[color].hex

  const save = () => {
    if (!name.trim()) return
    addHabit({ name: name.trim(), icon, color })
    toast('Kebiasaan baru dibuat', 'success')
    onClose()
  }

  return (
    <Sheet
      open={open}
      onClose={onClose}
      title="Kebiasaan baru"
      description="Pilih satu rutinitas kecil yang ingin kamu jaga setiap hari."
      footer={
        <Button fullWidth size="lg" onClick={save} disabled={!name.trim()}>
          Simpan kebiasaan
        </Button>
      }
    >
      <div className="space-y-5 pb-1">
        <div className="flex items-center gap-3 rounded-[24px] bg-surface-2 p-4">
          <span className="relative flex size-12 shrink-0 items-center justify-center rounded-full bg-surface text-ink">
            <HabitGlyph icon={icon} size={23} />
            <span
              className="absolute bottom-0 right-0 size-3 rounded-full ring-2 ring-surface-2"
              style={{ backgroundColor: hex }}
              aria-hidden="true"
            />
          </span>
          <div className="min-w-0">
            <p className="truncate text-[13px] font-semibold text-ink">
              {name.trim() || 'Kebiasaan baru'}
            </p>
            <p className="text-[10px] font-medium text-muted">Pratinjau kebiasaanmu</p>
          </div>
        </div>

        <Field label="Nama kebiasaan" htmlFor="habit-name">
          <input
            id="habit-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Misal: minum 8 gelas air"
            maxLength={60}
            className={inputClass}
          />
        </Field>

        <Field label="Ikon">
          <div className="grid grid-cols-4 gap-2">
            {iconKeys.map((key) => {
              const selected = key === icon
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setIcon(key)}
                  aria-pressed={selected}
                  aria-label={`Ikon ${key}`}
                  className={cn(
                    'relative flex min-h-[62px] items-center justify-center rounded-[20px] border transition-all active:scale-95',
                    selected
                      ? 'border-ink bg-surface'
                      : 'border-line bg-surface hover:border-ink/25',
                  )}
                >
                  <HabitGlyph icon={key} size={22} className="text-ink" />
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

        <Field label="Warna">
          <div className="flex flex-wrap gap-3">
            {colorKeys.map((key) => {
              const selected = key === color
              const colorHex = habitColors[key].hex
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setColor(key)}
                  aria-pressed={selected}
                  aria-label={`Warna ${habitColors[key].label}`}
                  className="flex size-11 items-center justify-center rounded-full transition-transform active:scale-90"
                >
                  <span
                    className={cn(
                      'flex size-8 items-center justify-center rounded-full ring-offset-2 ring-offset-surface transition-all',
                      selected && 'ring-2',
                    )}
                    style={{
                      backgroundColor: colorHex,
                      ...(selected
                        ? {
                            boxShadow: `0 0 0 2px var(--surface), 0 0 0 4px ${colorHex}`,
                          }
                        : {}),
                    }}
                  >
                    {selected && (
                      <Check
                        size={15}
                        weight="bold"
                        style={{ color: habitColors[key].onColor }}
                        aria-hidden="true"
                      />
                    )}
                  </span>
                </button>
              )
            })}
          </div>
        </Field>
      </div>
    </Sheet>
  )
}
