import { lazy, Suspense, useEffect } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { AppShell } from './components/layout/AppShell'

const DashboardPage = lazy(() =>
  import('./pages/DashboardPage').then((module) => ({ default: module.DashboardPage })),
)
const FinancePage = lazy(() =>
  import('./pages/FinancePage').then((module) => ({ default: module.FinancePage })),
)
const TasksPage = lazy(() =>
  import('./pages/TasksPage').then((module) => ({ default: module.TasksPage })),
)
const CalendarPage = lazy(() =>
  import('./pages/CalendarPage').then((module) => ({ default: module.CalendarPage })),
)
const HabitsPage = lazy(() =>
  import('./pages/HabitsPage').then((module) => ({ default: module.HabitsPage })),
)
const SettingsPage = lazy(() =>
  import('./pages/SettingsPage').then((module) => ({ default: module.SettingsPage })),
)

const titles: Record<string, string> = {
  '/': 'Beranda',
  '/keuangan': 'Keuangan',
  '/tugas': 'Tugas',
  '/kalender': 'Kalender',
  '/kebiasaan': 'Kebiasaan',
  '/pengaturan': 'Pengaturan',
}

function RouteEffects() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0 })
    document.title = `${titles[pathname] ?? 'Harian'} — Harian`
  }, [pathname])

  return null
}

function PageFallback() {
  return (
    <div
      className="flex min-h-[60dvh] flex-col items-center justify-center gap-3 px-6"
      role="status"
      aria-live="polite"
    >
      <span
        className="size-6 animate-spin rounded-full border-2 border-line border-t-brand-strong"
        aria-hidden="true"
      />
      <p className="text-[12px] font-medium text-muted">Memuat halaman…</p>
    </div>
  )
}

export default function App() {
  const location = useLocation()

  return (
    <AppShell>
      <RouteEffects />
      <div key={location.pathname} className="animate-page-in">
        <Suspense fallback={<PageFallback />}>
          <Routes location={location}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/keuangan" element={<FinancePage />} />
            <Route path="/tugas" element={<TasksPage />} />
            <Route path="/kalender" element={<CalendarPage />} />
            <Route path="/kebiasaan" element={<HabitsPage />} />
            <Route path="/pengaturan" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </div>
    </AppShell>
  )
}
