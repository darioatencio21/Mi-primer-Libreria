'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Heart, Eye, Star, ShoppingCart, ArrowRight } from 'lucide-react'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { BookCover } from './BookCover'
import { Modal } from '../ui/Modal'
import { cn } from '@/lib/utils'
import { formatArs } from '@/lib/format'
import { hasBookDiscount, getBookDisplayPrice, getDefaultFormatType } from '@/lib/book-price'
import { useCart, useWishlist, useUi } from '@/lib/store'
import type { Book, BookFormat, ReviewPreview } from '@/lib/types'

const FORMAT_LABELS: Record<BookFormat['type'], string> = {
  hardcover: 'Tapa dura',
  paperback: 'Tapa blanda',
  ebook: 'Ebook',
  audiobook: 'Audiolibro',
}

interface BookCardProps {
  book: Book
  className?: string
  reviewPreview?: ReviewPreview
}

export function BookCard({ book, className, reviewPreview }: BookCardProps) {
  const [wishlistAnimating, setWishlistAnimating] = useState(false)
  const [quickViewOpen, setQuickViewOpen] = useState(false)
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

        <div className="absolute top-[var(--space-2)] left-[var(--space-2)] flex flex-col gap-[var(--space-1)]">
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
          <Button
            variant="secondary"
            size="sm"
            className="bg-white shadow-[var(--shadow-sm)] whitespace-nowrap"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setQuickViewOpen(true)
            }}
          >
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
                  'w-3.5 h-3.5',
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

        {reviewPreview && (
          <p className="text-[11px] italic leading-snug text-text-tertiary line-clamp-2 mt-[var(--space-2)]">
            &ldquo;{reviewPreview.content}&rdquo;
          </p>
        )}

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

      {defaultFormat && (
        <QuickViewModal
          book={book}
          isOpen={quickViewOpen}
          onClose={() => setQuickViewOpen(false)}
        />
      )}
    </article>
  )
}

function QuickViewModal({
  book,
  isOpen,
  onClose,
}: {
  book: Book
  isOpen: boolean
  onClose: () => void
}) {
  const [selectedFormat, setSelectedFormat] = useState<BookFormat['type']>(
    () => getDefaultFormatType(book) ?? book.formats[0]?.type ?? 'paperback'
  )
  const addItem = useCart((state) => state.addItem)
  const openCart = useUi((state) => state.openCart)

  const currentFormat = book.formats.find((f) => f.type === selectedFormat)
  const hasStock = (currentFormat?.stock ?? 0) > 0

  const handleAdd = () => {
    addItem(book, selectedFormat, 1)
    openCart()
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Vista rápida" size="large">
      <div className="grid grid-cols-1 sm:grid-cols-[160px_1fr] gap-[var(--space-6)]">
        <div className="aspect-[3/4] rounded-[var(--radius-md)] bg-bg-muted overflow-hidden relative">
          <BookCover
            isbn={book.isbn}
            coverImage={book.coverImage}
            title={book.title}
            author={book.author.name}
            sizes="160px"
            className="p-[var(--space-2)]"
          />
        </div>

        <div className="min-w-0">
          <p className="text-xs text-text-tertiary mb-[var(--space-1)]">
            {book.author.name} · {book.category.name}
          </p>
          <Link href={`/libros/${book.category.slug}/${book.slug}`} onClick={onClose}>
            <h3 className="text-xl font-display font-medium text-text-primary leading-tight hover:underline decoration-[1.5px] underline-offset-[3px]">
              {book.title}
            </h3>
          </Link>

          <div className="flex items-center gap-[var(--space-1)] mt-[var(--space-2)]">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={cn(
                  'w-4 h-4',
                  i < Math.round(book.rating)
                    ? 'fill-accent-gold text-accent-gold'
                    : 'text-border-subtle'
                )}
                aria-hidden="true"
              />
            ))}
            <span className="text-xs text-text-secondary ml-[var(--space-1)]">
              {book.rating} ({book.reviewCount})
            </span>
          </div>

          <p className="text-sm text-text-secondary leading-relaxed line-clamp-3 mt-[var(--space-3)]">
            {book.description}
          </p>

          {book.author.bio && (
            <p className="text-xs text-text-tertiary leading-relaxed line-clamp-2 mt-[var(--space-2)]">
              Sobre {book.author.name}: {book.author.bio}
            </p>
          )}

          <div className="flex flex-wrap gap-[var(--space-2)] mt-[var(--space-4)]">
            {book.formats.map((format) => {
              const active = selectedFormat === format.type
              const soldOut = format.stock === 0
              return (
                <button
                  key={format.type}
                  onClick={() => setSelectedFormat(format.type)}
                  disabled={soldOut}
                  className={cn(
                    'px-[var(--space-3)] py-[var(--space-2)] rounded-[var(--radius-md)] text-xs font-medium border transition-all duration-[var(--duration-micro)]',
                    active
                      ? 'border-brand-primary bg-brand-primary-light text-brand-primary'
                      : 'border-border-subtle text-text-secondary',
                    soldOut && 'opacity-40 cursor-not-allowed'
                  )}
                >
                  {FORMAT_LABELS[format.type]}
                  <span className="block text-[11px] text-text-tertiary">
                    {soldOut ? 'Sin stock' : formatArs(format.price)}
                  </span>
                </button>
              )
            })}
          </div>

          <div className="flex items-center gap-[var(--space-3)] mt-[var(--space-5)]">
            <Button
              size="lg"
              className="flex-1"
              disabled={!hasStock}
              icon={<ShoppingCart className="w-5 h-5" />}
              onClick={handleAdd}
            >
              Agregar al carrito
            </Button>
            <Link href={`/libros/${book.category.slug}/${book.slug}`} onClick={onClose}>
              <Button variant="secondary" size="lg">
                Ver ficha
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Modal>
  )
}