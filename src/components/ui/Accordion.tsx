'use client'

import { useState, type ReactNode } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AccordionProps {
  title: string
  children: ReactNode
  defaultOpen?: boolean
  className?: string
}

export function Accordion({
  title,
  children,
  defaultOpen = false,
  className,
}: AccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className={cn('border-b border-border-subtle', className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full py-[var(--space-4)] text-left group"
        aria-expanded={isOpen}
      >
        <span className="text-base font-semibold text-text-primary">
          {title}
        </span>
        <ChevronDown
          className={cn(
            'w-5 h-5 text-text-tertiary transition-transform duration-200 ease-out group-hover:text-text-primary',
            isOpen && 'rotate-180'
          )}
          aria-hidden="true"
        />
      </button>
      <div
        className={cn(
          'grid transition-[grid-template-rows] duration-[var(--duration-card)] ease-out',
          isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        )}
      >
        <div className="overflow-hidden">
          <div className="pb-[var(--space-4)] text-sm text-text-secondary leading-relaxed">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
