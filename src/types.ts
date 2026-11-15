export type TransactionType = 'income' | 'expense'

export type Priority = 'low' | 'medium' | 'high'

export type ThemeMode = 'light' | 'dark' | 'system'

export type EventType = 'event' | 'goal'

export type HabitColorKey = 'teal' | 'orange' | 'blue' | 'violet' | 'rose' | 'lime'

export type HabitIconKey =
  | 'water'
  | 'workout'
  | 'read'
  | 'sleep'
  | 'health'
  | 'journal'
  | 'music'
  | 'plant'

export interface Transaction {
  id: string
  type: TransactionType
  amount: number
  categoryId: string
  /** yyyy-MM-dd */
  date: string
  note?: string
}

export interface Task {
  id: string
  title: string
  /** yyyy-MM-dd */
  dueDate: string
  completed: boolean
  priority: Priority
  tag?: string
}

export interface CalendarEvent {
  id: string
  title: string
  /** yyyy-MM-dd */
  date: string
  startTime?: string
  endTime?: string
  type: EventType
  note?: string
}

export interface Habit {
  id: string
  name: string
  icon: HabitIconKey
  color: HabitColorKey
  /** yyyy-MM-dd */
  createdAt: string
}

export interface HabitLog {
  habitId: string
  /** yyyy-MM-dd */
  date: string
  done: boolean
}

export interface Profile {
  name: string
  email: string
  theme: ThemeMode
  reminderEnabled: boolean
  reminderTime: string
}

export interface AppData {
  transactions: Transaction[]
  tasks: Task[]
  events: CalendarEvent[]
  habits: Habit[]
  habitLogs: HabitLog[]
  profile: Profile
}

export interface Category {
  id: string
  label: string
  type: TransactionType
  icon: string
  color: string
}

export interface ToastMessage {
  id: string
  message: string
  tone?: 'default' | 'success' | 'danger'
}
