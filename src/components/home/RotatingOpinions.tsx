'use client'

import { useEffect, useState } from 'react'
import { Quote, Star } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ReviewPreview } from '@/lib/types'

export function RotatingOpinions({ items }: { items: ReviewPreview[] }) {
  const [index, setIndex] = useState(0)
  const [fading, setFading] = useState(false)

  const active = items[index]

  useEffect(() => {
    if (items.length < 2) return
    const id = setInterval(() => {
      setFading(true)
      setTimeout(() => {
        setIndex((i) => (i + 1) % items.length)
        setFading(false)
      }, 300)
    }, 5000)
    return () => clearInterval(id)
  }, [items.length])

  if (!active) return null

  return (
    <div className="relative bg-bg-surface border border-border-subtle rounded-[var(--radius-lg)] px-[var(--space-5)] py-[var(--space-6)] mb-[var(--space-8)] text-center overflow-hidden">
      <Quote className="w-6 h-6 text-brand-primary/30 mx-auto mb-[var(--space-3)]" aria-hidden="true" />
      <div
        className={cn(
          'transition-opacity duration-300 ease-out',
          fading ? 'opacity-0' : 'opacity-100'
        )}
        aria-live="polite"
      >
        <p className="text-sm md:text-base text-text-secondary italic leading-relaxed max-w-[620px] mx-auto">
          &ldquo;{active.content}&rdquo;
        </p>
        <div className="flex items-center justify-center gap-[var(--space-2)] mt-[var(--space-4)]">
          <div className="flex items-center" aria-label={`${active.rating} de 5 estrellas`}>
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={cn(
                  'w-3.5 h-3.5',
                  i < Math.round(active.rating)
                    ? 'fill-accent-gold text-accent-gold'
                    : 'text-border-subtle'
                )}
                aria-hidden="true"
              />
            ))}
          </div>
          <span className="text-xs font-semibold text-text-primary">{active.userName}</span>
          {active.bookTitle && (
            <>
              <span className="text-xs text-text-tertiary" aria-hidden="true">
                ·
              </span>
              <span className="text-xs text-text-tertiary">{active.bookTitle}</span>
            </>
          )}
        </div>
      </div>
    </div>
  )
}