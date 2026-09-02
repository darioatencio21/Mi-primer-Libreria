'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Heart, Eye, Star } from 'lucide-react'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { BookCover } from './BookCover'
import { cn } from '@/lib/utils'
import { formatArs } from '@/lib/format'
import { hasBookDiscount, getBookDisplayPrice } from '@/lib/book-price'
import type { Book } from '@/lib/types'

interface BookCardProps {
  book: Book
  onAddToCart?: (book: Book) => void
  onToggleWishlist?: (bookId: string) => void
  isWishlisted?: boolean
  className?: string
}

export function BookCard({
  book,
  onAddToCart,
  onToggleWishlist,
  isWishlisted = false,
  className,
}: BookCardProps) {
  const [wishlistAnimating, setWishlistAnimating] = useState(false)
  const isOutOfStock = book.stock === 0
  const showDiscount = hasBookDiscount(book)
  const displayPrice = getBookDisplayPrice(book)

  const handleWishlist = () => {
    setWishlistAnimating(true)
    onToggleWishlist?.(book.id)
    setTimeout(() => setWishlistAnimating(false), 300)
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

        <div className="absolute top-[var(--space-2)] left-[var(--space-2)] flex flex-col gap-[var(--space-1)]">
          {book.discountPercentage && (
            <Badge variant="discount">-{book.discountPercentage}%</Badge>
          )}
          {book.isNew && <Badge variant="new">Nuevo</Badge>}
          {book.isBestseller && <Badge variant="bestseller">Bestseller</Badge>}
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
            'absolute top-[var(--space-2)] right-[var(--space-2)] w-9 h-9 rounded-full bg-white/90 flex items-center justify-center shadow-[var(--shadow-xs)] transition-all duration-[var(--duration-micro)]',
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

        <div className="absolute bottom-[var(--space-3)] left-1/2 -translate-x-1/2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-[var(--duration-micro)]">
          <Button variant="secondary" size="sm" className="bg-white shadow-[var(--shadow-sm)] whitespace-nowrap">
            <Eye className="w-4 h-4" />
            Vista rápida
          </Button>
        </div>
      </Link>

      <div className="flex flex-col flex-1 gap-[var(--space-1)]">
        <p className="text-xs text-text-tertiary">{book.author.name}</p>
        <Link href={`/libros/${book.category.slug}/${book.slug}`}>
          <h3 className="text-sm font-semibold text-text-primary line-clamp-2 hover:underline decoration-[1.5px] underline-offset-[3px]">
            {book.title}
          </h3>
        </Link>

        <div className="flex items-center gap-[var(--space-1)] mt-[var(--space-1)]">
          <div className="flex items-center" aria-label={`${book.rating} de 5 estrellas`}>
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={cn(
                  'w-3 h-3',
                  i < Math.round(book.rating)
                    ? 'fill-accent-gold text-accent-gold'
                    : 'text-border-subtle'
                )}
                aria-hidden="true"
              />
            ))}
          </div>
          <span className="text-xs text-text-tertiary">({book.reviewCount})</span>
        </div>

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
            className={cn(
              'w-full transition-all duration-[var(--duration-micro)]',
              'group-hover:bg-brand-primary group-hover:text-text-on-brand group-hover:border-brand-primary'
            )}
            onClick={() => onAddToCart?.(book)}
          >
            Agregar al carrito
          </Button>
        )}
      </div>
    </article>
  )
}
