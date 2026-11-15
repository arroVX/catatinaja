import { useEffect, useState } from 'react'
import { useApp } from '../../store/AppContext'
import { useToast } from '../ui/ToastProvider'
import { Sheet } from '../ui/Sheet'
import { Button } from '../ui/Button'
import { Field, inputClass } from '../ui/Field'
import { Segmented } from '../ui/Segmented'
import { Chip } from '../ui/Chip'
import { TASK_TAGS } from '../../lib/categories'
import { todayKey } from '../../lib/utils'
import type { Priority } from '../../types'

export function TaskSheet({
  open,
  onClose,
  defaultDate,
}: {
  open: boolean
  onClose: () => void
  defaultDate?: string
}) {
  const { addTask } = useApp()
  const { toast } = useToast()
  const [title, setTitle] = useState('')
  const [dueDate, setDueDate] = useState(defaultDate ?? todayKey())
  const [priority, setPriority] = useState<Priority>('medium')
  const [tag, setTag] = useState<string | undefined>(undefined)

  useEffect(() => {
    if (!open) return
    setTitle('')
    setDueDate(defaultDate ?? todayKey())
    setPriority('medium')
    setTag(undefined)
  }, [open, defaultDate])

  const save = () => {
    if (!title.trim()) return
    addTask({
      title: title.trim(),
      dueDate,
      priority,
      tag,
    })
    toast('Tugas ditambahkan', 'success')
    onClose()
  }

  return (
    <Sheet
      open={open}
      onClose={onClose}
      title="Tugas baru"
      description="Tulis satu langkah kecil yang bisa kamu selesaikan."
      footer={
        <Button fullWidth size="lg" onClick={save} disabled={!title.trim()}>
          Simpan tugas
        </Button>
      }
    >
      <div className="space-y-5 pb-1">
        <Field label="Judul tugas" htmlFor="task-title">
          <input
            id="task-title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Misal: review materi kalkulus"
            maxLength={90}
            className={inputClass}
          />
        </Field>

        <Field label="Tenggat" htmlFor="task-date">
          <input
            id="task-date"
            type="date"
            value={dueDate}
            onChange={(event) => setDueDate(event.target.value)}
            className={inputClass}
          />
        </Field>

        <Field label="Prioritas">
          <Segmented
            label="Prioritas tugas"
            value={priority}
            onChange={setPriority}
            options={[
              { value: 'low', label: 'Rendah' },
              { value: 'medium', label: 'Sedang' },
              { value: 'high', label: 'Tinggi' },
            ]}
          />
        </Field>

        <Field label="Tag" hint="Opsional">
          <div className="flex flex-wrap gap-2">
            {TASK_TAGS.map((item) => (
              <Chip
                key={item}
                active={tag === item}
                onClick={() => setTag((current) => (current === item ? undefined : item))}
              >
                {item}
              </Chip>
            ))}
          </div>
        </Field>
      </div>
    </Sheet>
  )
}
