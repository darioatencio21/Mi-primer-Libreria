'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Star, Heart, ShoppingCart, Truck, RotateCcw, ShieldCheck, Minus, Plus } from 'lucide-react'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { Accordion } from '@/components/ui/Accordion'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { BookCard } from '@/components/product/BookCard'
import { Carousel } from '@/components/ui/Carousel'
import { cn } from '@/lib/utils'
import type { Book, BookFormat } from '@/lib/types'

const MOCK_BOOK: Book = {
  id: '1',
  title: 'Cien años de soledad',
  slug: 'cien-anos-de-soledad',
  author: { id: 'a1', name: 'Gabriel García Márquez', slug: 'garcia-marquez', bio: 'Premio Nobel de Literatura 1982. Autor colombiano considerado uno de los más significativos del siglo XX.', bookCount: 12 },
  category: { id: 'c1', name: 'Ficción', slug: 'ficcion', description: '', icon: '', bookCount: 0 },
  description: 'La obra maestra del realismo mágico que narra la historia de la familia Buendía a lo largo de siete generaciones en el pueblo ficticio de Macondo. Una saga familiar épica que explora temas de amor, soledad, destino y la naturaleza cíclica del tiempo. Considerada una de las obras más importantes de la literatura en lengua española y un pilar fundamental de la literatura latinoamericana del siglo XX.',
  price: 24.99,
  discountPrice: 19.99,
  discountPercentage: 20,
  formats: [
    { type: 'hardcover', price: 34.99, stock: 8 },
    { type: 'paperback', price: 19.99, stock: 15 },
    { type: 'ebook', price: 9.99, stock: 999 },
    { type: 'audiobook', price: 14.99, stock: 999 },
  ],
  coverImage: '/placeholder-book.svg',
  images: ['/placeholder-book.svg', '/placeholder-book.svg', '/placeholder-book.svg'],
  isbn: '978-0-00-000000-0',
  publisher: 'Editorial Sudamericana',
  pages: 471,
  language: 'Español',
  publishDate: '1967-05-30',
  dimensions: '14 × 21 cm',
  rating: 4.8,
  reviewCount: 2847,
  stock: 15,
  isBestseller: true,
  isNew: false,
  tags: ['realismo mágico', 'clásico', 'latinoamérica'],
}

const FORMAT_LABELS: Record<BookFormat['type'], string> = {
  hardcover: 'Tapa dura',
  paperback: 'Tapa blanda',
  ebook: 'Ebook',
  audiobook: 'Audiolibro',
}

const MOCK_REVIEWS = [
  {
    id: 'r1',
    userName: 'María G.',
    rating: 5,
    date: '2024-11-15',
    title: 'Una obra maestra atemporal',
    content: 'Cada vez que releo este libro descubro algo nuevo. La prosa de García Márquez es simplemente mágica. Un libro que todo amante de la literatura debe tener en su estantería.',
    helpful: 24,
  },
  {
    id: 'r2',
    userName: 'Carlos R.',
    rating: 5,
    date: '2024-10-28',
    title: 'Imprescindible',
    content: 'La forma en que García Márquez entrelaza las historias de los Buendía es magistral. Un libro que te atrapa desde la primera página y no te suelta hasta el final.',
    helpful: 18,
  },
  {
    id: 'r3',
    userName: 'Ana M.',
    rating: 4,
    date: '2024-09-12',
    title: 'Hermoso pero denso',
    content: 'La historia es fascinante, aunque la cantidad de personajes con nombres similares puede confundir al principio. Recomiendo tener un árbol genealógico a mano.',
    helpful: 12,
  },
]

