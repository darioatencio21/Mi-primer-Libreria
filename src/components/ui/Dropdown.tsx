'use client'

import { useState, useRef, useEffect, type ReactNode } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DropdownOption {
  value: string
  label: string
}

interface DropdownProps {
  trigger: ReactNode
  options: DropdownOption[]
  value?: string
  onSelect: (value: string) => void
  className?: string
}

export function Dropdown({
  trigger,
  options,
  value,
  onSelect,
  className,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [])

  return (
    <div ref={ref} className={cn('relative inline-block', className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-[var(--space-2)] text-sm text-text-secondary hover:text-text-primary transition-colors duration-[var(--duration-micro)]"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        {trigger || options.find((o) => o.value === value)?.label || 'Seleccionar'}
        <ChevronDown
          className={cn(
            'w-4 h-4 transition-transform duration-[var(--duration-micro)]',
            isOpen && 'rotate-180'
          )}
          aria-hidden="true"
        />
      </button>
      {isOpen && (
        <ul
          role="listbox"
          className={cn(
            'absolute z-40 mt-[var(--space-2)] min-w-[200px] bg-bg-elevated rounded-[var(--radius-md)] shadow-[var(--shadow-lg)] border border-border-subtle py-[var(--space-2)]',
            'animate-[fadeInUp_150ms_ease-out] origin-top'
          )}
        >
          {options.map((option) => (
            <li key={option.value}>
              <button
                role="option"
                aria-selected={option.value === value}
                onClick={() => {
                  onSelect(option.value)
                  setIsOpen(false)
                }}
                className={cn(
                  'w-full flex items-center justify-between px-[var(--space-4)] py-[10px] text-sm transition-colors duration-[var(--duration-micro)]',
                  option.value === value
                    ? 'text-brand-primary font-medium bg-brand-primary-light'
                    : 'text-text-primary hover:bg-bg-muted'
                )}
              >
                {option.label}
                {option.value === value && (
                  <span className="text-brand-primary" aria-hidden="true">✓</span>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
