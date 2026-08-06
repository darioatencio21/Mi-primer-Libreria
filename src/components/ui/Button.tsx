'use client'

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'destructive'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  icon?: ReactNode
  iconPosition?: 'left' | 'right'
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-brand-primary text-text-on-brand hover:bg-brand-primary-hover active:bg-brand-primary-active disabled:bg-brand-primary-disabled disabled:text-text-tertiary',
  secondary:
    'bg-transparent border-[1.5px] border-brand-primary text-brand-primary hover:bg-brand-primary-light disabled:border-brand-primary-disabled disabled:text-text-tertiary',
  ghost:
    'bg-transparent text-brand-primary hover:bg-black/5 disabled:text-text-tertiary',
  destructive:
    'bg-error text-text-on-brand hover:bg-error/90 disabled:bg-brand-primary-disabled disabled:text-text-tertiary',
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-[var(--height-btn-sm)] px-[var(--space-3)] text-xs gap-[var(--space-1)]',
  md: 'h-[var(--height-btn-md)] px-[var(--space-4)] text-sm gap-[var(--space-2)]',
  lg: 'h-[var(--height-btn-lg)] px-[var(--space-6)] text-sm gap-[var(--space-2)]',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      icon,
      iconPosition = 'left',
      className,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          'inline-flex items-center justify-center font-semibold tracking-[0.01em] rounded-[var(--radius-md)] transition-all duration-[var(--duration-micro)] ease-out select-none',
          'hover:-translate-y-px active:translate-y-0 active:scale-[0.98]',
          'focus-visible:outline-2 focus-visible:outline-brand-primary focus-visible:outline-offset-2',
          variantStyles[variant],
          sizeStyles[size],
          (disabled || loading) && 'cursor-not-allowed hover:translate-y-0 active:scale-100',
          className
        )}
        {...props}
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
        ) : (
          <>
            {iconPosition === 'left' && icon && (
              <span className="shrink-0" aria-hidden="true">{icon}</span>
            )}
            {children}
            {iconPosition === 'right' && icon && (
              <span className="shrink-0" aria-hidden="true">{icon}</span>
            )}
          </>
        )}
      </button>
    )
  }
)

Button.displayName = 'Button'
