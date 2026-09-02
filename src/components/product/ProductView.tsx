import { Star, Truck, RotateCcw, ShieldCheck } from 'lucide-react'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { Accordion } from '@/components/ui/Accordion'
import { Button } from '@/components/ui/Button'
import { BookCard } from '@/components/product/BookCard'
import { Carousel } from '@/components/ui/Carousel'
import { ProductGallery } from './ProductGallery'
import { ProductBuyBox } from './ProductBuyBox'
import { getRelatedBooks, getReviewsByBook } from '@/lib/data'
import { generateProductJsonLd } from '@/lib/json-ld'
import { cn } from '@/lib/utils'
import type { Book } from '@/lib/types'

function ratingDistribution(rating: number): { stars: number; percentage: number }[] {
  const five = Math.min(90, Math.max(45, Math.round(rating * 18)))
  const four = Math.max(3, Math.round((100 - five) * 0.55))
  const three = Math.max(2, Math.round((100 - five - four) * 0.6))
  const one = Math.max(1, Math.round((100 - five - four - three) * 0.5))
  const two = Math.max(1, 100 - five - four - three - one)
  return [
    { stars: 5, percentage: five },
    { stars: 4, percentage: four },
    { stars: 3, percentage: three },
    { stars: 2, percentage: two },
    { stars: 1, percentage: one },
  ]
}

export function ProductView({ book }: { book: Book }) {
  const jsonLd = generateProductJsonLd(book)

  return (
    <div className="mx-auto max-w-[var(--container-max)] px-[var(--space-6)] md:px-[var(--space-10)] lg:px-[var(--space-16)] py-[var(--space-12)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Breadcrumb
        items={[
          { label: 'Inicio', href: '/' },
          { label: book.category.name, href: `/libros/${book.category.slug}` },
          { label: book.title },
        ]}
        className="mb-[var(--space-8)]"
      />

      <div className="grid grid-cols-1 lg:grid-cols-[45%_55%] gap-[var(--space-12)] lg:gap-[var(--space-16)]">
        <ProductGallery images={book.images} title={book.title} />

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
            <div
              className="flex items-center gap-[var(--space-1)]"
              aria-label={`${book.rating} de 5 estrellas`}
            >
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

          <ProductBuyBox book={book} />

          <div className="flex flex-wrap items-center gap-x-[var(--space-4)] md:gap-x-[var(--space-6)] gap-y-[var(--space-3)] py-[var(--space-4)] border-t border-b border-border-subtle mb-[var(--space-6)]">
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
                <dd className="text-text-primary">{book.publisher || '—'}</dd>
                <dt className="text-text-tertiary">ISBN</dt>
                <dd className="text-text-primary">{book.isbn}</dd>
                <dt className="text-text-tertiary">Páginas</dt>
                <dd className="text-text-primary">{book.pages || '—'}</dd>
                <dt className="text-text-tertiary">Idioma</dt>
                <dd className="text-text-primary">{book.language}</dd>
                {book.dimensions && (
                  <>
                    <dt className="text-text-tertiary">Dimensiones</dt>
                    <dd className="text-text-primary">{book.dimensions}</dd>
                  </>
                )}
                <dt className="text-text-tertiary">Fecha de publicación</dt>
                <dd className="text-text-primary">
                  {book.publishDate
                    ? new Date(book.publishDate).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })
                    : '—'}
                </dd>
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

      <ReviewsSection bookId={book.id} book={book} />
      <RelatedBooks bookId={book.id} categoryId={book.category.id} />
    </div>
  )
}

async function ReviewsSection({ bookId, book }: { bookId: string; book: Book }) {
  const reviews = await getReviewsByBook(bookId)
  const distribution = ratingDistribution(book.rating)

  return (
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
          {distribution.map((item) => (
            <div key={item.stars} className="flex items-center gap-[var(--space-3)]">
              <span className="text-sm text-text-secondary w-8">{item.stars} ★</span>
              <div className="flex-1 h-2 bg-bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-accent-gold rounded-full transition-all duration-500"
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
              <span className="text-xs text-text-tertiary w-10 text-right">{item.percentage}%</span>
            </div>
          ))}
        </div>
      </div>

      {reviews.length === 0 ? (
        <p className="text-sm text-text-secondary mb-[var(--space-6)]">
          Todavía no hay reseñas. Sé el primero en opinar.
        </p>
      ) : (
        <div className="flex flex-col gap-[var(--space-6)]">
          {reviews.map((review) => (
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
                    {review.title && (
                      <span className="text-sm font-semibold text-text-primary">{review.title}</span>
                    )}
                  </div>
                  <p className="text-xs text-text-tertiary">
                    {review.userName} ·{' '}
                    {new Date(review.createdAt).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>
              </div>
              <p className="text-sm text-text-secondary leading-relaxed mb-[var(--space-3)]">
                {review.content}
              </p>
              <button className="text-xs text-text-tertiary hover:text-brand-primary transition-colors duration-[var(--duration-micro)]">
                Útil ({review.helpfulCount})
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="mt-[var(--space-8)]">
        <Button variant="secondary">Escribir una reseña</Button>
      </div>
    </section>
  )
}

async function RelatedBooks({ bookId, categoryId }: { bookId: string; categoryId: string }) {
  const books = await getRelatedBooks(bookId, categoryId)
  if (books.length === 0) return null

  return (
    <section className="mt-[var(--space-24)]">
      <h2 className="text-2xl md:text-3xl font-display font-normal text-text-primary tracking-[var(--tracking-3xl)] mb-[var(--space-8)]">
        También te puede interesar
      </h2>
      <Carousel gap={24}>
        {books.map((book) => (
          <div key={book.id} className="w-[240px] sm:w-[280px] md:w-[300px]">
            <BookCard book={book} />
          </div>
        ))}
      </Carousel>
    </section>
  )
}