'use client'

import {
  useEffect,
  useRef,
  useCallback,
  type ReactNode,
} from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: ReactNode
  footer?: ReactNode
  size?: 'default' | 'large'
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'default',
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
        return
      }
      if (e.key === 'Tab' && modalRef.current) {
        const focusable = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
        const first = focusable[0]
        const last = focusable[focusable.length - 1]

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault()
            last?.focus()
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault()
            first?.focus()
          }
        }
      }
    },
    [onClose]
  )

  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
      const timer = setTimeout(() => {
        const first = modalRef.current?.querySelector<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
        first?.focus()
      }, 50)
      return () => {
        document.removeEventListener('keydown', handleKeyDown)
        document.body.style.overflow = ''
        clearTimeout(timer)
        previousFocusRef.current?.focus()
      }
    }
  }, [isOpen, handleKeyDown])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-[var(--space-4)]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="absolute inset-0 bg-[rgba(23,20,15,0.5)] animate-[fadeIn_200ms_ease-out]"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={modalRef}
        className={cn(
          'relative bg-bg-elevated rounded-[20px] shadow-[var(--shadow-xl)] w-full flex flex-col max-h-[calc(100dvh-2*var(--space-4))] overflow-hidden animate-[fadeInUp_280ms_var(--ease-out-quint)]',
          size === 'default' ? 'max-w-[480px]' : 'max-w-[720px]'
        )}
      >
        <div className="flex items-center justify-between shrink-0 p-[var(--space-4)] sm:p-[var(--space-6)] border-b border-border-subtle">
          <h2 id="modal-title" className="text-lg sm:text-xl font-semibold font-display text-text-primary">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-9 h-9 rounded-[var(--radius-md)] text-text-tertiary hover:text-text-primary hover:bg-bg-muted transition-colors duration-[var(--duration-micro)]"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-[var(--space-4)] sm:p-[var(--space-6)] overflow-y-auto">{children}</div>
        {footer && (
          <div className="flex items-center justify-end gap-[var(--space-3)] p-[var(--space-6)] border-t border-border-subtle">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}
