'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { MEGA_MENU_COLUMNS } from '@/lib/constants'
import { cn } from '@/lib/utils'

export function MegaMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setIsOpen(true)
  }

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setIsOpen(false), 150)
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false)
    }
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen])

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'relative text-sm font-medium transition-colors duration-[var(--duration-micro)] py-[var(--space-3)]',
          isOpen ? 'text-brand-primary' : 'text-text-secondary hover:text-text-primary'
        )}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        Libros
        <span
          className={cn(
            'absolute bottom-0 left-0 right-0 h-[2px] bg-brand-primary transition-transform duration-200 ease-out origin-center',
            isOpen ? 'scale-x-100' : 'scale-x-0'
          )}
          aria-hidden="true"
        />
      </button>

      {isOpen && (
        <div
          ref={menuRef}
          className="absolute top-full left-1/2 -translate-x-1/2 mt-[var(--space-2)] w-[900px] max-w-[90vw] bg-bg-elevated rounded-[var(--radius-lg)] shadow-[var(--shadow-lg)] border border-border-subtle p-[var(--space-8)] z-50 animate-[fadeInUp_180ms_ease-out]"
          role="menu"
        >
          <div className="grid grid-cols-5 gap-[var(--space-8)]">
            {MEGA_MENU_COLUMNS.map((column) => (
              <div key={column.title}>
                <h3 className="text-sm font-semibold text-text-primary mb-[var(--space-3)]">
                  {column.title}
                </h3>
                <ul className="flex flex-col gap-[var(--space-2)]">
                  {column.items.map((item) => (
                    <li key={item}>
                      <Link
                        href={`/libros/${item.toLowerCase().replace(/\s+/g, '-')}`}
                        className="text-sm text-text-secondary hover:text-brand-primary transition-colors duration-[var(--duration-micro)]"
                        role="menuitem"
                      >
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div className="bg-bg-muted rounded-[var(--radius-md)] p-[var(--space-4)] flex flex-col justify-between">
              <div>
                <p className="text-xs font-semibold text-accent-terracotta mb-[var(--space-1)]">
                  COLECCIÓN DESTACADA
                </p>
                <h4 className="text-base font-semibold text-text-primary mb-[var(--space-2)]">
                  Lo mejor del otoño
                </h4>
                <p className="text-xs text-text-secondary">
                  Descubre las novedades editoriales de la temporada.
                </p>
              </div>
              <Link
                href="/libros/otono"
                className="mt-[var(--space-4)] inline-flex items-center text-sm font-semibold text-brand-primary hover:underline decoration-[1.5px] underline-offset-[3px]"
              >
                Explorar colección →
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
