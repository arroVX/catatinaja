import type { ButtonHTMLAttributes } from 'react'
import { cn } from '../../lib/utils'

type Variant = 'primary' | 'secondary' | 'soft' | 'ghost' | 'danger'
type Size = 'sm' | 'md' | 'lg' | 'icon'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  fullWidth?: boolean
}

const variantClasses: Record<Variant, string> = {
  primary: 'bg-ink text-canvas hover:bg-ink/90',
  secondary:
    'border border-line bg-surface text-ink hover:border-ink/30 hover:bg-surface-2',
  soft: 'bg-surface-2 text-ink hover:bg-line',
  ghost: 'text-muted hover:bg-surface-2 hover:text-ink',
  danger: 'bg-danger-soft text-danger hover:bg-danger/15',
}

const sizeClasses: Record<Size, string> = {
  sm: 'min-h-10 rounded-full px-4 text-[12px]',
  md: 'min-h-11 rounded-full px-4.5 text-[13px]',
  lg: 'min-h-[52px] rounded-full px-5 text-[14px]',
  icon: 'size-11 rounded-full p-0',
}

export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex select-none items-center justify-center gap-2 font-semibold transition-all duration-150 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-40',
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && 'w-full',
        className,
      )}
      {...props}
    />
  )
}
