import {
  Barbell,
  BookOpen,
  Briefcase,
  Car,
  DotsThree,
  Drop,
  ForkKnife,
  GameController,
  Gift,
  Heartbeat,
  MoonStars,
  MusicNotes,
  Notebook,
  Plant,
  Receipt,
  ShoppingBagOpen,
  Wallet,
  type Icon,
} from '@phosphor-icons/react'
import type { Category, HabitColorKey, HabitIconKey } from '../types'

export const categoryIcons: Record<string, Icon> = {
  food: ForkKnife,
  transport: Car,
  shopping: ShoppingBagOpen,
  bills: Receipt,
  fun: GameController,
  health: Heartbeat,
  other: DotsThree,
  salary: Wallet,
  freelance: Briefcase,
  bonus: Gift,
}

export const habitIcons: Record<HabitIconKey, Icon> = {
  water: Drop,
  workout: Barbell,
  read: BookOpen,
  sleep: MoonStars,
  health: Heartbeat,
  journal: Notebook,
  music: MusicNotes,
  plant: Plant,
}

export const habitColors: Record<
  HabitColorKey,
  { hex: string; label: string; onColor: string }
> = {
  teal: { hex: '#0F766E', label: 'Teal', onColor: '#ffffff' },
  orange: { hex: '#B26A3F', label: 'Oranye', onColor: '#ffffff' },
  blue: { hex: '#5D7A86', label: 'Biru', onColor: '#ffffff' },
  violet: { hex: '#7D7187', label: 'Ungu', onColor: '#ffffff' },
  rose: { hex: '#9C5F66', label: 'Pink', onColor: '#ffffff' },
  lime: { hex: '#7B8A57', label: 'Hijau limau', onColor: '#ffffff' },
}

export function CategoryIcon({
  category,
  size = 20,
  weight = 'duotone',
  className,
}: {
  category: Category
  size?: number
  weight?: 'thin' | 'light' | 'regular' | 'bold' | 'fill' | 'duotone'
  className?: string
}) {
  const Glyph = categoryIcons[category.icon] ?? DotsThree
  return <Glyph size={size} weight={weight} className={className} aria-hidden="true" />
}

export function HabitGlyph({
  icon,
  size = 20,
  weight = 'duotone',
  className,
}: {
  icon: HabitIconKey
  size?: number
  weight?: 'thin' | 'light' | 'regular' | 'bold' | 'fill' | 'duotone'
  className?: string
}) {
  const Glyph = habitIcons[icon] ?? DotsThree
  return <Glyph size={size} weight={weight} className={className} aria-hidden="true" />
}
