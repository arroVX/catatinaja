import type { Category } from '../types'

export const EXPENSE_CATEGORIES: Category[] = [
  { id: 'food', label: 'Makan & Minum', type: 'expense', icon: 'food', color: '#B4763F' },
  { id: 'transport', label: 'Transportasi', type: 'expense', icon: 'transport', color: '#5F7F7A' },
  { id: 'shopping', label: 'Belanja', type: 'expense', icon: 'shopping', color: '#8B7A62' },
  { id: 'bills', label: 'Tagihan', type: 'expense', icon: 'bills', color: '#586662' },
  { id: 'fun', label: 'Hiburan', type: 'expense', icon: 'fun', color: '#A45F56' },
  { id: 'health', label: 'Kesehatan', type: 'expense', icon: 'health', color: '#71836B' },
  { id: 'other', label: 'Lainnya', type: 'expense', icon: 'other', color: '#9AA19A' },
]

export const INCOME_CATEGORIES: Category[] = [
  { id: 'salary', label: 'Gaji', type: 'income', icon: 'salary', color: '#0F6B63' },
  { id: 'freelance', label: 'Freelance', type: 'income', icon: 'freelance', color: '#3F6F68' },
  { id: 'bonus', label: 'Bonus', type: 'income', icon: 'bonus', color: '#A9854F' },
]

export const ALL_CATEGORIES = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES]

export const CATEGORY_MAP: Record<string, Category> = Object.fromEntries(
  ALL_CATEGORIES.map((category) => [category.id, category]),
)

export function getCategory(id: string): Category {
  return (
    CATEGORY_MAP[id] ?? {
      id: 'other',
      label: 'Lainnya',
      type: 'expense',
      icon: 'other',
      color: '#9AA19A',
    }
  )
}

export const TASK_TAGS = ['Kuliah', 'Kerja', 'Pribadi', 'Kesehatan']
