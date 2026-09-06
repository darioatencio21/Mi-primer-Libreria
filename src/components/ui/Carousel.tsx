'use client'

import { useRef, useState, useEffect, useCallback, type ReactNode } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CarouselProps {
  children: ReactNode[]
  showDots?: boolean
  className?: string
  gap?: number
  edgeFade?: boolean
  snapMode?: 'mandatory' | 'proximity' | 'none'
}

export function Carousel({
  children,
  showDots = false,
  className,
  gap = 24,
  edgeFade = false,
  snapMode = 'mandatory',
}: CarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const [activeDot, setActiveDot] = useState(0)

  const checkArrows = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 2)
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 2)
  }, [])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return

    checkArrows()

    const handleScrollEnd = () => {
      checkArrows()
      const childWidth = el.firstElementChild?.clientWidth || 1
      setActiveDot(Math.round(el.scrollLeft / (childWidth + gap)))
    }

    el.addEventListener('scroll', checkArrows, { passive: true })
    el.addEventListener('scrollend', handleScrollEnd, { passive: true })
    window.addEventListener('resize', checkArrows)

    return () => {
      el.removeEventListener('scroll', checkArrows)
      el.removeEventListener('scrollend', handleScrollEnd)
      window.removeEventListener('resize', checkArrows)
    }
  }, [checkArrows, gap])

  useEffect(() => {
    const el = scrollRef.current
    if (!el || !showDots) return

    const items = el.children
    if (!items.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
            const index = Array.from(items).indexOf(entry.target as Element)
            if (index !== -1) setActiveDot(index)
          }
        })
      },
      {
        root: el,
        threshold: 0.6,
      }
    )

    Array.from(items).forEach((child) => observer.observe(child))

    return () => observer.disconnect()
  }, [showDots, children.length])

  const scroll = (direction: 'left' | 'right') => {
    const el = scrollRef.current
    if (!el) return
    const childWidth = el.firstElementChild?.clientWidth || 300
    const amount = direction === 'left' ? -(childWidth + gap) : childWidth + gap
    el.scrollBy({ left: amount, behavior: 'smooth' })
  }

  return (
    <div className="relative [&:hover_.carousel-arrow]:opacity-100">
      <div
        ref={scrollRef}
        className={cn(
          'flex overflow-x-auto scroll-smooth scrollbar-hide overscroll-x-contain touch-pan-x',
          snapMode === 'mandatory' && 'snap-x snap-mandatory',
          snapMode === 'proximity' && 'snap-x snap-proximity',
          edgeFade &&
            '[mask-image:linear-gradient(to_right,#000_90%,transparent_100%)] lg:[mask-image:none]'
        )}
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
          className="carousel-arrow absolute left-2 top-1/2 -translate-y-1/2 w-11 h-11 rounded-[var(--radius-full)] bg-bg-surface/90 shadow-[var(--shadow-md)] flex items-center justify-center text-text-primary opacity-0 transition-opacity duration-[var(--duration-micro)] hidden md:flex"
          aria-label="Anterior"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      )}
      {canScrollRight && (
        <button
          onClick={() => scroll('right')}
          className="carousel-arrow absolute right-2 top-1/2 -translate-y-1/2 w-11 h-11 rounded-[var(--radius-full)] bg-bg-surface/90 shadow-[var(--shadow-md)] flex items-center justify-center text-text-primary opacity-0 transition-opacity duration-[var(--duration-micro)] hidden md:flex"
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
                'h-2 rounded-full transition-all duration-[var(--duration-micro)]',
                i === activeDot ? 'bg-brand-primary w-6' : 'bg-border-subtle w-2'
              )}
              aria-label={`Ir a diapositiva ${i + 1}`}
              aria-current={i === activeDot ? 'true' : undefined}
            />
          ))}
        </div>
      )}
    </div>
  )
}