const MOCK_RELATED: Book[] = [
  {
    id: '2',
    title: 'El amor en los tiempos del cólera',
    slug: 'amor-tiempos-colera',
    author: { id: 'a1', name: 'Gabriel García Márquez', slug: 'garcia-marquez', bio: '', bookCount: 12 },
    category: { id: 'c1', name: 'Ficción', slug: 'ficcion', description: '', icon: '', bookCount: 0 },
    description: 'Una historia de amor que trasciende el tiempo.',
    price: 22.99,
    formats: [{ type: 'paperback', price: 22.99, stock: 8 }],
    coverImage: '/placeholder-book.svg',
    images: [],
    isbn: '978-0-00-000000-1',
    publisher: 'Editorial Sudamericana',
    pages: 368,
    language: 'Español',
    publishDate: '1985-09-05',
    rating: 4.7,
    reviewCount: 1923,
    stock: 8,
    isBestseller: true,
    isNew: false,
    tags: ['romance', 'clásico'],
  },
  {
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
  {
    id: '4',
    title: 'Sapiens: De animales a dioses',
    slug: 'sapiens-de-animales-a-dioses',
    author: { id: 'a3', name: 'Yuval Noah Harari', slug: 'yuval-harari', bio: '', bookCount: 4 },
    category: { id: 'c2', name: 'No Ficción', slug: 'no-ficcion', description: '', icon: '', bookCount: 0 },
    description: 'Una breve historia de la humanidad.',
    price: 29.99,
    formats: [{ type: 'paperback', price: 29.99, stock: 20 }],
    coverImage: '/placeholder-book.svg',
    images: [],
    isbn: '978-0-00-000000-3',
    publisher: 'Debate',
    pages: 496,
    language: 'Español',
    publishDate: '2014-09-04',
    rating: 4.7,
    reviewCount: 3892,
    stock: 20,
    isBestseller: true,
    isNew: false,
    tags: ['historia', 'antropología'],
  },
  {
    id: '5',
    title: 'El principito',
    slug: 'el-principito',
    author: { id: 'a4', name: 'Antoine de Saint-Exupéry', slug: 'saint-exupery', bio: '', bookCount: 3 },
    category: { id: 'c3', name: 'Infantil', slug: 'infantil', description: '', icon: '', bookCount: 0 },
    description: 'Lo esencial es invisible a los ojos.',
    price: 14.99,
    formats: [{ type: 'hardcover', price: 14.99, stock: 30 }],
    coverImage: '/placeholder-book.svg',
    images: [],
    isbn: '978-0-00-000000-4',
    publisher: 'Salamandra',
    pages: 96,
    language: 'Español',
    publishDate: '1943-04-06',
    rating: 4.9,
    reviewCount: 5621,
    stock: 30,
    isBestseller: true,
    isNew: false,
    tags: ['clásico', 'infantil'],
  },
]

export default function ProductPage() {
  const book = MOCK_BOOK
  const [selectedFormat, setSelectedFormat] = useState<BookFormat['type']>('paperback')
  const [quantity, setQuantity] = useState(1)
  const [activeImage, setActiveImage] = useState(0)
  const [isWishlisted, setIsWishlisted] = useState(false)

  const currentFormat = book.formats.find((f) => f.type === selectedFormat) || book.formats[0]
  const currentPrice = selectedFormat === 'paperback' && book.discountPrice
    ? book.discountPrice
    : currentFormat.price

  const ratingDistribution = [
    { stars: 5, percentage: 78 },
    { stars: 4, percentage: 15 },
    { stars: 3, percentage: 5 },
    { stars: 2, percentage: 1 },
    { stars: 1, percentage: 1 },
  ]

  return (
    <div className="mx-auto max-w-[var(--container-max)] px-[var(--space-6)] md:px-[var(--space-10)] lg:px-[var(--space-16)] py-[var(--space-12)]">
      <Breadcrumb
        items={[
          { label: 'Inicio', href: '/' },
          { label: book.category.name, href: `/libros/${book.category.slug}` },
          { label: 'Novela' },
          { label: book.title },
        ]}
        className="mb-[var(--space-8)]"
      />

      <div className="grid grid-cols-1 lg:grid-cols-[45%_55%] gap-[var(--space-12)] lg:gap-[var(--space-16)]">
        <div className="flex gap-[var(--space-4)]">
          <div className="hidden md:flex flex-col gap-[var(--space-3)]">
            {book.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(i)}
                className={cn(
                  'w-16 h-20 rounded-[var(--radius-sm)] bg-bg-muted overflow-hidden border-2 transition-colors duration-[var(--duration-micro)]',
                  activeImage === i ? 'border-brand-primary' : 'border-transparent hover:border-border-hover'
                )}
              >
                <Image
                  src={img}
                  alt={`Vista ${i + 1} de ${book.title}`}
                  width={64}
                  height={80}
                  className="w-full h-full object-contain p-1"
                />
              </button>
            ))}
          </div>

          <div className="flex-1 relative aspect-[3/4] rounded-[var(--radius-lg)] bg-bg-muted overflow-hidden">
            <Image
              src={book.images[activeImage]}
              alt={`Portada de ${book.title} por ${book.author.name}`}
              fill
              sizes="(max-width: 1024px) 100vw, 45vw"
              className="object-contain p-[var(--space-8)]"
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
            {book.discountPrice && selectedFormat === 'paperback' ? (
              <>
                <span className="text-sm text-text-tertiary line-through">
                  ${book.price.toFixed(2)}
                </span>
                <span className="text-2xl font-bold text-text-primary">
                  ${book.discountPrice.toFixed(2)}
                </span>
                <Badge variant="discount">-{book.discountPercentage}%</Badge>
              </>
            ) : (
              <span className="text-2xl font-bold text-text-primary">
                ${currentPrice.toFixed(2)}
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
                    ${format.price.toFixed(2)}
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
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
                <span className="text-xs text-text-tertiary w-10 text-right">{item.percentage}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-[var(--space-6)]">
          {MOCK_REVIEWS.map((review) => (
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
          ))}
        </div>

        <div className="mt-[var(--space-8)]">
          <Button variant="secondary">Escribir una reseña</Button>
        </div>
      </section>

      <section className="mt-[var(--space-24)]">
        <h2 className="text-2xl md:text-3xl font-display font-normal text-text-primary tracking-[var(--tracking-3xl)] mb-[var(--space-8)]">
          También te puede interesar
        </h2>
        <Carousel gap={24}>
          {MOCK_RELATED.map((book) => (
            <div key={book.id} className="w-[280px] md:w-[300px]">
              <BookCard book={book} />
            </div>
          ))}
        </Carousel>
      </section>
    </div>
  )
}
