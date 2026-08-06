'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { SlidersHorizontal, LayoutGrid, List } from 'lucide-react'
import { BookCard } from '@/components/product/BookCard'
import { FilterSidebar } from '@/components/search/FilterSidebar'
import { Pagination } from '@/components/ui/Pagination'
import { cn } from '@/lib/utils'
import type { SearchFilters, Book } from '@/lib/types'

const MOCK_BOOKS: Book[] = [
  {
    id: '1',
    title: 'Cien años de soledad',
    slug: 'cien-anos-de-soledad',
    author: { id: 'a1', name: 'Gabriel García Márquez', slug: 'garcia-marquez', bio: '', bookCount: 12 },
    category: { id: 'c1', name: 'Ficción', slug: 'ficcion', description: '', icon: '', bookCount: 0 },
    description: 'La obra maestra del realismo mágico.',
    price: 24.99,
    formats: [{ type: 'paperback', price: 24.99, stock: 15 }],
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
  {
    id: '2',
    title: 'El amor en los tiempos del cólera',
    slug: 'amor-tiempos-colera',
    author: { id: 'a1', name: 'Gabriel García Márquez', slug: 'garcia-marquez', bio: '', bookCount: 12 },
    category: { id: 'c1', name: 'Ficción', slug: 'ficcion', description: '', icon: '', bookCount: 0 },
    description: 'Una historia de amor que trasciende el tiempo.',
    price: 22.99,
    discountPrice: 18.39,
    discountPercentage: 20,
    formats: [{ type: 'paperback', price: 18.39, stock: 8 }],
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
    title: 'Tokio blues',
    slug: 'tokio-blues',
    author: { id: 'a2', name: 'Haruki Murakami', slug: 'haruki-murakami', bio: '', bookCount: 15 },
    category: { id: 'c1', name: 'Ficción', slug: 'ficcion', description: '', icon: '', bookCount: 0 },
    description: 'Una novela sobre la juventud y la nostalgia.',
    price: 23.99,
    formats: [{ type: 'paperback', price: 23.99, stock: 10 }],
    coverImage: '/placeholder-book.svg',
    images: [],
    isbn: '978-0-00-000000-5',
    publisher: 'Tusquets Editores',
    pages: 352,
    language: 'Español',
    publishDate: '1987-09-04',
    rating: 4.5,
    reviewCount: 1234,
    stock: 10,
    isBestseller: false,
    isNew: true,
    tags: ['contemporáneo', 'japón'],
  },
  {
    id: '5',
    title: 'Crónica de una muerte anunciada',
    slug: 'cronica-muerte-anunciada',
    author: { id: 'a1', name: 'Gabriel García Márquez', slug: 'garcia-marquez', bio: '', bookCount: 12 },
    category: { id: 'c1', name: 'Ficción', slug: 'ficcion', description: '', icon: '', bookCount: 0 },
    description: 'Un crimen inevitable en un pueblo caribeño.',
    price: 19.99,
    formats: [{ type: 'paperback', price: 19.99, stock: 22 }],
    coverImage: '/placeholder-book.svg',
    images: [],
    isbn: '978-0-00-000000-7',
    publisher: 'Editorial Sudamericana',
    pages: 122,
    language: 'Español',
    publishDate: '1981-04-07',
    rating: 4.7,
    reviewCount: 1876,
    stock: 22,
    isBestseller: false,
    isNew: false,
    tags: ['novela corta', 'clásico'],
  },
  {
    id: '6',
    title: 'El coronel no tiene quien le escriba',
    slug: 'coronel-no-tiene-quien-le-escriba',
    author: { id: 'a1', name: 'Gabriel García Márquez', slug: 'garcia-marquez', bio: '', bookCount: 12 },
    category: { id: 'c1', name: 'Ficción', slug: 'ficcion', description: '', icon: '', bookCount: 0 },
    description: 'La espera digna de un coronel olvidado.',
    price: 16.99,
    formats: [{ type: 'paperback', price: 16.99, stock: 0 }],
    coverImage: '/placeholder-book.svg',
    images: [],
    isbn: '978-0-00-000000-9',
    publisher: 'Editorial Sudamericana',
    pages: 92,
    language: 'Español',
    publishDate: '1961-01-01',
    rating: 4.5,
    reviewCount: 1234,
    stock: 0,
    isBestseller: false,
    isNew: false,
    tags: ['novela corta', 'clásico'],
  },
]

const CATEGORY_INFO: Record<string, { title: string; description: string }> = {
  ficcion: { title: 'Ficción', description: 'Historias que exploran la condición humana' },
  'no-ficcion': { title: 'No Ficción', description: 'Ideas que transforman nuestra comprensión del mundo' },
  infantil: { title: 'Infantil y Juvenil', description: 'Aventuras para jóvenes lectores curiosos' },
  autoayuda: { title: 'Autoayuda', description: 'Herramientas para el crecimiento personal' },
  academico: { title: 'Académico', description: 'Conocimiento especializado para profesionales y estudiantes' },
  comics: { title: 'Cómics y Novela Gráfica', description: 'Narrativa visual que desafía convenciones' },
  poesia: { title: 'Poesía', description: 'La belleza del lenguaje en su forma más pura' },
  ciencia: { title: 'Ciencia', description: 'Descubrimientos que expanden los límites del saber' },
  bestsellers: { title: 'Bestsellers', description: 'Los libros más leídos del momento' },
  novedades: { title: 'Novedades', description: 'Los lanzamientos más recientes' },
  ofertas: { title: 'Ofertas', description: 'Grandes libros a precios especiales' },
  recomendados: { title: 'Recomendados', description: 'Selecciones curadas por nuestro equipo' },
}

export default function CategoryPage() {
  const params = useParams()
  const categoria = params?.categoria as string || 'ficcion'
  const info = CATEGORY_INFO[categoria] || { title: 'Libros', description: 'Explora nuestro catálogo' }

  const [filters, setFilters] = useState<SearchFilters>({})
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)

  return (
    <>
      <section className="h-[160px] bg-bg-muted flex items-center">
        <div className="mx-auto max-w-[var(--container-max)] px-[var(--space-6)] md:px-[var(--space-10)] lg:px-[var(--space-16)] w-full">
          <h1 className="text-2xl md:text-4xl font-display font-normal text-text-primary tracking-[var(--tracking-4xl)] mb-[var(--space-2)]">
            {info.title}
          </h1>
          <p className="text-sm text-text-secondary">{info.description}</p>
        </div>
      </section>

      <div className="mx-auto max-w-[var(--container-max)] px-[var(--space-6)] md:px-[var(--space-10)] lg:px-[var(--space-16)] py-[var(--space-8)]">
        <div className="flex items-center justify-between mb-[var(--space-6)] gap-[var(--space-4)]">
          <p className="text-sm text-text-secondary">
            {MOCK_BOOKS.length} libros
          </p>

          <div className="flex items-center gap-[var(--space-3)]">
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="lg:hidden inline-flex items-center gap-[var(--space-2)] h-[var(--height-btn-md)] px-[var(--space-4)] rounded-[var(--radius-md)] border border-border-subtle text-sm text-text-secondary hover:text-text-primary hover:border-border-hover transition-colors duration-[var(--duration-micro)]"
            >
              <SlidersHorizontal className="w-4 h-4" aria-hidden="true" />
              Filtros
            </button>

            <div className="hidden sm:flex items-center border border-border-subtle rounded-[var(--radius-md)] overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={cn(
                  'p-[var(--space-2)] transition-colors duration-[var(--duration-micro)]',
                  viewMode === 'grid' ? 'bg-bg-muted text-text-primary' : 'text-text-tertiary hover:text-text-primary'
                )}
                aria-label="Vista de grilla"
                aria-pressed={viewMode === 'grid'}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={cn(
                  'p-[var(--space-2)] transition-colors duration-[var(--duration-micro)]',
                  viewMode === 'list' ? 'bg-bg-muted text-text-primary' : 'text-text-tertiary hover:text-text-primary'
                )}
                aria-label="Vista de lista"
                aria-pressed={viewMode === 'list'}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex gap-[var(--space-10)]">
          <FilterSidebar filters={filters} onFilterChange={setFilters} />

          <div className="flex-1 min-w-0">
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-[var(--space-6)]">
              {MOCK_BOOKS.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>

            <div className="mt-[var(--space-12)]">
              <Pagination
                currentPage={currentPage}
                totalPages={5}
                onPageChange={setCurrentPage}
              />
            </div>
          </div>
        </div>

        <FilterSidebar
          filters={filters}
          onFilterChange={setFilters}
          isMobile
          isOpen={mobileFiltersOpen}
          onClose={() => setMobileFiltersOpen(false)}
        />
      </div>
    </>
  )
}
