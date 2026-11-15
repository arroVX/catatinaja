import { clsx, type ClassValue } from 'clsx'
import {
  differenceInCalendarDays,
  format,
  isToday,
  isYesterday,
  parseISO,
  startOfDay,
  subDays,
} from 'date-fns'
import { id as localeId } from 'date-fns/locale/id'
import { twMerge } from 'tailwind-merge'
import type { HabitLog } from '../types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function dateKey(date: Date): string {
  return format(date, 'yyyy-MM-dd')
}

export function todayKey(): string {
  return dateKey(new Date())
}

export function parseKey(key: string): Date {
  return parseISO(key)
}

export function formatIDR(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(Math.round(amount))
}

export function formatCompactIDR(amount: number): string {
  if (Math.abs(amount) < 1000) return `Rp ${Math.round(amount)}`
  const compact = new Intl.NumberFormat('id-ID', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(amount)
  return `Rp ${compact}`
}

export function formatAmountInput(value: string): string {
  const digits = value.replace(/\D/g, '')
  if (!digits) return ''
  return Number(digits).toLocaleString('id-ID')
}

export function parseAmountInput(value: string): number {
  const digits = value.replace(/\D/g, '')
  return digits ? Number(digits) : 0
}

export function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1)
}

export function formatMonthYear(date: Date): string {
  return capitalize(format(date, 'MMMM yyyy', { locale: localeId }))
}

export function formatMonthShort(value: string | Date): string {
  const date = typeof value === 'string' ? parseKey(value) : value
  return capitalize(format(date, 'MMM', { locale: localeId }))
}

export function formatDateFull(value: string | Date): string {
  const date = typeof value === 'string' ? parseKey(value) : value
  return capitalize(format(date, 'EEEE, d MMMM yyyy', { locale: localeId }))
}

export function formatDateShort(value: string | Date): string {
  const date = typeof value === 'string' ? parseKey(value) : value
  return format(date, 'd MMM', { locale: localeId })
}

export function formatDateNumeric(value: string | Date): string {
  const date = typeof value === 'string' ? parseKey(value) : value
  return format(date, 'd MMMM yyyy', { locale: localeId })
}

export function formatDayName(value: string | Date): string {
  const date = typeof value === 'string' ? parseKey(value) : value
  return format(date, 'EEE', { locale: localeId })
}

export function formatWeekdayShort(value: Date): string {
  return format(value, 'EEE', { locale: localeId })
}

export function formatWeekdayNarrow(value: Date): string {
  return format(value, 'EEEEE', { locale: localeId })
}

export function relativeDayLabel(value: string): string {
  const date = parseKey(value)
  if (isToday(date)) return 'Hari ini'
  if (isYesterday(date)) return 'Kemarin'
  return capitalize(format(date, 'EEEE, d MMMM', { locale: localeId }))
}

export function greeting(date = new Date()): string {
  const hour = date.getHours()
  if (hour < 11) return 'Selamat pagi'
  if (hour < 15) return 'Selamat siang'
  if (hour < 19) return 'Selamat sore'
  return 'Selamat malam'
}

export function initials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('')
}

export function isOverdue(key: string): boolean {
  return differenceInCalendarDays(startOfDay(new Date()), startOfDay(parseKey(key))) > 0
}

export function isFuture(key: string): boolean {
  return differenceInCalendarDays(startOfDay(parseKey(key)), startOfDay(new Date())) > 0
}

export function isSameKey(a: string, b: string): boolean {
  return a === b
}

export function lastNDays(count: number, from = new Date()): Date[] {
  return Array.from({ length: count }, (_, index) => subDays(from, count - 1 - index))
}

export function getHabitStreak(logs: HabitLog[], habitId: string, from = new Date()): number {
  const doneDates = new Set(
    logs.filter((log) => log.habitId === habitId && log.done).map((log) => log.date),
  )
  let cursor = startOfDay(from)
  if (!doneDates.has(dateKey(cursor))) {
    cursor = subDays(cursor, 1)
  }
  let streak = 0
  while (doneDates.has(dateKey(cursor))) {
    streak += 1
    cursor = subDays(cursor, 1)
  }
  return streak
}

export function percent(part: number, total: number): number {
  if (total <= 0) return 0
  return Math.round((part / total) * 100)
}

export function uid(prefix = 'id'): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`
}

export function downloadJSON(filename: string, data: unknown): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.click()
  URL.revokeObjectURL(url)
}
