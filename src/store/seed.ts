import { addDays, addMonths, format, getDaysInMonth } from 'date-fns'
import type { AppData, CalendarEvent, Habit, HabitLog, Task, Transaction } from '../types'

const now = new Date()

const d = (offset: number): string => format(addDays(now, offset), 'yyyy-MM-dd')

const monthDay = (monthOffset: number, day: number): string => {
  const base = addMonths(now, monthOffset)
  const safeDay = Math.min(day, getDaysInMonth(base))
  return format(new Date(base.getFullYear(), base.getMonth(), safeDay), 'yyyy-MM-dd')
}

const transactions: Transaction[] = [
  // Bulan ini
  { id: 'tx-01', type: 'income', amount: 5_200_000, categoryId: 'salary', date: monthDay(0, 1), note: 'Gaji bulanan' },
  { id: 'tx-02', type: 'income', amount: 750_000, categoryId: 'freelance', date: d(-8), note: 'Proyek desain logo' },
  { id: 'tx-03', type: 'expense', amount: 1_200_000, categoryId: 'bills', date: monthDay(0, 2), note: 'Sewa kos' },
  { id: 'tx-04', type: 'expense', amount: 28_000, categoryId: 'food', date: d(0), note: 'Kopi & roti' },
  { id: 'tx-05', type: 'expense', amount: 15_000, categoryId: 'transport', date: d(0), note: 'Ojek ke kampus' },
  { id: 'tx-06', type: 'expense', amount: 35_000, categoryId: 'food', date: d(0), note: 'Makan siang' },
  { id: 'tx-07', type: 'expense', amount: 42_000, categoryId: 'food', date: d(-1), note: 'Makan malam' },
  { id: 'tx-08', type: 'expense', amount: 129_000, categoryId: 'shopping', date: d(-1), note: 'Belanja bulanan' },
  { id: 'tx-09', type: 'expense', amount: 85_000, categoryId: 'bills', date: d(-2), note: 'Paket data' },
  { id: 'tx-10', type: 'expense', amount: 60_000, categoryId: 'fun', date: d(-3), note: 'Nonton bioskop' },
  { id: 'tx-11', type: 'expense', amount: 35_000, categoryId: 'health', date: d(-4), note: 'Vitamin' },
  { id: 'tx-12', type: 'expense', amount: 25_000, categoryId: 'food', date: d(-5), note: 'Sarapan' },
  { id: 'tx-13', type: 'expense', amount: 20_000, categoryId: 'transport', date: d(-6), note: 'Bensin' },
  { id: 'tx-14', type: 'expense', amount: 156_000, categoryId: 'shopping', date: d(-9), note: 'Sepatu lari' },
  { id: 'tx-15', type: 'expense', amount: 54_000, categoryId: 'food', date: d(-11), note: 'Makan bersama teman' },
  { id: 'tx-16', type: 'expense', amount: 45_000, categoryId: 'fun', date: d(-12), note: 'Langganan musik' },
  // Bulan lalu
  { id: 'tx-17', type: 'income', amount: 5_200_000, categoryId: 'salary', date: monthDay(-1, 1), note: 'Gaji bulanan' },
  { id: 'tx-18', type: 'income', amount: 500_000, categoryId: 'freelance', date: monthDay(-1, 18), note: 'Desain feed Instagram' },
  { id: 'tx-19', type: 'expense', amount: 1_200_000, categoryId: 'bills', date: monthDay(-1, 2), note: 'Sewa kos' },
  { id: 'tx-20', type: 'expense', amount: 230_000, categoryId: 'food', date: monthDay(-1, 6), note: 'Makan mingguan' },
  { id: 'tx-21', type: 'expense', amount: 195_000, categoryId: 'food', date: monthDay(-1, 13), note: 'Makan mingguan' },
  { id: 'tx-22', type: 'expense', amount: 175_000, categoryId: 'food', date: monthDay(-1, 20), note: 'Makan mingguan' },
  { id: 'tx-23', type: 'expense', amount: 250_000, categoryId: 'transport', date: monthDay(-1, 8), note: 'Bensin & servis' },
  { id: 'tx-24', type: 'expense', amount: 350_000, categoryId: 'shopping', date: monthDay(-1, 14), note: 'Belanja bulanan' },
  { id: 'tx-25', type: 'expense', amount: 250_000, categoryId: 'bills', date: monthDay(-1, 21), note: 'Listrik & air' },
  { id: 'tx-26', type: 'expense', amount: 150_000, categoryId: 'fun', date: monthDay(-1, 24), note: 'Konser mini' },
  { id: 'tx-27', type: 'expense', amount: 100_000, categoryId: 'health', date: monthDay(-1, 27), note: 'Obat & vitamin' },
]

