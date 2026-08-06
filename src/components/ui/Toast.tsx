'use client'

import { useEffect, useState, useCallback } from 'react'
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react'
import { cn } from '@/lib/utils'

type ToastVariant = 'success' | 'error' | 'info' | 'warning'

interface ToastProps {
  message: string
  variant?: ToastVariant
  duration?: number
  onClose: () => void
}

const variantConfig: Record<
  ToastVariant,
  { icon: typeof CheckCircle; bg: string; text: string; border: string }
> = {
  success: {
    icon: CheckCircle,
    bg: 'bg-success-bg',
    text: 'text-success',
    border: 'border-success/20',
  },
  error: {
    icon: XCircle,
    bg: 'bg-error-bg',
    text: 'text-error',
    border: 'border-error/20',
  },
  info: {
    icon: Info,
    bg: 'bg-info-bg',
    text: 'text-info',
    border: 'border-info/20',
  },
  warning: {
    icon: AlertTriangle,
    bg: 'bg-warning-bg',
    text: 'text-warning',
    border: 'border-warning/20',
  },
}

export function Toast({
  message,
  variant = 'info',
  duration = 4000,
  onClose,
}: ToastProps) {
  const [visible, setVisible] = useState(false)
  const [exiting, setExiting] = useState(false)
  const config = variantConfig[variant]
  const Icon = config.icon

  const dismiss = useCallback(() => {
    setExiting(true)
    setTimeout(onClose, 200)
  }, [onClose])

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true))
    const timer = setTimeout(dismiss, duration)
    return () => clearTimeout(timer)
  }, [duration, dismiss])

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'flex items-center gap-[var(--space-3)] px-[var(--space-4)] py-[var(--space-3)] rounded-[var(--radius-md)] border shadow-[var(--shadow-md)] max-w-[400px]',
        config.bg,
        config.border,
        'transition-all',
        visible && !exiting
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-4',
        exiting && 'opacity-0 -translate-y-2'
      )}
      style={{
        transitionDuration: exiting ? '200ms' : '250ms',
        transitionTimingFunction: 'var(--ease-out-quint)',
      }}
    >
      <Icon className={cn('w-5 h-5 shrink-0', config.text)} aria-hidden="true" />
      <p className="text-sm text-text-primary flex-1">{message}</p>
      <button
        onClick={dismiss}
        className="shrink-0 text-text-tertiary hover:text-text-primary transition-colors duration-[var(--duration-micro)]"
        aria-label="Cerrar notificación"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}

interface ToastContainerProps {
  toasts: Array<{
    id: string
    message: string
    variant: ToastVariant
  }>
  onRemove: (id: string) => void
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  return (
    <div
      className="fixed bottom-[var(--space-6)] right-[var(--space-6)] z-[100] flex flex-col gap-[var(--space-3)]"
      aria-label="Notificaciones"
    >
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          variant={toast.variant}
          onClose={() => onRemove(toast.id)}
        />
      ))}
    </div>
  )
}
