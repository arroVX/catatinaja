import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  CalendarBlank,
  CaretLeft,
  CaretRight,
  Plus,
  Target,
  Trash,
} from '@phosphor-icons/react'
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  getDaysInMonth,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
} from 'date-fns'
import { useApp } from '../store/AppContext'
import { PageHeader } from '../components/layout/PageHeader'
import { Button } from '../components/ui/Button'
import { EmptyState } from '../components/ui/EmptyState'
import { useToast } from '../components/ui/ToastProvider'
import { EventSheet } from '../components/forms/EventSheet'
import {
  cn,
  dateKey,
  formatDateFull,
  formatMonthYear,
  parseKey,
  todayKey,
} from '../lib/utils'

const weekdays = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min']

export function CalendarPage() {
  const { events, deleteEvent } = useApp()
  const { toast } = useToast()
  const [searchParams, setSearchParams] = useSearchParams()
  const [formOpen, setFormOpen] = useState(searchParams.get('new') === '1')
  const [viewDate, setViewDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(todayKey())

  useEffect(() => {
    if (searchParams.get('new') === '1') {
      setFormOpen(true)
      const next = new URLSearchParams(searchParams)
      next.delete('new')
      setSearchParams(next, { replace: true })
    }
  }, [searchParams, setSearchParams])

  const today = new Date()
  const calendarDays = useMemo(() => {
    const start = startOfWeek(startOfMonth(viewDate), { weekStartsOn: 1 })
    const end = endOfWeek(endOfMonth(viewDate), { weekStartsOn: 1 })
    return eachDayOfInterval({ start, end })
  }, [viewDate])

  const eventsByDate = useMemo(() => {
    const map = new Map<string, typeof events>()
    events.forEach((event) => {
      const items = map.get(event.date) ?? []
      items.push(event)
      map.set(event.date, items)
    })
    return map
  }, [events])

  const selectedEvents = useMemo(() => {
    const items = [...(eventsByDate.get(selectedDate) ?? [])]
    return items.sort((a, b) =>
      (a.startTime ?? '99:99').localeCompare(b.startTime ?? '99:99'),
    )
  }, [eventsByDate, selectedDate])

  const goalCount = selectedEvents.filter((event) => event.type === 'goal').length

  const shiftMonth = (delta: number) => {
    const next = addMonths(viewDate, delta)
    const selectedDay = parseKey(selectedDate).getDate()
    const safeDay = Math.min(selectedDay, getDaysInMonth(next))
    setViewDate(next)
    setSelectedDate(dateKey(new Date(next.getFullYear(), next.getMonth(), safeDay)))
  }

  const selectDay = (day: Date) => {
    setSelectedDate(dateKey(day))
    if (!isSameMonth(day, viewDate)) setViewDate(day)
  }

  const jumpToToday = () => {
    setViewDate(new Date())
    setSelectedDate(todayKey())
  }

  const removeEvent = (id: string, title: string) => {
    deleteEvent(id)
    toast(`"${title}" dihapus`, 'default')
  }

  return (
    <div>
      <PageHeader
        title="Kalender"
        subtitle="Atur jadwal dan target dalam satu tampilan."
        right={
          <Button
            variant="soft"
            size="icon"
            onClick={() => setFormOpen(true)}
            aria-label="Tambah agenda baru"
          >
            <Plus size={19} weight="bold" aria-hidden="true" />
          </Button>
        }
      />

      <div className="space-y-4 px-4">
        <div className="flex items-center justify-between px-1">
          <button
            type="button"
            onClick={() => shiftMonth(-1)}
            aria-label="Bulan sebelumnya"
            className="flex size-11 items-center justify-center rounded-full border border-line text-ink transition-colors hover:bg-surface-2 active:scale-95"
          >
            <CaretLeft size={17} weight="bold" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={jumpToToday}
            className="flex min-h-11 flex-col items-center justify-center rounded-full px-4 transition-colors hover:bg-surface-2"
            aria-label="Kembali ke hari ini"
          >
            <span className="type-title text-[15px] text-ink">{formatMonthYear(viewDate)}</span>
            <span className="mt-0.5 text-[9px] font-bold uppercase tracking-[0.12em] text-muted">
              {isSameMonth(viewDate, today) ? 'Bulan ini · ketuk hari ini' : 'Ketuk untuk hari ini'}
            </span>
          </button>
          <button
            type="button"
            onClick={() => shiftMonth(1)}
            aria-label="Bulan berikutnya"
            className="flex size-11 items-center justify-center rounded-full border border-line text-ink transition-colors hover:bg-surface-2 active:scale-95"
          >
            <CaretRight size={17} weight="bold" aria-hidden="true" />
          </button>
        </div>

        <section className="rounded-[30px] bg-surface p-3">
          <div className="grid grid-cols-7 pb-1">
            {weekdays.map((day) => (
              <div
                key={day}
                className="py-1.5 text-center text-[8.5px] font-bold uppercase tracking-[0.1em] text-muted"
              >
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-y-0.5">
            {calendarDays.map((day) => {
              const key = dateKey(day)
              const inMonth = isSameMonth(day, viewDate)
              const selected = key === selectedDate
              const dayIsToday = isToday(day)
              const dayEvents = eventsByDate.get(key) ?? []
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => selectDay(day)}
                  aria-pressed={selected}
                  aria-label={`${formatDateFull(day)}, ${dayEvents.length} agenda`}
                  className={cn(
                    'relative flex h-[48px] flex-col items-center justify-center rounded-full transition-colors',
                    selected ? 'bg-ink' : 'hover:bg-surface-2',
                    !inMonth && !selected && 'opacity-35',
                  )}
                >
                  <span
                    className={cn(
                      'flex size-8 items-center justify-center rounded-full text-[12.5px] font-semibold',
                      selected
                        ? 'text-canvas'
                        : dayIsToday
                          ? 'text-ink ring-1 ring-ink/50'
                          : 'text-ink',
                    )}
                  >
                    {format(day, 'd')}
                  </span>
                  <span className="absolute bottom-[3px] flex items-center gap-0.5" aria-hidden="true">
                    {dayEvents.slice(0, 3).map((event) => (
                      <span
                        key={event.id}
                        className={cn(
                          'size-1 rounded-full',
                          selected
                            ? 'bg-canvas'
                            : event.type === 'goal'
                              ? 'bg-accent'
                              : 'bg-brand-strong',
                        )}
                      />
                    ))}
                  </span>
                </button>
              )
            })}
          </div>
          <div className="mt-2 flex items-center justify-center gap-4 border-t border-line/60 pt-2.5">
            <span className="flex items-center gap-1.5 text-[8.5px] font-medium text-muted">
              <span className="size-1.5 rounded-full bg-brand-strong" aria-hidden="true" /> Agenda
            </span>
            <span className="flex items-center gap-1.5 text-[8.5px] font-medium text-muted">
              <span className="size-1.5 rounded-full bg-accent" aria-hidden="true" /> Target
            </span>
            <span className="flex items-center gap-1.5 text-[8.5px] font-medium text-muted">
              <span className="size-2.5 rounded-full ring-1 ring-ink/50" aria-hidden="true" /> Hari ini
            </span>
          </div>
        </section>

        <section className="rounded-[30px] bg-hero p-5 text-hero-ink">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-hero-muted">
                {formatDateFull(selectedDate)}
              </p>
              <p className="mt-2 text-[27px] font-bold leading-none tracking-[-0.045em]">
                {selectedEvents.length} agenda
              </p>
              <p className="mt-1.5 text-[10.5px] font-medium text-hero-muted">
                {goalCount > 0 ? `${goalCount} target · ` : ''}
                {selectedEvents.length > 0 ? 'Siap dijalani' : 'Masih longgar'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setFormOpen(true)}
              aria-label="Tambah agenda pada tanggal ini"
              className="flex size-11 shrink-0 items-center justify-center rounded-full bg-hero-soft text-hero-ink transition-colors hover:bg-hero-line"
            >
              <Plus size={18} weight="bold" aria-hidden="true" />
            </button>
          </div>
        </section>

        <section>
          {selectedEvents.length === 0 ? (
            <div className="rounded-[30px] bg-surface">
              <EmptyState
                icon={CalendarBlank}
                title="Hari ini masih longgar"
                description="Tambahkan agenda atau target untuk tanggal ini."
                action={
                  <Button size="sm" onClick={() => setFormOpen(true)}>
                    Tambah agenda
                  </Button>
                }
              />
            </div>
          ) : (
            <div className="space-y-2">
              {selectedEvents.map((event) => {
                const isGoal = event.type === 'goal'
                return (
                  <article
                    key={event.id}
                    className="flex gap-3.5 rounded-[24px] bg-surface p-4"
                  >
                    <div className="flex w-11 shrink-0 flex-col items-center pt-0.5">
                      {isGoal ? (
                        <>
                          <span className="flex size-9 items-center justify-center rounded-full bg-surface-2 text-ink">
                            <Target size={16} weight="bold" aria-hidden="true" />
                          </span>
                          <span className="mt-1.5 text-[8px] font-bold uppercase tracking-[0.1em] text-muted">
                            Target
                          </span>
                        </>
                      ) : event.startTime ? (
                        <>
                          <span className="text-[13px] font-bold leading-none text-ink">
                            {event.startTime}
                          </span>
                          <span className="mt-1 text-[8px] font-medium text-muted">
                            {event.endTime ? `s/d ${event.endTime}` : 'Mulai'}
                          </span>
                        </>
                      ) : (
                        <>
                          <span className="flex size-9 items-center justify-center rounded-full bg-surface-2 text-ink">
                            <CalendarBlank size={15} weight="bold" aria-hidden="true" />
                          </span>
                          <span className="mt-1.5 text-[8px] font-bold uppercase tracking-[0.1em] text-muted">
                            Hari
                          </span>
                        </>
                      )}
                    </div>
                    <div className="min-w-0 flex-1 border-l border-line/70 pl-3.5">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-[13px] font-semibold leading-snug text-ink">
                          {event.title}
                        </p>
                        <button
                          type="button"
                          onClick={() => removeEvent(event.id, event.title)}
                          aria-label={`Hapus ${event.title}`}
                          className="-mr-2 -mt-1 flex size-10 shrink-0 items-center justify-center rounded-full text-muted transition-colors hover:bg-danger-soft hover:text-danger"
                        >
                          <Trash size={15} aria-hidden="true" />
                        </button>
                      </div>
                      {event.note && (
                        <p className="mt-1.5 line-clamp-2 text-[11px] leading-relaxed text-muted">
                          {event.note}
                        </p>
                      )}
                    </div>
                  </article>
                )
              })}
            </div>
          )}
        </section>

        <p className="px-2 pb-2 pt-1 text-center text-[9.5px] font-medium text-muted">
          Titik pada tanggal menandai agenda dan target
        </p>
      </div>

      <EventSheet
        open={formOpen}
        onClose={() => setFormOpen(false)}
        defaultDate={selectedDate}
      />
    </div>
  )
}
