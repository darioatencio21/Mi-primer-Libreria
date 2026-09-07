'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Heart, ShoppingCart } from 'lucide-react'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { BookCover } from './BookCover'
import { cn } from '@/lib/utils'
import { formatArs } from '@/lib/format'
import { hasBookDiscount, getBookDisplayPrice, getDefaultFormatType } from '@/lib/book-price'
import { useCart, useWishlist, useUi } from '@/lib/store'
import type { Book } from '@/lib/types'

interface BookCardProps {
  book: Book
  className?: string
}

export function BookCard({ book, className }: BookCardProps) {
  const [wishlistAnimating, setWishlistAnimating] = useState(false)
  const addItem = useCart((state) => state.addItem)
  const openCart = useUi((state) => state.openCart)
  const toggleWishlist = useWishlist((state) => state.toggle)
  const isWishlisted = useWishlist((state) => state.ids.includes(book.id))

  const isOutOfStock = book.stock === 0
  const showDiscount = hasBookDiscount(book)
  const displayPrice = getBookDisplayPrice(book)
  const defaultFormat = getDefaultFormatType(book)

  const handleWishlist = () => {
    setWishlistAnimating(true)
    toggleWishlist(book.id)
    setTimeout(() => setWishlistAnimating(false), 300)
  }

  const handleAddToCart = () => {
    if (!defaultFormat) return
    addItem(book, defaultFormat, 1)
    openCart()
  }

  return (
    <article
      className={cn(
        'group relative flex flex-col bg-bg-surface border border-border-subtle rounded-[var(--radius-lg)] p-[var(--space-4)] transition-all',
        'hover:-translate-y-1.5 hover:shadow-[var(--shadow-md)] hover:border-border-hover',
        className
      )}
      style={{ transitionDuration: 'var(--duration-card)', transitionTimingFunction: 'var(--ease-out-quint)' }}
    >
      <Link
        href={`/libros/${book.category.slug}/${book.slug}`}
        className="relative aspect-[3/4] rounded-[var(--radius-md)] bg-bg-muted overflow-hidden mb-[var(--space-4)]"
      >
        <BookCover
          isbn={book.isbn}
          coverImage={book.coverImage}
          title={book.title}
          author={book.author.name}
          sizes="(max-width: 480px) 50vw, (max-width: 1024px) 33vw, 20vw"
          className={cn(
            'p-[var(--space-2)] transition-transform duration-[var(--duration-card)]',
            isOutOfStock && 'opacity-50',
            'group-hover:scale-[1.03]'
          )}
        />

        <div className="absolute top-[var(--space-2)] left-[var(--space-2)] z-10 flex flex-col items-start gap-[var(--space-1)]">
          {book.discountPercentage && (
            <Badge variant="discount">-{book.discountPercentage}%</Badge>
          )}
          {book.isNew && <Badge variant="new">Nuevo</Badge>}
          {book.isBestseller && <Badge variant="bestseller">Bestseller</Badge>}
          {book.stock > 0 && book.stock <= 5 && (
            <Badge variant="low-stock">últimos ejemplares</Badge>
          )}
          {isOutOfStock && (
            <span className="inline-flex items-center h-6 px-[10px] rounded-[var(--radius-sm)] text-xs font-semibold bg-bg-muted text-text-tertiary">
              Agotado
            </span>
          )}
        </div>

        <button
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            handleWishlist()
          }}
          className={cn(
            'absolute top-[var(--space-2)] right-[var(--space-2)] z-10 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center shadow-[var(--shadow-xs)] transition-all duration-[var(--duration-micro)]',
            'hover:bg-white hover:shadow-[var(--shadow-sm)]',
            wishlistAnimating && 'animate-[heart-pop_300ms_ease-out]'
          )}
          aria-pressed={isWishlisted}
          aria-label={isWishlisted ? 'Quitar de lista de deseos' : 'Agregar a lista de deseos'}
        >
          <Heart
            className={cn(
              'w-4 h-4 transition-colors duration-[var(--duration-micro)]',
              isWishlisted ? 'fill-accent-terracotta text-accent-terracotta' : 'text-text-secondary'
            )}
          />
        </button>
      </Link>

<div className="flex flex-col flex-1 gap-[var(--space-1)]">
          <p className="text-xs text-text-tertiary">{book.author.name}</p>
          <Link href={`/libros/${book.category.slug}/${book.slug}`}>
            <h3 className="text-sm font-semibold text-text-primary line-clamp-2 hover:underline decoration-[1.5px] underline-offset-[3px]">
              {book.title}
            </h3>
          </Link>

        <div className="flex items-center gap-[var(--space-2)] mt-auto pt-[var(--space-3)]">
          {showDiscount ? (
            <>
              <span className="text-sm text-text-tertiary line-through">
                {formatArs(book.price)}
              </span>
              <span className="text-lg font-bold text-text-primary">
                {formatArs(displayPrice)}
              </span>
            </>
          ) : (
            <span className="text-lg font-bold text-text-primary">
              {formatArs(displayPrice)}
            </span>
          )}
        </div>
      </div>

      <div className="mt-[var(--space-3)]">
        {isOutOfStock ? (
          <Button variant="secondary" size="sm" className="w-full" disabled>
            Avisarme cuando esté disponible
          </Button>
        ) : (
          <Button
            variant="secondary"
            size="sm"
            className={cn('w-full transition-all duration-[var(--duration-micro)]')}
            onClick={handleAddToCart}
          >
            Agregar al carrito
          </Button>
        )}
      </div>
    </article>
  )
}