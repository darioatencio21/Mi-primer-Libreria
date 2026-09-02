'use client'

import { useState, useCallback } from 'react'
import { Heart, ShoppingCart, Minus, Plus } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useCart, useWishlist, useUi } from '@/lib/store'
import { cn } from '@/lib/utils'
import { formatArs } from '@/lib/format'
import type { Book, BookFormat } from '@/lib/types'

const FORMAT_LABELS: Record<BookFormat['type'], string> = {
  hardcover: 'Tapa dura',
  paperback: 'Tapa blanda',
  ebook: 'Ebook',
  audiobook: 'Audiolibro',
}

interface ProductBuyBoxProps {
  book: Book
}

export function ProductBuyBox({ book }: ProductBuyBoxProps) {
  const [selectedFormat, setSelectedFormat] = useState<BookFormat['type']>(
    book.formats.some((f) => f.type === 'paperback') ? 'paperback' : book.formats[0]?.type ?? 'paperback'
  )
  const [quantity, setQuantity] = useState(1)
  const addItem = useCart((state) => state.addItem)
  const openCart = useUi((state) => state.openCart)
  const toggleWishlist = useWishlist((state) => state.toggle)
  const isWishlisted = useWishlist((state) => state.ids.includes(book.id))

  const currentFormat =
    book.formats.find((f) => f.type === selectedFormat) || book.formats[0]

  const currentPrice =
    selectedFormat === 'paperback' && book.discountPrice
      ? book.discountPrice
      : currentFormat?.price ?? book.price

  const handleAddToCart = useCallback(() => {
    addItem(book, selectedFormat, quantity)
    openCart()
  }, [addItem, book, selectedFormat, quantity, openCart])

  return (
    <>
      <div className="flex items-baseline gap-[var(--space-3)] mb-[var(--space-6)]">
        {book.discountPrice && selectedFormat === 'paperback' ? (
          <>
            <span className="text-sm text-text-tertiary line-through">
              {formatArs(book.price)}
            </span>
            <span className="text-2xl font-bold text-text-primary">
              {formatArs(book.discountPrice)}
            </span>
            <BadgeDiscount percentage={book.discountPercentage} />
          </>
        ) : (
          <span className="text-2xl font-bold text-text-primary">
            {formatArs(currentPrice)}
          </span>
        )}
      </div>

      <div className="mb-[var(--space-6)]">
        <p className="text-sm font-medium text-text-primary mb-[var(--space-3)]">Formato</p>
        <div className="flex flex-wrap gap-[var(--space-2)]">
          {book.formats.map((format) => (
            <button
              key={format.type}
              onClick={() => setSelectedFormat(format.type)}
              className={cn(
                'px-[var(--space-4)] py-[var(--space-3)] rounded-[var(--radius-md)] text-sm font-medium border transition-all duration-[var(--duration-micro)]',
                selectedFormat === format.type
                  ? 'border-brand-primary bg-brand-primary-light text-brand-primary'
                  : 'border-border-subtle text-text-secondary hover:border-border-hover hover:text-text-primary'
              )}
            >
              {FORMAT_LABELS[format.type]}
              <span className="ml-[var(--space-2)] text-xs text-text-tertiary">
                {formatArs(format.price)}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-[var(--space-3)] sm:gap-[var(--space-4)] mb-[var(--space-6)]">
        <div className="flex items-center gap-[var(--space-3)]">
          <div className="flex items-center border border-border-subtle rounded-[var(--radius-md)] overflow-hidden">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-11 h-11 flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-bg-muted transition-colors duration-[var(--duration-micro)]"
              aria-label="Disminuir cantidad"
              disabled={quantity <= 1}
            >
              <Minus className="w-4 h-4" />
            </button>
            <span
              className="w-12 text-center text-sm font-semibold text-text-primary"
              aria-label={`Cantidad: ${quantity}`}
            >
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(Math.min(10, quantity + 1))}
              className="w-11 h-11 flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-bg-muted transition-colors duration-[var(--duration-micro)]"
              aria-label="Aumentar cantidad"
              disabled={quantity >= 10}
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => toggleWishlist(book.id)}
            className={cn(
              'w-[var(--height-btn-lg)] h-[var(--height-btn-lg)] flex items-center justify-center rounded-[var(--radius-md)] border transition-all duration-[var(--duration-micro)]',
              isWishlisted
                ? 'border-accent-terracotta bg-accent-terracotta-light'
                : 'border-border-subtle hover:border-border-hover'
            )}
            aria-pressed={isWishlisted}
            aria-label={isWishlisted ? 'Quitar de lista de deseos' : 'Agregar a lista de deseos'}
          >
            <Heart
              className={cn(
                'w-5 h-5 transition-colors duration-[var(--duration-micro)]',
                isWishlisted ? 'fill-accent-terracotta text-accent-terracotta' : 'text-text-secondary'
              )}
            />
          </button>
        </div>

        <Button
          size="lg"
          className="w-full sm:flex-1"
          icon={<ShoppingCart className="w-5 h-5" />}
          onClick={handleAddToCart}
        >
          Agregar al carrito
        </Button>
      </div>
    </>
  )
}

function BadgeDiscount({ percentage }: { percentage?: number }) {
  if (!percentage) return null
  return (
    <span className="inline-flex items-center h-6 px-[10px] rounded-[var(--radius-sm)] bg-accent-gold/15 text-accent-gold text-xs font-semibold">
      -{percentage}%
    </span>
  )
}