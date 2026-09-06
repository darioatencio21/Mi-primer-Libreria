'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { PROMO_MESSAGES } from '@/lib/constants'

export function PromoBar() {
  const [current, setCurrent] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    if (!visible) return
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % PROMO_MESSAGES.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [visible])

  if (!visible) return null

  return (
    <div className="relative h-[var(--height-promo)] bg-brand-primary text-text-on-brand flex items-center justify-center overflow-hidden">
      <p
        className="text-xs font-medium text-center px-[var(--space-10)] sm:px-[var(--space-10)] truncate max-w-[calc(100%-var(--space-8))] transition-opacity duration-300"
        aria-live="polite"
      >
        {PROMO_MESSAGES[current]}
      </p>
      <button
        onClick={() => setVisible(false)}
        className="absolute right-[var(--space-3)] top-1/2 -translate-y-1/2 p-[var(--space-1)] text-text-on-brand/70 hover:text-text-on-brand transition-colors duration-[var(--duration-micro)]"
        aria-label="Cerrar barra promocional"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  )
}
