'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowRight, Tag } from 'lucide-react'
import { useCart, selectItemCount, selectTotals } from '@/lib/store'
import { CartItem } from '@/components/cart/CartItem'
import { FreeShippingProgress } from '@/components/cart/FreeShippingProgress'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { TrustBadges } from '@/components/ui/TrustBadges'
import { formatArs } from '@/lib/format'

export default function CarritoPage() {
  const router = useRouter()
  const items = useCart((state) => state.items)
  const coupon = useCart((state) => state.coupon)
  const updateQuantity = useCart((state) => state.updateQuantity)
  const removeItem = useCart((state) => state.removeItem)
  const setCoupon = useCart((state) => state.setCoupon)
  const removeCoupon = useCart((state) => state.removeCoupon)

  const [couponOpen, setCouponOpen] = useState(false)
  const [couponCode, setCouponCode] = useState('')
  const [couponError, setCouponError] = useState('')

  const itemCount = selectItemCount(items)
  const { subtotal, discount, shipping, total } = selectTotals(items, coupon)

  const applyCoupon = () => {
    if (setCoupon(couponCode)) {
      setCouponError('')
      setCouponOpen(false)
      setCouponCode('')
    } else {
      setCouponError('Ese código no es válido o ya venció. Probá con NOVA10.')
    }
  }

  return (
    <div className="mx-auto max-w-[var(--container-max)] px-[var(--space-4)] md:px-[var(--space-10)] lg:px-[var(--space-16)] py-[var(--space-10)] md:py-[var(--space-16)]">
      <h1 className="text-2xl md:text-4xl font-display font-normal text-text-primary tracking-[var(--tracking-4xl)] mb-[var(--space-2)]">
        Tu carrito
      </h1>
      <p className="text-sm text-text-secondary mb-[var(--space-8)] md:mb-[var(--space-12)]">
        {itemCount} {itemCount === 1 ? 'artículo' : 'artículos'} en tu carrito
      </p>

      {items.length === 0 ? (
        <EmptyState
          variant="cart"
          title="Tu carrito está esperando su primera historia"
          description="Explora nuestro catálogo y encuentra tu próxima gran lectura."
          actionLabel="Explorar catálogo"
          onAction={() => {
            router.push('/libros')
          }}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-[var(--space-10)] items-start">
          <div>
            <div className="mb-[var(--space-6)]">
              <FreeShippingProgress subtotal={subtotal} />
            </div>
            <div className="divide-y divide-border-subtle">
              {items.map((item) => (
                <CartItem
                  key={`${item.book.id}-${item.format}`}
                  item={item}
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeItem}
                />
              ))}
            </div>
          </div>

          <aside className="bg-bg-surface border border-border-subtle rounded-[var(--radius-lg)] p-[var(--space-6)] sticky top-[calc(var(--height-header)+var(--space-4))]">
            <h2 className="text-base font-semibold text-text-primary mb-[var(--space-4)]">
              Resumen del pedido
            </h2>

            <div className="flex flex-col gap-[var(--space-2)] mb-[var(--space-6)]">
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
              <div className="flex justify-between text-xl font-bold pt-[var(--space-3)] border-t border-border-subtle">
                <span className="text-text-primary">Total</span>
                <span className="text-text-primary">{formatArs(total)}</span>
              </div>
            </div>

            <div className="mb-[var(--space-5)]">
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
                    placeholder="Ingresá tu cupón"
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

            <Link href="/checkout" className="block">
              <Button size="lg" className="w-full">
                Finalizar compra
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link
              href="/libros"
              className="block text-center mt-[var(--space-3)] text-sm text-text-secondary hover:text-brand-primary transition-colors duration-[var(--duration-micro)]"
            >
              Seguir comprando
            </Link>

            <div className="mt-[var(--space-6)] pt-[var(--space-6)] border-t border-border-subtle">
              <TrustBadges />
            </div>
          </aside>
        </div>
      )}
    </div>
  )
}
