'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { X, Tag } from 'lucide-react'
import { CartItem } from './CartItem'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { formatArs } from '@/lib/format'
import type { CartItem as CartItemType } from '@/lib/types'

const MOCK_CART_ITEMS: CartItemType[] = [
  {
    book: {
      id: '1',
      title: 'Cien años de soledad',
      slug: 'cien-anos-de-soledad',
      author: { id: 'a1', name: 'Gabriel García Márquez', slug: 'garcia-marquez', bio: '', bookCount: 12 },
      category: { id: 'c1', name: 'Ficción', slug: 'ficcion', description: '', icon: '', bookCount: 0 },
      description: 'La obra maestra del realismo mágico.',
      price: 24.99,
      discountPrice: 19.99,
      discountPercentage: 20,
      formats: [
        { type: 'paperback', price: 19.99, stock: 15 },
        { type: 'hardcover', price: 34.99, stock: 8 },
      ],
      coverImage: '/placeholder-book.svg',
      images: [],
      isbn: '978-0-00-000000-0',
      publisher: 'Editorial Sudamericana',
      pages: 471,
      language: 'Español',
      publishDate: '1967-05-30',
      rating: 4.8,
      reviewCount: 2847,
      stock: 15,
      isBestseller: true,
      isNew: false,
      tags: ['realismo mágico', 'clásico'],
    },
    format: 'paperback',
    quantity: 1,
  },
  {
    book: {
      id: '3',
      title: 'Kafka en la orilla',
      slug: 'kafka-en-la-orilla',
      author: { id: 'a2', name: 'Haruki Murakami', slug: 'haruki-murakami', bio: '', bookCount: 15 },
      category: { id: 'c1', name: 'Ficción', slug: 'ficcion', description: '', icon: '', bookCount: 0 },
      description: 'Un viaje surrealista entre dos mundos.',
      price: 26.99,
      formats: [{ type: 'hardcover', price: 26.99, stock: 12 }],
      coverImage: '/placeholder-book.svg',
      images: [],
      isbn: '978-0-00-000000-2',
      publisher: 'Tusquets Editores',
      pages: 505,
      language: 'Español',
      publishDate: '2002-09-12',
      rating: 4.6,
      reviewCount: 1456,
      stock: 12,
      isBestseller: true,
      isNew: false,
      tags: ['surrealismo', 'contemporáneo'],
    },
    format: 'hardcover',
    quantity: 2,
  },
]

interface CartDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const [items, setItems] = useState<CartItemType[]>(MOCK_CART_ITEMS)
  const [couponOpen, setCouponOpen] = useState(false)
  const [couponCode, setCouponCode] = useState('')
  const [couponApplied, setCouponApplied] = useState(false)
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

  const updateQuantity = useCallback((bookId: string, quantity: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.book.id === bookId ? { ...item, quantity } : item
      )
    )
  }, [])

  const removeItem = useCallback((bookId: string) => {
    setItems((prev) => prev.filter((item) => item.book.id !== bookId))
  }, [])

  const applyCoupon = () => {
    if (couponCode.toUpperCase() === 'TUYA10') {
      setCouponApplied(true)
      setCouponError('')
    } else {
      setCouponError('Ese código no es válido o ya venció.')
    }
  }

  const subtotal = items.reduce((sum, item) => {
    const price = item.book.formats.find((f) => f.type === item.format)?.price || item.book.price
    return sum + price * item.quantity
  }, 0)

  const discount = couponApplied ? subtotal * 0.1 : 0
  const shipping = subtotal > 50 ? 0 : 5.99
  const total = subtotal - discount + shipping
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

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
              {items.map((item) => (
                <CartItem
                  key={item.book.id}
                  item={item}
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeItem}
                />
              ))}

              <div className="py-[var(--space-4)]">
                {!couponOpen && !couponApplied ? (
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
                      disabled={couponApplied}
                      className="flex-1 h-[var(--height-btn-sm)] px-[var(--space-3)] rounded-[var(--radius-sm)] border border-border-input text-sm text-text-primary bg-bg-surface focus:border-brand-primary focus:outline-none disabled:bg-bg-muted disabled:text-text-tertiary"
                    />
                    {!couponApplied && (
                      <Button size="sm" variant="secondary" onClick={applyCoupon}>
                        Aplicar
                      </Button>
                    )}
                    {couponApplied && (
                      <span className="flex items-center text-xs font-medium text-success">
                        ✓ Aplicado
                      </span>
                    )}
                  </div>
                )}
                {couponError && (
                  <p className="mt-[var(--space-1)] text-xs text-error" role="alert">
                    {couponError}
                  </p>
                )}
              </div>
            </div>

            <div className="border-t border-border-subtle p-[var(--space-6)] bg-bg-surface">
              <div className="flex flex-col gap-[var(--space-2)] mb-[var(--space-4)]">
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">Subtotal</span>
                  <span className="text-text-primary font-medium">{formatArs(subtotal)}</span>
                </div>
                {couponApplied && (
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

