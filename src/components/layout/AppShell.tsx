import type { ReactNode } from 'react'
import { BottomNav } from './BottomNav'

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh bg-[#e9eae4] dark:bg-[#050706]">
      <div className="relative mx-auto min-h-dvh w-full max-w-[430px] bg-canvas sm:border-x sm:border-black/[0.06] sm:shadow-[0_0_90px_rgba(17,34,31,0.10)] dark:sm:border-white/[0.06] dark:sm:shadow-[0_0_90px_rgba(0,0,0,0.5)]">
        <main className="min-h-dvh pb-nav">{children}</main>
        <BottomNav />
      </div>
    </div>
  )
}