const tasks: Task[] = [
  { id: 'task-01', title: 'Review materi Kalkulus', dueDate: d(0), completed: true, priority: 'high', tag: 'Kuliah' },
  { id: 'task-02', title: 'Kirim laporan mingguan', dueDate: d(0), completed: false, priority: 'high', tag: 'Kerja' },
  { id: 'task-03', title: 'Olahraga 30 menit', dueDate: d(0), completed: false, priority: 'medium', tag: 'Kesehatan' },
  { id: 'task-04', title: 'Baca 20 halaman buku', dueDate: d(0), completed: true, priority: 'low', tag: 'Pribadi' },
  { id: 'task-05', title: 'Bayar tagihan listrik', dueDate: d(-1), completed: false, priority: 'high', tag: 'Pribadi' },
  { id: 'task-06', title: 'Revisi slide presentasi', dueDate: d(-2), completed: false, priority: 'medium', tag: 'Kerja' },
  { id: 'task-07', title: 'Presentasi proyek akhir', dueDate: d(1), completed: false, priority: 'high', tag: 'Kuliah' },
  { id: 'task-08', title: 'Meeting tim desain', dueDate: d(2), completed: false, priority: 'medium', tag: 'Kerja' },
  { id: 'task-09', title: 'Belanja kebutuhan mingguan', dueDate: d(3), completed: false, priority: 'low', tag: 'Pribadi' },
]

const events: CalendarEvent[] = [
  { id: 'evt-01', title: 'Kuliah Struktur Data', date: d(0), startTime: '09:00', endTime: '10:40', type: 'event', note: 'Ruang B-204' },
  { id: 'evt-02', title: 'Review desain dengan tim', date: d(0), startTime: '16:00', endTime: '17:00', type: 'event' },
  { id: 'evt-03', title: 'Presentasi proyek akhir', date: d(1), startTime: '13:00', endTime: '14:30', type: 'event', note: 'Bawa laptop & slide' },
  { id: 'evt-04', title: 'Nonton bareng', date: d(2), startTime: '19:30', endTime: '21:30', type: 'event' },
  { id: 'evt-05', title: 'Target tabungan bulan ini', date: d(6), type: 'goal', note: 'Sisihkan minimal Rp 500.000' },
  { id: 'evt-06', title: 'Ujian tengah semester', date: d(10), startTime: '08:00', endTime: '10:00', type: 'event', note: 'Gedung A' },
  { id: 'evt-07', title: 'Deadline laporan', date: d(-2), type: 'event' },
]

const habits: Habit[] = [
  { id: 'habit-water', name: 'Minum air', icon: 'water', color: 'teal', createdAt: d(-45) },
  { id: 'habit-workout', name: 'Olahraga', icon: 'workout', color: 'orange', createdAt: d(-30) },
  { id: 'habit-read', name: 'Baca buku', icon: 'read', color: 'blue', createdAt: d(-21) },
  { id: 'habit-sleep', name: 'Tidur cukup', icon: 'sleep', color: 'violet', createdAt: d(-14) },
]

const doneLogs = (habitId: string, offsets: number[]): HabitLog[] =>
  offsets.map((offset) => ({ habitId, date: d(offset), done: true }))

const habitLogs: HabitLog[] = [
  ...doneLogs('habit-water', [0, -1, -2, -3, -4, -5, -6, -8, -9, -10, -12]),
  ...doneLogs('habit-workout', [0, -1, -3, -4, -6, -8]),
  ...doneLogs('habit-read', [-1, -2, -3, -4, -5, -7, -8]),
  ...doneLogs('habit-sleep', [0, -2, -5, -7]),
]

export function createSeedData(): AppData {
  return {
    transactions,
    tasks,
    events,
    habits,
    habitLogs,
    profile: {
      name: 'Raka Pratama',
      email: 'raka.pratama@email.com',
      theme: 'light',
      reminderEnabled: true,
      reminderTime: '20:00',
    },
  }
}
