'use client'

import { useRef, useState, useEffect, useCallback, type ReactNode } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CarouselProps {
  children: ReactNode[]
  showDots?: boolean
  className?: string
  gap?: number
}

export function Carousel({
  children,
  showDots = false,
  className,
  gap = 24,
}: CarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const [activeDot, setActiveDot] = useState(0)

  const checkScroll = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 2)
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 2)
    const childWidth = el.firstElementChild?.clientWidth || 1
    setActiveDot(Math.round(el.scrollLeft / (childWidth + gap)))
  }, [gap])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    checkScroll()
    el.addEventListener('scroll', checkScroll, { passive: true })
    window.addEventListener('resize', checkScroll)
    return () => {
      el.removeEventListener('scroll', checkScroll)
      window.removeEventListener('resize', checkScroll)
    }
  }, [checkScroll])

  const scroll = (direction: 'left' | 'right') => {
    const el = scrollRef.current
    if (!el) return
    const childWidth = el.firstElementChild?.clientWidth || 300
    const amount = direction === 'left' ? -(childWidth + gap) : childWidth + gap
    el.scrollBy({ left: amount, behavior: 'smooth' })
  }

  return (
    <div className={cn('relative group', className)}>
      <div
        ref={scrollRef}
        className="flex overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-hide"
        style={{ gap, scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {children.map((child, i) => (
          <div key={i} className="shrink-0 snap-start">
            {child}
          </div>
        ))}
      </div>

      {canScrollLeft && (
        <button
          onClick={() => scroll('left')}
          className="absolute left-2 top-1/2 -translate-y-1/2 w-11 h-11 rounded-[var(--radius-full)] bg-bg-surface/90 shadow-[var(--shadow-md)] flex items-center justify-center text-text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-[var(--duration-micro)] hidden md:flex"
          aria-label="Anterior"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      )}
      {canScrollRight && (
        <button
          onClick={() => scroll('right')}
          className="absolute right-2 top-1/2 -translate-y-1/2 w-11 h-11 rounded-[var(--radius-full)] bg-bg-surface/90 shadow-[var(--shadow-md)] flex items-center justify-center text-text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-[var(--duration-micro)] hidden md:flex"
          aria-label="Siguiente"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      )}

      {showDots && (
        <div className="flex items-center justify-center gap-[var(--space-2)] mt-[var(--space-4)]">
          {children.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                const el = scrollRef.current
                const childWidth = el?.firstElementChild?.clientWidth || 300
                el?.scrollTo({ left: i * (childWidth + gap), behavior: 'smooth' })
              }}
              className={cn(
                'w-2 h-2 rounded-full transition-all duration-[var(--duration-micro)]',
                i === activeDot ? 'bg-brand-primary w-6' : 'bg-border-subtle'
              )}
              aria-label={`Ir a diapositiva ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
