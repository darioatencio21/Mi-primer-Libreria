'use client'

import { useEffect, useCallback, useState } from 'react'
import Link from 'next/link'
import { X, Tag } from 'lucide-react'
import { CartItem } from './CartItem'
import { FreeShippingProgress } from './FreeShippingProgress'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { TrustBadges } from '@/components/ui/TrustBadges'
import { useCart, selectItemCount, selectTotals } from '@/lib/store'
import { formatArs } from '@/lib/format'

interface CartDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const items = useCart((state) => state.items)
  const coupon = useCart((state) => state.coupon)
  const updateQuantity = useCart((state) => state.updateQuantity)
  const removeItem = useCart((state) => state.removeItem)
  const setCoupon = useCart((state) => state.setCoupon)
  const removeCoupon = useCart((state) => state.removeCoupon)

  const [couponOpen, setCouponOpen] = useState(false)
  const [couponCode, setCouponCode] = useState('')
  const [couponError, setCouponError] = useState('')

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose()
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  const applyCoupon = useCallback(() => {
    if (setCoupon(couponCode)) {
      setCouponError('')
      setCouponCode('')
      setCouponOpen(false)
    } else {
      setCouponError('Ese código no es válido o ya venció. Probá con NOVA10.')
    }
  }, [couponCode, setCoupon])

  const itemCount = selectItemCount(items)
  const { subtotal, discount, shipping, total } = selectTotals(items, coupon)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-labelledby="cart-title">
      <div
        className="absolute inset-0 bg-[rgba(23,20,15,0.4)] animate-[fadeIn_200ms_ease-out]"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="absolute right-0 top-0 bottom-0 w-full max-w-[420px] bg-bg-elevated shadow-[var(--shadow-xl)] flex flex-col animate-[slideInRight_300ms_var(--ease-out-quint)]">
        <div className="flex items-center justify-between p-[var(--space-6)] border-b border-border-subtle">
          <h2 id="cart-title" className="text-lg font-semibold text-text-primary">
            Tu carrito ({itemCount})
          </h2>
          <button
            onClick={onClose}
            className="p-[var(--space-2)] text-text-tertiary hover:text-text-primary transition-colors duration-[var(--duration-micro)]"
            aria-label="Cerrar carrito"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <EmptyState
              variant="cart"
              title="Tu carrito está esperando su primera historia"
              description="Explora nuestro catálogo y encuentra tu próxima gran lectura."
              actionLabel="Explorar bestsellers"
              onAction={onClose}
            />
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-[var(--space-6)]">
              <div className="pt-[var(--space-4)]">
                <FreeShippingProgress subtotal={subtotal} />
              </div>

              <div className="pt-[var(--space-4)]">
                {items.map((item) => (
                  <CartItem
                    key={`${item.book.id}-${item.format}`}
                    item={item}
                    onUpdateQuantity={updateQuantity}
                    onRemove={removeItem}
                  />
                ))}
              </div>

              <div className="py-[var(--space-4)]">
                {coupon ? (
                  <div className="flex items-center justify-between bg-success-bg rounded-[var(--radius-sm)] px-[var(--space-3)] py-[var(--space-2)]">
                    <span className="flex items-center gap-[var(--space-2)] text-xs font-medium text-success">
                      <Tag className="w-3.5 h-3.5" aria-hidden="true" />
                      {coupon} aplicado
                    </span>
                    <button
                      onClick={removeCoupon}
                      className="text-xs text-success underline decoration-[1.5px] underline-offset-[2px]"
                    >
                      Quitar
                    </button>
                  </div>
                ) : !couponOpen ? (
                  <button
                    onClick={() => setCouponOpen(true)}
                    className="flex items-center gap-[var(--space-2)] text-sm text-brand-primary font-medium hover:underline decoration-[1.5px] underline-offset-[3px]"
                  >
                    <Tag className="w-4 h-4" aria-hidden="true" />
                    ¿Tienes un cupón?
                  </button>
                ) : (
                  <div className="flex gap-[var(--space-2)]">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Código de cupón"
                      className="flex-1 h-[var(--height-btn-sm)] px-[var(--space-3)] rounded-[var(--radius-sm)] border border-border-input text-sm text-text-primary bg-bg-surface focus:border-brand-primary focus:outline-none"
                    />
                    <Button size="sm" variant="secondary" onClick={applyCoupon}>
                      Aplicar
                    </Button>
                  </div>
                )}
                {couponError && (
                  <p className="mt-[var(--space-2)] text-xs text-error" role="alert">
                    {couponError}
                  </p>
                )}
              </div>
            </div>

            <div className="border-t border-border-subtle p-[var(--space-6)] pb-[calc(var(--space-6)+env(safe-area-inset-bottom))] bg-bg-surface">
              <div className="flex flex-col gap-[var(--space-2)] mb-[var(--space-4)]">
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">Subtotal</span>
                  <span className="text-text-primary font-medium">{formatArs(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-success">Descuento (10%)</span>
                    <span className="text-success font-medium">-{formatArs(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">Envío estimado</span>
                  <span className="text-text-primary font-medium">
                    {shipping === 0 ? 'Gratis' : formatArs(shipping)}
                  </span>
                </div>
                <div className="flex justify-between text-xl font-bold pt-[var(--space-2)] border-t border-border-subtle">
                  <span className="text-text-primary">Total</span>
                  <span className="text-text-primary">{formatArs(total)}</span>
                </div>
              </div>

              <Link href="/checkout" onClick={onClose} className="block">
                <Button size="lg" className="w-full">
                  Finalizar compra
                </Button>
              </Link>
              <button
                onClick={onClose}
                className="w-full mt-[var(--space-3)] text-sm text-text-secondary hover:text-brand-primary transition-colors duration-[var(--duration-micro)] text-center"
              >
                Seguir comprando
              </button>

              <div className="mt-[var(--space-5)] pt-[var(--space-5)] border-t border-border-subtle">
                <TrustBadges compact />
              </div>
            </div>
          </>
        )}
      </div>

      <style jsx>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  )
}