'use client'

import { Truck } from 'lucide-react'
import { FREE_SHIPPING_THRESHOLD } from '@/lib/store'
import { formatArs } from '@/lib/format'

interface FreeShippingProgressProps {
  subtotal: number
}

export function FreeShippingProgress({ subtotal }: FreeShippingProgressProps) {
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal)
  const progress = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100))
  const unlocked = remaining === 0

  return (
    <div className="rounded-[var(--radius-md)] bg-bg-muted/60 border border-border-subtle p-[var(--space-4)]">
      <div className="flex items-center gap-[var(--space-2)] mb-[var(--space-3)]">
        <Truck className="w-4 h-4 shrink-0 text-brand-primary" aria-hidden="true" />
        {unlocked ? (
          <p className="text-sm font-semibold text-success">
            ¡Genial! Tenés envío gratis en este pedido.
          </p>
        ) : (
          <p className="text-sm text-text-secondary">
            Te faltan{' '}
            <strong className="font-semibold text-brand-primary">{formatArs(remaining)}</strong>{' '}
            para obtener envío gratis.
          </p>
        )}
      </div>
      <div
        className="h-2 rounded-full bg-border-subtle overflow-hidden"
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Progreso hacia el envío gratis"
      >
        <div
          className="h-full rounded-full bg-brand-primary transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}