import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { CheckCircle, Info, WarningCircle } from '@phosphor-icons/react'
import { cn, uid } from '../../lib/utils'
import type { ToastMessage } from '../../types'

interface ToastContextValue {
  toast: (message: string, tone?: ToastMessage['tone']) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([])
  const timers = useRef<number[]>([])

  useEffect(() => {
    return () => {
      timers.current.forEach((timer) => window.clearTimeout(timer))
    }
  }, [])

  const toast = useCallback((message: string, tone: ToastMessage['tone'] = 'default') => {
    const id = uid('toast')
    setToasts((current) => [...current.slice(-1), { id, message, tone }])
    const timer = window.setTimeout(() => {
      setToasts((current) => current.filter((item) => item.id !== id))
    }, 2800)
    timers.current.push(timer)
  }, [])

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div
        className="pointer-events-none fixed inset-x-0 bottom-[calc(env(safe-area-inset-bottom)+6.5rem)] z-[70] mx-auto flex w-full max-w-[430px] flex-col items-center gap-2 px-6"
        aria-live="polite"
        aria-atomic="false"
      >
        {toasts.map((item) => {
          const Glyph =
            item.tone === 'success'
              ? CheckCircle
              : item.tone === 'danger'
                ? WarningCircle
                : Info
          return (
            <div
              key={item.id}
              className={cn(
                'animate-toast-in pointer-events-auto flex w-full max-w-[340px] items-center gap-3 rounded-full px-4 py-3 shadow-[0_12px_40px_rgba(11,13,11,0.18)]',
                item.tone === 'danger'
                  ? 'bg-danger-soft text-danger'
                  : 'bg-ink text-canvas',
              )}
            >
              <Glyph size={18} weight="fill" className="shrink-0" aria-hidden="true" />
              <p className="text-[12px] font-semibold leading-snug">{item.message}</p>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast harus dipakai di dalam ToastProvider')
  }
  return context
}
