import { useEffect, useState } from 'react'
import { useApp } from '../../store/AppContext'
import { useToast } from '../ui/ToastProvider'
import { Sheet } from '../ui/Sheet'
import { Button } from '../ui/Button'
import { Field, inputClass } from '../ui/Field'
import { Segmented } from '../ui/Segmented'
import { todayKey } from '../../lib/utils'
import type { EventType } from '../../types'

export function EventSheet({
  open,
  onClose,
  defaultDate,
}: {
  open: boolean
  onClose: () => void
  defaultDate?: string
}) {
  const { addEvent } = useApp()
  const { toast } = useToast()
  const [title, setTitle] = useState('')
  const [date, setDate] = useState(defaultDate ?? todayKey())
  const [type, setType] = useState<EventType>('event')
  const [startTime, setStartTime] = useState('09:00')
  const [endTime, setEndTime] = useState('10:00')
  const [note, setNote] = useState('')

  useEffect(() => {
    if (!open) return
    setTitle('')
    setDate(defaultDate ?? todayKey())
    setType('event')
    setStartTime('09:00')
    setEndTime('10:00')
    setNote('')
  }, [open, defaultDate])

  const save = () => {
    if (!title.trim()) return
    addEvent({
      title: title.trim(),
      date,
      type,
      startTime: type === 'event' ? startTime || undefined : undefined,
      endTime: type === 'event' ? endTime || undefined : undefined,
      note: note.trim() || undefined,
    })
    toast(type === 'event' ? 'Agenda ditambahkan' : 'Target ditambahkan', 'success')
    onClose()
  }

  return (
    <Sheet
      open={open}
      onClose={onClose}
      title={type === 'event' ? 'Agenda baru' : 'Target baru'}
      description="Simpan jadwal atau target yang ingin kamu capai."
      footer={
        <Button fullWidth size="lg" onClick={save} disabled={!title.trim()}>
          {type === 'event' ? 'Simpan agenda' : 'Simpan target'}
        </Button>
      }
    >
      <div className="space-y-5 pb-1">
        <Segmented
          label="Jenis agenda"
          value={type}
          onChange={setType}
          options={[
            { value: 'event', label: 'Agenda' },
            { value: 'goal', label: 'Target' },
          ]}
        />

        <Field label="Judul" htmlFor="event-title">
          <input
            id="event-title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder={type === 'event' ? 'Misal: kuliah struktur data' : 'Misal: target tabungan'}
            maxLength={90}
            className={inputClass}
          />
        </Field>

        <Field label="Tanggal" htmlFor="event-date">
          <input
            id="event-date"
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            className={inputClass}
          />
        </Field>

        {type === 'event' && (
          <div className="grid grid-cols-2 gap-3">
            <Field label="Mulai" htmlFor="event-start">
              <input
                id="event-start"
                type="time"
                value={startTime}
                onChange={(event) => setStartTime(event.target.value)}
                className={inputClass}
              />
            </Field>
            <Field label="Selesai" htmlFor="event-end">
              <input
                id="event-end"
                type="time"
                value={endTime}
                onChange={(event) => setEndTime(event.target.value)}
                className={inputClass}
              />
            </Field>
          </div>
        )}

        <Field label="Catatan" hint="Opsional" htmlFor="event-note">
          <textarea
            id="event-note"
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder={
              type === 'event' ? 'Tambahkan lokasi atau detail penting' : 'Tulis target yang ingin dicapai'
            }
            rows={3}
            maxLength={180}
            className={`${inputClass} resize-none`}
          />
        </Field>
      </div>
    </Sheet>
  )
}
