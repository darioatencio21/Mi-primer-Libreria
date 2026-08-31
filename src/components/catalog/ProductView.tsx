'use client'

import { useState } from 'react'
import { Star, Heart, ShoppingCart, Truck, RotateCcw, ShieldCheck, Minus, Plus } from 'lucide-react'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { Accordion } from '@/components/ui/Accordion'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { BookCard } from '@/components/product/BookCard'
import { BookCover } from '@/components/product/BookCover'
import { Carousel } from '@/components/ui/Carousel'
import { cn } from '@/lib/utils'
import { formatArs } from '@/lib/format'
import type { Book, BookFormat } from '@/lib/types'

export interface ReviewView {
  id: string
  userName: string
  rating: number
  date: string
  title: string
  content: string
  helpful: number
}

const FORMAT_LABELS: Record<BookFormat['type'], string> = {
  hardcover: 'Tapa dura',
  paperback: 'Tapa blanda',
  ebook: 'Ebook',
  audiobook: 'Audiolibro',
}

interface ProductViewProps {
  book: Book
  reviews: ReviewView[]
  related: Book[]
  categoryName: string
}

export function ProductView({ book, reviews, related, categoryName }: ProductViewProps) {
  const [selectedFormat, setSelectedFormat] = useState<BookFormat['type']>(
    book.formats[0]?.type ?? 'paperback'
  )
  const [quantity, setQuantity] = useState(1)
  const [activeImage, setActiveImage] = useState(0)
  const [isWishlisted, setIsWishlisted] = useState(false)

  const images = book.images.length > 0 ? book.images : [book.coverImage]
  const currentFormat = book.formats.find((f) => f.type === selectedFormat) || book.formats[0]
  const currentPrice = currentFormat?.price ?? book.price

  const showDiscount = book.discountPrice != null && selectedFormat === 'paperback'
  const displayPrice = showDiscount ? book.discountPrice! : currentPrice

  const ratingDistribution = [
    { stars: 5, percentage: Math.round((book.reviewCount || 1) * 0.7) },
    { stars: 4, percentage: Math.round((book.reviewCount || 1) * 0.2) },
    { stars: 3, percentage: 5 },
    { stars: 2, percentage: 3 },
    { stars: 1, percentage: 2 },
  ]

  return (
    <div className="mx-auto max-w-[var(--container-max)] px-[var(--space-6)] md:px-[var(--space-10)] lg:px-[var(--space-16)] py-[var(--space-12)]">
      <Breadcrumb
        items={[
          { label: 'Inicio', href: '/' },
          { label: categoryName, href: `/libros/${book.category.slug}` },
          { label: book.title },
        ]}
        className="mb-[var(--space-8)]"
      />

      <div className="grid grid-cols-1 lg:grid-cols-[45%_55%] gap-[var(--space-12)] lg:gap-[var(--space-16)]">
        <div className="flex gap-[var(--space-4)]">
          <div className="hidden md:flex flex-col gap-[var(--space-3)]">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(i)}
                className={cn(
                  'w-16 h-20 rounded-[var(--radius-sm)] bg-bg-muted overflow-hidden border-2 transition-colors duration-[var(--duration-micro)]',
                  activeImage === i ? 'border-brand-primary' : 'border-transparent hover:border-border-hover'
                )}
              >
                <BookCover
                  isbn={book.isbn}
                  coverImage={img}
                  title={book.title}
                  author={book.author.name}
                  sizes="64px"
                  variant="natural"
                  width={64}
                  height={80}
                  className="w-full h-full object-contain p-1"
                />
              </button>
            ))}
          </div>

          <div className="flex-1 relative aspect-[3/4] rounded-[var(--radius-lg)] bg-bg-muted overflow-hidden">
            <BookCover
              isbn={book.isbn}
              coverImage={images[activeImage] !== '/placeholder-book.svg' ? images[activeImage] : book.coverImage}
              title={book.title}
              author={book.author.name}
              sizes="(max-width: 1024px) 100vw, 45vw"
              className="p-[var(--space-8)]"
              priority
            />
          </div>
        </div>

        <div className="flex flex-col">
          <h1 className="text-3xl md:text-4xl font-display font-medium text-text-primary tracking-[var(--tracking-4xl)] mb-[var(--space-3)]">
            {book.title}
          </h1>

          <a
            href={`/autores/${book.author.slug}`}
            className="text-lg text-brand-primary hover:underline decoration-[1.5px] underline-offset-[3px] mb-[var(--space-4)]"
          >
            {book.author.name}
          </a>

          <div className="flex items-center gap-[var(--space-3)] mb-[var(--space-6)]">
            <div className="flex items-center gap-[var(--space-1)]" aria-label={`${book.rating} de 5 estrellas`}>
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
            </div>
            <span className="text-sm text-text-secondary">{book.rating}</span>
            <a
              href="#reviews"
              className="text-sm text-text-tertiary hover:text-brand-primary hover:underline decoration-[1.5px] underline-offset-[3px]"
            >
              ({book.reviewCount} reseñas)
            </a>
          </div>

          <div className="flex items-baseline gap-[var(--space-3)] mb-[var(--space-6)]">
            {showDiscount ? (
              <>
                <span className="text-sm text-text-tertiary line-through">
                  {formatArs(book.price)}
                </span>
                <span className="text-2xl font-bold text-text-primary">
                  {formatArs(book.discountPrice!)}
                </span>
                <Badge variant="discount">-{book.discountPercentage}%</Badge>
              </>
            ) : (
              <span className="text-2xl font-bold text-text-primary">
                {formatArs(displayPrice)}
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

          <div className="flex items-center gap-[var(--space-4)] mb-[var(--space-6)]">
            <div className="flex items-center border border-border-subtle rounded-[var(--radius-md)] overflow-hidden">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-11 h-11 flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-bg-muted transition-colors duration-[var(--duration-micro)]"
                aria-label="Disminuir cantidad"
                disabled={quantity <= 1}
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-12 text-center text-sm font-semibold text-text-primary" aria-label={`Cantidad: ${quantity}`}>
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

            <Button
              size="lg"
              className="flex-1"
              icon={<ShoppingCart className="w-5 h-5" />}
            >
              Agregar al carrito
            </Button>

            <button
              onClick={() => setIsWishlisted(!isWishlisted)}
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

          <div className="flex items-center gap-[var(--space-6)] py-[var(--space-4)] border-t border-b border-border-subtle mb-[var(--space-6)]">
            <div className="flex items-center gap-[var(--space-2)]">
              <Truck className="w-4 h-4 text-brand-primary" aria-hidden="true" />
              <span className="text-xs text-text-secondary">Envío 24-48h</span>
            </div>
            <div className="flex items-center gap-[var(--space-2)]">
              <RotateCcw className="w-4 h-4 text-brand-primary" aria-hidden="true" />
              <span className="text-xs text-text-secondary">30 días devolución</span>
            </div>
            <div className="flex items-center gap-[var(--space-2)]">
              <ShieldCheck className="w-4 h-4 text-brand-primary" aria-hidden="true" />
              <span className="text-xs text-text-secondary">Pago seguro</span>
            </div>
          </div>

          <div>
            <Accordion title="Descripción" defaultOpen>
              <p className="text-sm text-text-secondary leading-relaxed max-w-[var(--container-text)]">
                {book.description}
              </p>
            </Accordion>

            <Accordion title="Ficha técnica">
              <dl className="grid grid-cols-2 gap-y-[var(--space-3)] gap-x-[var(--space-6)] text-sm">
                <dt className="text-text-tertiary">Editorial</dt>
                <dd className="text-text-primary">{book.publisher}</dd>
                <dt className="text-text-tertiary">ISBN</dt>
                <dd className="text-text-primary">{book.isbn}</dd>
                <dt className="text-text-tertiary">Páginas</dt>
                <dd className="text-text-primary">{book.pages}</dd>
                <dt className="text-text-tertiary">Idioma</dt>
                <dd className="text-text-primary">{book.language}</dd>
                <dt className="text-text-tertiary">Dimensiones</dt>
                <dd className="text-text-primary">{book.dimensions}</dd>
                <dt className="text-text-tertiary">Fecha de publicación</dt>
                <dd className="text-text-primary">{new Date(book.publishDate).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</dd>
              </dl>
            </Accordion>

            <Accordion title="Envío y devoluciones">
              <div className="space-y-[var(--space-3)]">
                <p className="text-sm text-text-secondary">
                  <strong className="text-text-primary">Envío estándar:</strong> 24-48 horas hábiles. Gratis en pedidos desde $50.
                </p>
                <p className="text-sm text-text-secondary">
                  <strong className="text-text-primary">Envío express:</strong> 24 horas. Costo adicional de $8.
                </p>
                <p className="text-sm text-text-secondary">
                  <strong className="text-text-primary">Devoluciones:</strong> 30 días desde la recepción. Sin preguntas, sin costo adicional.
                </p>
              </div>
            </Accordion>
          </div>
        </div>
      </div>

      <section id="reviews" className="mt-[var(--space-24)]">
        <h2 className="text-2xl md:text-3xl font-display font-normal text-text-primary tracking-[var(--tracking-3xl)] mb-[var(--space-8)]">
          Opiniones de lectores
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-[var(--space-12)] mb-[var(--space-12)]">
          <div className="text-center lg:text-left">
            <div className="text-5xl font-bold text-text-primary mb-[var(--space-2)]">
              {book.rating}
            </div>
            <div className="flex items-center justify-center lg:justify-start gap-[var(--space-1)] mb-[var(--space-2)]">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    'w-5 h-5',
                    i < Math.round(book.rating)
                      ? 'fill-accent-gold text-accent-gold'
                      : 'text-border-subtle'
                  )}
                  aria-hidden="true"
                />
              ))}
            </div>
            <p className="text-sm text-text-tertiary">
              Basado en {book.reviewCount} reseñas
            </p>
          </div>

          <div className="flex flex-col gap-[var(--space-3)]">
            {ratingDistribution.map((item) => (
              <div key={item.stars} className="flex items-center gap-[var(--space-3)]">
                <span className="text-sm text-text-secondary w-8">{item.stars} ★</span>
                <div className="flex-1 h-2 bg-bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-accent-gold rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, item.percentage)}%` }}
                  />
                </div>
                <span className="text-xs text-text-tertiary w-10 text-right">{item.percentage}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-[var(--space-6)]">
          {reviews.length === 0 ? (
            <p className="text-sm text-text-secondary">Aún no hay reseñas para este libro. ¡Sé el primero en opinar!</p>
          ) : (
            reviews.map((review) => (
              <div key={review.id} className="border-b border-border-subtle pb-[var(--space-6)]">
                <div className="flex items-start justify-between mb-[var(--space-3)]">
                  <div>
                    <div className="flex items-center gap-[var(--space-2)] mb-[var(--space-1)]">
                      <div className="flex items-center gap-[var(--space-1)]">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={cn(
                              'w-3.5 h-3.5',
                              i < review.rating
                                ? 'fill-accent-gold text-accent-gold'
                                : 'text-border-subtle'
                            )}
                            aria-hidden="true"
                          />
                        ))}
                      </div>
                      <span className="text-sm font-semibold text-text-primary">{review.title}</span>
                    </div>
                    <p className="text-xs text-text-tertiary">
                      {review.userName} · {new Date(review.date).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-text-secondary leading-relaxed mb-[var(--space-3)]">
                  {review.content}
                </p>
                <button className="text-xs text-text-tertiary hover:text-brand-primary transition-colors duration-[var(--duration-micro)]">
                  Útil ({review.helpful})
                </button>
              </div>
            ))
          )}
        </div>

        <div className="mt-[var(--space-8)]">
          <Button variant="secondary">Escribir una reseña</Button>
        </div>
      </section>

      {related.length > 0 && (
        <section className="mt-[var(--space-24)]">
          <h2 className="text-2xl md:text-3xl font-display font-normal text-text-primary tracking-[var(--tracking-3xl)] mb-[var(--space-8)]">
            También te puede interesar
          </h2>
          <Carousel gap={24}>
            {related.map((book) => (
              <div key={book.id} className="w-[280px] md:w-[300px]">
                <BookCard book={book} />
              </div>
            ))}
          </Carousel>
        </section>
      )}
    </div>
  )
}
