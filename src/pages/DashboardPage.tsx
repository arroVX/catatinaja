import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowDownLeft,
  ArrowUpRight,
  CalendarBlank,
  CalendarPlus,
  Check,
  Eye,
  EyeSlash,
  Flame,
  ListChecks,
  MoonStars,
  Plus,
  SquaresFour,
  Sun,
  Target,
  TrendDown,
  TrendUp,
  Wallet,
} from '@phosphor-icons/react'
import { useApp } from '../store/AppContext'
import { useToast } from '../components/ui/ToastProvider'
import {
  cn,
  formatDateFull,
  formatIDR,
  formatMonthShort,
  formatMonthYear,
  greeting,
  percent,
  relativeDayLabel,
  todayKey,
} from '../lib/utils'
import { HabitGlyph } from '../lib/icons'
import { TaskItem } from '../components/tasks/TaskItem'
import { ProgressBar } from '../components/ui/ProgressBar'
import { EmptyState } from '../components/ui/EmptyState'
import { Sheet } from '../components/ui/Sheet'
import { WeeklySpendBars } from '../components/charts/WeeklySpendBars'
import { Avatar } from '../components/ui/Avatar'
import { Sparkle } from '@phosphor-icons/react'

const quickActions = [
  {
    to: '/keuangan?new=1',
    label: 'Catat uang',
    description: 'Pemasukan atau pengeluaran',
    icon: Wallet,
  },
  {
    to: '/tugas?new=1',
    label: 'Tambah tugas',
    description: 'Tambahkan ke daftar harianmu',
    icon: ListChecks,
  },
  {
    to: '/kalender?new=1',
    label: 'Buat agenda',
    description: 'Simpan jadwal atau target',
    icon: CalendarPlus,
  },
  {
    to: '/kebiasaan?new=1',
    label: 'Habit baru',
    description: 'Buat rutinitas baru',
    icon: Flame,
  },
]

const pillClass =
  'inline-flex min-h-10 shrink-0 items-center gap-1.5 rounded-full border border-line px-3.5 text-[11px] font-semibold text-ink transition-colors hover:bg-surface-2'

