import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { Accordion } from '@/components/ui/Accordion'
import { BookCard } from '@/components/product/BookCard'
import { Carousel } from '@/components/ui/Carousel'
import { TrustBadges } from '@/components/ui/TrustBadges'
import { ProductGallery } from './ProductGallery'
import { ProductBuyBox } from './ProductBuyBox'
import { getRelatedBooks } from '@/lib/data'
import { generateProductJsonLd } from '@/lib/json-ld'
import type { Book } from '@/lib/types'

export function ProductView({ book }: { book: Book }) {
  const jsonLd = generateProductJsonLd(book)
  const galleryImages = [...new Set([book.coverImage, ...book.images])]

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
        <ProductGallery images={galleryImages} title={book.title} />

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

          <div className="mb-[var(--space-6)]">
            <ProductBuyBox book={book} />
          </div>

          <div className="py-[var(--space-5)] border-t border-b border-border-subtle mb-[var(--space-6)]">
            <TrustBadges compact />
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
                  <strong className="text-text-primary">Envío estándar:</strong> 24-48 horas hábiles. Gratis en pedidos desde $50.000.
                </p>
                <p className="text-sm text-text-secondary">
                  <strong className="text-text-primary">Envío express:</strong> 24 horas. Costo adicional.
                </p>
                <p className="text-sm text-text-secondary">
                  <strong className="text-text-primary">Devoluciones:</strong> 30 días desde la recepción. Sin preguntas, sin costo adicional.
                </p>
              </div>
            </Accordion>
          </div>
        </div>
      </div>

      <RelatedBooks bookId={book.id} categoryId={book.category.id} />
    </div>
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