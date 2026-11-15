import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { downloadJSON, todayKey, uid } from '../lib/utils'
import type {
  AppData,
  CalendarEvent,
  Habit,
  Profile,
  Task,
  Transaction,
} from '../types'
import { createSeedData } from './seed'

const STORAGE_KEY = 'harian.app.v1'

interface AppContextValue extends AppData {
  addTransaction: (input: Omit<Transaction, 'id'>) => void
  deleteTransaction: (id: string) => void
  addTask: (input: Omit<Task, 'id' | 'completed'>) => void
  toggleTask: (id: string) => void
  deleteTask: (id: string) => void
  addEvent: (input: Omit<CalendarEvent, 'id'>) => void
  deleteEvent: (id: string) => void
  addHabit: (input: Omit<Habit, 'id' | 'createdAt'>) => void
  deleteHabit: (id: string) => void
  toggleHabit: (habitId: string, date?: string) => void
  updateProfile: (patch: Partial<Profile>) => void
  resetDemo: () => void
  exportData: () => void
}

const AppContext = createContext<AppContextValue | null>(null)

function loadData(): AppData {
  const fallback = createSeedData()
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return fallback
    const parsed = JSON.parse(raw) as Partial<AppData>
    if (
      !parsed ||
      !Array.isArray(parsed.transactions) ||
      !Array.isArray(parsed.tasks) ||
      !Array.isArray(parsed.events) ||
      !Array.isArray(parsed.habits) ||
      !Array.isArray(parsed.habitLogs)
    ) {
      return fallback
    }
    return {
      ...fallback,
      ...parsed,
      profile: { ...fallback.profile, ...parsed.profile },
    } as AppData
  } catch {
    return fallback
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData>(loadData)

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    } catch {
      // Penyimpanan penuh atau diblokir — aplikasi tetap berjalan di memori.
    }
  }, [data])

  useEffect(() => {
    const root = document.documentElement
    const media = window.matchMedia('(prefers-color-scheme: dark)')

    const apply = () => {
      const dark =
        data.profile.theme === 'dark' ||
        (data.profile.theme === 'system' && media.matches)
      root.classList.toggle('dark', dark)
      root.style.colorScheme = dark ? 'dark' : 'light'
      document
        .querySelector('meta[name="theme-color"]')
        ?.setAttribute('content', dark ? '#0b0d0b' : '#f2f2ee')
    }

    apply()
    media.addEventListener('change', apply)
    return () => media.removeEventListener('change', apply)
  }, [data.profile.theme])

  const addTransaction = useCallback((input: Omit<Transaction, 'id'>) => {
    setData((current) => ({
      ...current,
      transactions: [{ ...input, id: uid('tx') }, ...current.transactions],
    }))
  }, [])

  const deleteTransaction = useCallback((id: string) => {
    setData((current) => ({
      ...current,
      transactions: current.transactions.filter((item) => item.id !== id),
    }))
  }, [])

  const addTask = useCallback((input: Omit<Task, 'id' | 'completed'>) => {
    setData((current) => ({
      ...current,
      tasks: [{ ...input, id: uid('task'), completed: false }, ...current.tasks],
    }))
  }, [])

  const toggleTask = useCallback((id: string) => {
    setData((current) => ({
      ...current,
      tasks: current.tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    }))
  }, [])

  const deleteTask = useCallback((id: string) => {
    setData((current) => ({
      ...current,
      tasks: current.tasks.filter((task) => task.id !== id),
    }))
  }, [])

  const addEvent = useCallback((input: Omit<CalendarEvent, 'id'>) => {
    setData((current) => ({
      ...current,
      events: [{ ...input, id: uid('evt') }, ...current.events],
    }))
  }, [])

  const deleteEvent = useCallback((id: string) => {
    setData((current) => ({
      ...current,
      events: current.events.filter((event) => event.id !== id),
    }))
  }, [])

  const addHabit = useCallback((input: Omit<Habit, 'id' | 'createdAt'>) => {
    setData((current) => ({
      ...current,
      habits: [
        ...current.habits,
        { ...input, id: uid('habit'), createdAt: todayKey() },
      ],
    }))
  }, [])

  const deleteHabit = useCallback((id: string) => {
    setData((current) => ({
      ...current,
      habits: current.habits.filter((habit) => habit.id !== id),
      habitLogs: current.habitLogs.filter((log) => log.habitId !== id),
    }))
  }, [])

  const toggleHabit = useCallback((habitId: string, date = todayKey()) => {
    setData((current) => {
      const existing = current.habitLogs.find(
        (log) => log.habitId === habitId && log.date === date,
      )
      const habitLogs = existing
        ? current.habitLogs.map((log) =>
            log.habitId === habitId && log.date === date
              ? { ...log, done: !log.done }
              : log,
          )
        : [...current.habitLogs, { habitId, date, done: true }]
      return { ...current, habitLogs }
    })
  }, [])

  const updateProfile = useCallback((patch: Partial<Profile>) => {
    setData((current) => ({
      ...current,
      profile: { ...current.profile, ...patch },
    }))
  }, [])

  const resetDemo = useCallback(() => {
    setData(createSeedData())
  }, [])

  const exportData = useCallback(() => {
    downloadJSON(`harian-backup-${todayKey()}.json`, {
      app: 'Harian',
      version: 1,
      exportedAt: new Date().toISOString(),
      ...data,
    })
  }, [data])

  const value = useMemo<AppContextValue>(
    () => ({
      ...data,
      addTransaction,
      deleteTransaction,
      addTask,
      toggleTask,
      deleteTask,
      addEvent,
      deleteEvent,
      addHabit,
      deleteHabit,
      toggleHabit,
      updateProfile,
      resetDemo,
      exportData,
    }),
    [
      data,
      addTransaction,
      deleteTransaction,
      addTask,
      toggleTask,
      deleteTask,
      addEvent,
      deleteEvent,
      addHabit,
      deleteHabit,
      toggleHabit,
      updateProfile,
      resetDemo,
      exportData,
    ],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp(): AppContextValue {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp harus dipakai di dalam AppProvider')
  }
  return context
}
