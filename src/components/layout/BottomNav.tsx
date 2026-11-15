import {
  CalendarBlank,
  Flame,
  House,
  ListChecks,
  Wallet,
} from '@phosphor-icons/react'
import { NavLink } from 'react-router-dom'
import { cn } from '../../lib/utils'

const items = [
  { to: '/', label: 'Beranda', icon: House, end: true },
  { to: '/keuangan', label: 'Keuangan', icon: Wallet },
  { to: '/tugas', label: 'Tugas', icon: ListChecks },
  { to: '/kalender', label: 'Kalender', icon: CalendarBlank },
  { to: '/kebiasaan', label: 'Kebiasaan', icon: Flame },
]

export function BottomNav() {
  return (
    <nav
      aria-label="Navigasi utama"
      className="fixed bottom-[calc(env(safe-area-inset-bottom)+0.75rem)] left-1/2 z-40 -translate-x-1/2"
    >
      <div className="flex items-center gap-0.5 rounded-full border border-white/70 bg-[#e6e8e0]/80 p-1.5 shadow-[0_14px_40px_rgba(17,21,19,0.16)] backdrop-blur-2xl backdrop-saturate-150 dark:border-white/10 dark:bg-[#141714]/80 dark:shadow-[0_16px_50px_rgba(0,0,0,0.55)]">
        {items.map((item) => {
          const IconComponent = item.icon
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              aria-label={item.label}
              className={({ isActive }) =>
                cn(
                  'flex size-12 items-center justify-center rounded-full transition-colors duration-150 active:scale-95',
                  isActive
                    ? 'bg-white text-[#111311] shadow-[0_2px_8px_rgba(17,34,31,0.12)]'
                    : 'text-ink/50 hover:text-ink dark:text-ink/55',
                )
              }
            >
              {({ isActive }) => (
                <IconComponent
                  size={20}
                  weight={isActive ? 'fill' : 'regular'}
                  aria-hidden="true"
                />
              )}
            </NavLink>
          )
        })}
      </div>
    </nav>
  )
}