export function DashboardPage() {
  const {
    transactions,
    tasks,
    events,
    habits,
    habitLogs,
    profile,
    updateProfile,
    toggleTask,
    toggleHabit,
  } = useApp()
  const { toast } = useToast()
  const [balanceVisible, setBalanceVisible] = useState(true)
  const [quickAddOpen, setQuickAddOpen] = useState(false)
  const [systemDark, setSystemDark] = useState(
    () => window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false,
  )

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (event: MediaQueryListEvent) => setSystemDark(event.matches)
    media.addEventListener('change', handleChange)
    return () => media.removeEventListener('change', handleChange)
  }, [])

  const isDark = profile.theme === 'dark' || (profile.theme === 'system' && systemDark)
  const today = todayKey()
  const now = new Date()

  const stats = useMemo(() => {
    const monthPrefix = today.slice(0, 7)
    const currentMonth = transactions.filter((item) => item.date.startsWith(monthPrefix))
    const income = currentMonth
      .filter((item) => item.type === 'income')
      .reduce((sum, item) => sum + item.amount, 0)
    const expense = currentMonth
      .filter((item) => item.type === 'expense')
      .reduce((sum, item) => sum + item.amount, 0)

    const previous = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const previousPrefix = `${previous.getFullYear()}-${String(previous.getMonth() + 1).padStart(2, '0')}`
    const previousExpense = transactions
      .filter((item) => item.type === 'expense' && item.date.startsWith(previousPrefix))
      .reduce((sum, item) => sum + item.amount, 0)

    const todayExpense = transactions
      .filter((item) => item.type === 'expense' && item.date === today)
      .reduce((sum, item) => sum + item.amount, 0)

    const diff =
      previousExpense > 0
        ? Math.round(((expense - previousExpense) / previousExpense) * 100)
        : null

    return {
      income,
      expense,
      balance: income - expense,
      todayExpense,
      previousExpense,
      diff,
    }
  }, [transactions, today, now])

  const todayTasks = useMemo(
    () =>
      tasks
        .filter((task) => task.dueDate === today)
        .sort((a, b) => Number(a.completed) - Number(b.completed)),
    [tasks, today],
  )
  const completedToday = todayTasks.filter((task) => task.completed).length
  const pendingPreview = todayTasks.slice(0, 3)

  const doneHabits = habits.filter((habit) =>
    habitLogs.some(
      (log) => log.habitId === habit.id && log.date === today && log.done,
    ),
  ).length

  const upcomingEvents = useMemo(
    () =>
      events
        .filter((event) => event.date >= today)
        .sort((a, b) =>
          `${a.date}${a.startTime ?? '00:00'}`.localeCompare(
            `${b.date}${b.startTime ?? '00:00'}`,
          ),
        )
        .slice(0, 3),
    [events, today],
  )

  const firstName = profile.name.split(' ')[0]

  const comparisonLabel =
    stats.diff === null
      ? null
      : stats.diff < -3
        ? `${Math.abs(stats.diff)}% lebih hemat`
        : stats.diff > 3
          ? `${stats.diff}% lebih tinggi`
          : 'Sama seperti bulan lalu'

  const toggleTheme = () => {
    updateProfile({ theme: isDark ? 'light' : 'dark' })
  }

  const addHabitToday = (habitId: string, habitName: string, done: boolean) => {
    toggleHabit(habitId)
    toast(
      done ? `${habitName} dibatalkan` : `${habitName} selesai!`,
      done ? 'default' : 'success',
    )
  }

  return (
    <div>
      <header className="px-5 pb-1 pt-[calc(env(safe-area-inset-top)+1.1rem)]">
        <div className="flex items-center justify-between gap-3">
          <Link
            to="/pengaturan"
            aria-label="Buka pengaturan dan profil"
            className="rounded-full transition-transform active:scale-95"
          >
            <Avatar name={profile.name} />
          </Link>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={isDark ? 'Aktifkan tema terang' : 'Aktifkan tema gelap'}
              className="flex size-11 items-center justify-center rounded-full border border-line bg-surface text-ink transition-colors hover:bg-surface-2 active:scale-95"
            >
              {isDark ? (
                <Sun size={18} weight="bold" aria-hidden="true" />
              ) : (
                <MoonStars size={18} aria-hidden="true" />
              )}
            </button>
            <button
              type="button"
              onClick={() => setQuickAddOpen(true)}
              aria-label="Tambah catatan cepat"
              className="flex size-11 items-center justify-center rounded-full bg-surface-2 text-ink transition-colors hover:bg-line active:scale-95"
            >
              <SquaresFour size={19} weight="bold" aria-hidden="true" />
            </button>
          </div>
        </div>

        <p className="mt-7 text-[10px] font-bold uppercase tracking-[0.16em] text-muted">
          {formatDateFull(now)}
        </p>
        <h1 className="mt-2 text-[clamp(35px,10.5vw,44px)] leading-[1.02] tracking-[-0.045em]">
          <span className="block font-normal text-ink/55">{greeting()},</span>
          <span className="type-display block text-ink">{firstName}.</span>
        </h1>
        <p className="mt-3 text-[12px] leading-relaxed text-muted">
          Ini ringkasan harimu. Semua yang penting, satu tempat.
        </p>
      </header>

      <div className="-mx-0 mt-5 space-y-3">
        <div className="flex gap-2 overflow-x-auto px-5 pb-0.5 no-scrollbar">
          <Link to="/tugas" className={pillClass}>
            <Check size={13} weight="bold" aria-hidden="true" />
            {completedToday}/{todayTasks.length} tugas
          </Link>
          <Link to="/kalender" className={pillClass}>
            <CalendarBlank size={13} weight="bold" aria-hidden="true" />
            {upcomingEvents.length} agenda
          </Link>
        </div>

        <div className="flex gap-2 overflow-x-auto px-4 pb-1 no-scrollbar">
          <Link
            to="/keuangan?new=1"
            className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full bg-ink px-4 text-[12px] font-semibold text-canvas transition-transform active:scale-95"
          >
            <Plus size={14} weight="bold" aria-hidden="true" />
            Catat uang
          </Link>
          <Link to="/tugas?new=1" className={pillClass}>
            <Plus size={13} weight="bold" aria-hidden="true" />
            Tambah tugas
          </Link>
        </div>

        <div className="space-y-3 px-4">
          <section
            aria-label="Ringkasan saldo bulan ini"
            className="overflow-hidden rounded-[30px] bg-hero px-5 pb-5 pt-5 text-hero-ink"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-hero-muted">
                  Saldo bulan ini
                </p>
                <p className="mt-2 text-[31px] font-bold leading-none tracking-[-0.045em]">
                  {balanceVisible ? formatIDR(stats.balance) : 'Rp •••••••'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setBalanceVisible((value) => !value)}
                aria-label={balanceVisible ? 'Sembunyikan saldo' : 'Tampilkan saldo'}
                className="-mr-1 -mt-1 flex size-10 shrink-0 items-center justify-center rounded-full bg-hero-soft text-hero-muted transition-colors hover:text-hero-ink"
              >
                {balanceVisible ? (
                  <Eye size={17} aria-hidden="true" />
                ) : (
                  <EyeSlash size={17} aria-hidden="true" />
                )}
              </button>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-1.5">
              <span className="rounded-full border border-hero-line px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-hero-muted">
                {formatMonthYear(now)}
              </span>
              {comparisonLabel && (
                <span className="flex items-center gap-1 rounded-full bg-hero-soft px-2.5 py-1 text-[9px] font-semibold text-hero-ink">
                  {stats.diff !== null && stats.diff < -3 ? (
                    <TrendDown size={11} weight="bold" aria-hidden="true" />
                  ) : (
                    <TrendUp size={11} weight="bold" aria-hidden="true" />
                  )}
                  {comparisonLabel}
                </span>
              )}
            </div>

            <div className="mt-5 flex items-end justify-between gap-4 border-t border-hero-line pt-4">
              <div className="flex min-w-0 gap-7">
                <div className="min-w-0">
                  <p className="flex items-center gap-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-hero-muted">
                    <ArrowDownLeft size={11} weight="bold" aria-hidden="true" />
                    Masuk
                  </p>
                  <p className="mt-1 truncate text-[14px] font-semibold">
                    {balanceVisible ? formatIDR(stats.income) : 'Rp •••'}
                  </p>
                </div>
                <div className="min-w-0">
                  <p className="flex items-center gap-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-hero-muted">
                    <ArrowUpRight size={11} weight="bold" aria-hidden="true" />
                    Keluar
                  </p>
                  <p className="mt-1 truncate text-[14px] font-semibold">
                    {balanceVisible ? formatIDR(stats.expense) : 'Rp •••'}
                  </p>
                </div>
              </div>
              <Link
                to="/keuangan"
                aria-label="Buka halaman keuangan"
                className="flex size-10 shrink-0 items-center justify-center rounded-full bg-hero-soft text-hero-ink transition-colors hover:bg-hero-line"
              >
                <ArrowUpRight size={16} weight="bold" aria-hidden="true" />
              </Link>
            </div>
          </section>

          <section className="rounded-[30px] bg-surface p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="type-eyebrow">Pengeluaran</p>
                <p className="mt-2 text-[29px] font-bold leading-none tracking-[-0.045em] text-ink">
                  {formatIDR(stats.todayExpense)}
                </p>
                <p className="mt-1.5 text-[10.5px] font-medium text-muted">Hari ini</p>
              </div>
              <Link
                to="/keuangan"
                aria-label="Lihat detail pengeluaran"
                className="flex size-10 shrink-0 items-center justify-center rounded-full bg-surface-2 text-ink transition-colors hover:bg-line"
              >
                <ArrowUpRight size={16} weight="bold" aria-hidden="true" />
              </Link>
            </div>
            <div className="mt-5">
              <WeeklySpendBars transactions={transactions} />
            </div>
          </section>

          <section className="rounded-[30px] bg-surface-2 p-2">
            <div className="px-3 pb-3 pt-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="type-title text-[18px] text-ink">Tugas hari ini</h2>
                  <p className="mt-1 text-[10.5px] font-medium text-muted">
                    {completedToday} dari {todayTasks.length} selesai ·{' '}
                    {percent(completedToday, todayTasks.length)}%
                  </p>
                </div>
                <Link to="/tugas" className={pillClass}>
                  Semua
                </Link>
              </div>
              <ProgressBar
                value={completedToday}
                max={todayTasks.length}
                label="Progres tugas hari ini"
                className="mt-3 h-[2px] bg-ink/10"
                barClassName="bg-ink"
              />
            </div>

            <div className="rounded-[24px] bg-surface px-3">
              {pendingPreview.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggle={() => toggleTask(task.id)}
                  hideDueLabel
                />
              ))}
              {todayTasks.length === 0 && (
                <Link
                  to="/tugas?new=1"
                  className="flex min-h-[72px] items-center gap-3 px-1 text-left"
                >
                  <span className="flex size-9 items-center justify-center rounded-full border border-line text-muted">
                    <Plus size={15} weight="bold" aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[12.5px] font-semibold text-ink">
                      Belum ada tugas hari ini
                    </span>
                    <span className="mt-0.5 block text-[10.5px] font-medium text-muted">
                      Tambahkan satu langkah kecil.
                    </span>
                  </span>
                </Link>
              )}
            </div>

            {todayTasks.length > 3 && (
              <Link
                to="/tugas"
                className="flex min-h-11 items-center justify-center gap-1 rounded-b-[22px] text-[11px] font-semibold text-ink/70"
              >
                Lihat {todayTasks.length - 3} tugas lainnya
                <ArrowUpRight size={12} weight="bold" aria-hidden="true" />
              </Link>
            )}
          </section>

          <section className="rounded-[30px] bg-surface p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="type-title text-[18px] text-ink">Kebiasaan</h2>
                <p className="mt-1 text-[10.5px] font-medium text-muted">
                  {doneHabits} dari {habits.length} selesai hari ini
                </p>
              </div>
              <Link to="/kebiasaan" className={pillClass}>
                Kelola
              </Link>
            </div>

            {habits.length > 0 ? (
              <div className="mt-5 flex gap-2 overflow-x-auto pb-0.5 no-scrollbar">
                {habits.map((habit) => {
                  const done = habitLogs.some(
                    (log) => log.habitId === habit.id && log.date === today && log.done,
                  )
                  return (
                    <button
                      key={habit.id}
                      type="button"
                      aria-pressed={done}
                      aria-label={`${habit.name}: ${done ? 'selesai' : 'belum selesai'} hari ini`}
                      onClick={() => addHabitToday(habit.id, habit.name, done)}
                      className="flex w-[62px] shrink-0 flex-col items-center gap-2 transition-transform active:scale-95"
                    >
                      <span
                        className={cn(
                          'relative flex size-12 items-center justify-center rounded-full border transition-colors',
                          done
                            ? 'border-ink bg-ink text-canvas'
                            : 'border-line bg-transparent text-ink',
                        )}
                      >
                        <HabitGlyph icon={habit.icon} size={20} />
                        {done && (
                          <span className="absolute -bottom-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full bg-brand text-brand-ink ring-2 ring-surface">
                            <Check size={9} weight="bold" aria-hidden="true" />
                          </span>
                        )}
                      </span>
                      <span className="w-full truncate text-center text-[9.5px] font-semibold text-muted">
                        {habit.name}
                      </span>
                    </button>
                  )
                })}
              </div>
            ) : (
              <Link
                to="/kebiasaan?new=1"
                className="mt-4 flex min-h-[64px] items-center gap-3 rounded-[20px] bg-surface-2 px-3.5"
              >
                <span className="flex size-9 items-center justify-center rounded-full border border-line text-muted">
                  <Plus size={15} weight="bold" aria-hidden="true" />
                </span>
                <span className="text-[12px] font-semibold text-ink">
                  Mulai satu kebiasaan kecil
                </span>
              </Link>
            )}
          </section>

          <section className="rounded-[30px] bg-surface p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="type-title text-[18px] text-ink">Agenda terdekat</h2>
                <p className="mt-1 text-[10.5px] font-medium text-muted">
                  Jadwal dan target berikutnya
                </p>
              </div>
              <Link to="/kalender" className={pillClass}>
                Kalender
              </Link>
            </div>

            {upcomingEvents.length > 0 ? (
              <div className="mt-2 divide-y divide-line/70">
                {upcomingEvents.map((event) => {
                  const isGoal = event.type === 'goal'
                  const eventIsToday = event.date === today
                  return (
                    <Link
                      key={event.id}
                      to="/kalender"
                      className="flex items-center gap-3 py-3.5"
                    >
                      <span
                        className={cn(
                          'flex size-12 shrink-0 flex-col items-center justify-center rounded-full',
                          eventIsToday ? 'bg-ink text-canvas' : 'bg-surface-2 text-ink',
                        )}
                      >
                        <span className="text-[14px] font-bold leading-none">
                          {event.date.slice(8, 10)}
                        </span>
                        <span
                          className={cn(
                            'mt-0.5 text-[8px] font-bold uppercase tracking-wide',
                            eventIsToday ? 'text-canvas/60' : 'text-muted',
                          )}
                        >
                          {formatMonthShort(event.date)}
                        </span>
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[12.5px] font-semibold text-ink">
                          {event.title}
                        </p>
                        <p className="mt-0.5 flex items-center gap-1 text-[10.5px] font-medium text-muted">
                          {isGoal ? (
                            <>
                              <Target size={11} aria-hidden="true" />
                              Target
                            </>
                          ) : (
                            <>
                              {relativeDayLabel(event.date)}
                              {event.startTime ? ` · ${event.startTime}` : ''}
                            </>
                          )}
                        </p>
                      </div>
                      <ArrowUpRight
                        size={14}
                        weight="bold"
                        className="shrink-0 text-muted"
                        aria-hidden="true"
                      />
                    </Link>
                  )
                })}
              </div>
            ) : (
              <div className="mt-2">
                <EmptyState
                  icon={CalendarBlank}
                  title="Agenda masih kosong"
                  description="Tambahkan jadwal atau target di kalender."
                  className="py-5"
                />
              </div>
            )}
          </section>

          <p className="px-2 pb-1 pt-1 text-center text-[9.5px] font-medium text-muted">
            Data demo tersimpan di perangkat ini
          </p>
        </div>
      </div>

      <Sheet
        open={quickAddOpen}
        onClose={() => setQuickAddOpen(false)}
        title="Tambah cepat"
        description="Pilih apa yang ingin kamu catat hari ini."
      >
        <div className="space-y-2 pb-2">
          {quickActions.map((action) => {
            const IconComponent = action.icon
            return (
              <Link
                key={action.to}
                to={action.to}
                onClick={() => setQuickAddOpen(false)}
                className="flex items-center gap-3 rounded-[20px] bg-surface-2 px-3.5 py-3 transition-colors active:bg-line"
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-surface text-ink">
                  <IconComponent size={19} aria-hidden="true" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-semibold text-ink">{action.label}</p>
                  <p className="text-[10.5px] font-medium text-muted">{action.description}</p>
                </div>
                <ArrowUpRight size={15} weight="bold" className="text-muted" aria-hidden="true" />
              </Link>
            )
          })}
          <p className="flex items-center justify-center gap-1.5 pt-3 text-[9.5px] font-medium text-muted">
            <Sparkle size={12} aria-hidden="true" />
            Catatan tersimpan otomatis di perangkat ini
          </p>
        </div>
      </Sheet>
    </div>
  )
}
