'use client'

import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { SlidersHorizontal, LayoutGrid, List, ChevronDown } from 'lucide-react'
import { BookCard } from '@/components/product/BookCard'
import { FilterSidebar } from '@/components/search/FilterSidebar'
import { Pagination } from '@/components/ui/Pagination'
import { Skeleton } from '@/components/ui/Skeleton'
import { EmptyState } from '@/components/ui/EmptyState'
import { sanitizeSearchQuery } from '@/lib/sanitize'
import { cn } from '@/lib/utils'
import type { SearchFilters, Book } from '@/lib/types'

const MOCK_RESULTS: Book[] = [
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
    id: '4',
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

const SORT_OPTIONS = [
  { value: 'relevance', label: 'Relevancia' },
  { value: 'price_asc', label: 'Precio: menor a mayor' },
  { value: 'price_desc', label: 'Precio: mayor a menor' },
  { value: 'rating', label: 'Mejor valorados' },
  { value: 'newest', label: 'Más recientes' },
]

function SearchContent() {
  const searchParams = useSearchParams()
  const rawQuery = searchParams.get('q') || ''
  const query = sanitizeSearchQuery(rawQuery)

  const [filters, setFilters] = useState<SearchFilters>({ query })
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [sortOpen, setSortOpen] = useState(false)

  const results = MOCK_RESULTS
  const totalPages = 5

  return (
    <div className="mx-auto max-w-[var(--container-max)] px-[var(--space-6)] md:px-[var(--space-10)] lg:px-[var(--space-16)] py-[var(--space-12)]">
      <div className="mb-[var(--space-8)]">
        <h1 className="text-2xl md:text-3xl font-display font-normal text-text-primary tracking-[var(--tracking-3xl)] mb-[var(--space-2)]">
          {query ? (
            <>Resultados para &ldquo;{query}&rdquo;</>
          ) : (
            <>Explorar catálogo</>
          )}
        </h1>
        <p className="text-sm text-text-secondary">
          {results.length} libros encontrados
        </p>
      </div>

      <div className="flex items-center justify-between mb-[var(--space-6)] gap-[var(--space-4)]">
        <div className="flex items-center gap-[var(--space-3)]">
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="lg:hidden inline-flex items-center gap-[var(--space-2)] h-[var(--height-btn-md)] px-[var(--space-4)] rounded-[var(--radius-md)] border border-border-subtle text-sm text-text-secondary hover:text-text-primary hover:border-border-hover transition-colors duration-[var(--duration-micro)]"
          >
            <SlidersHorizontal className="w-4 h-4" aria-hidden="true" />
            Filtros
          </button>
        </div>

        <div className="flex items-center gap-[var(--space-3)]">
          <div className="relative">
            <button
              onClick={() => setSortOpen(!sortOpen)}
              className="inline-flex items-center gap-[var(--space-2)] h-[var(--height-btn-md)] px-[var(--space-4)] rounded-[var(--radius-md)] text-sm text-text-secondary hover:text-text-primary transition-colors duration-[var(--duration-micro)]"
              aria-expanded={sortOpen}
            >
              Ordenar por
              <ChevronDown
                className={cn('w-4 h-4 transition-transform duration-[var(--duration-micro)]', sortOpen && 'rotate-180')}
                aria-hidden="true"
              />
            </button>
            {sortOpen && (
              <div className="absolute right-0 top-full mt-[var(--space-2)] bg-bg-elevated rounded-[var(--radius-md)] shadow-[var(--shadow-lg)] border border-border-subtle py-[var(--space-2)] min-w-[200px] z-30 animate-[fadeInUp_150ms_ease-out]">
                {SORT_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setFilters({ ...filters, sortBy: option.value as SearchFilters['sortBy'] })
                      setSortOpen(false)
                    }}
                    className={cn(
                      'w-full text-left px-[var(--space-4)] py-[10px] text-sm transition-colors duration-[var(--duration-micro)]',
                      filters.sortBy === option.value
                        ? 'text-brand-primary font-medium bg-brand-primary-light'
                        : 'text-text-primary hover:bg-bg-muted'
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>

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
          {results.length === 0 ? (
            <EmptyState
              variant="search"
              title="No encontramos resultados"
              description={`No encontramos resultados para "${query}". Intenta con otros términos o explora nuestras categorías.`}
              actionLabel="Explorar catálogo"
              onAction={() => {}}
            />
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-[var(--space-6)]">
              {results.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col divide-y divide-border-subtle">
              {results.map((book) => (
                <ListViewCard key={book.id} book={book} />
              ))}
            </div>
          )}

          {results.length > 0 && (
            <div className="mt-[var(--space-12)]">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
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
  )
}

function ListViewCard({ book }: { book: Book }) {
  return (
    <div className="flex gap-[var(--space-4)] py-[var(--space-6)]">
      <div className="w-24 h-32 shrink-0 rounded-[var(--radius-md)] bg-bg-muted overflow-hidden relative">
        <Image
          src={book.coverImage}
          alt={`Portada de ${book.title}`}
          fill
          sizes="96px"
          className="object-contain p-2"
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-text-tertiary mb-[var(--space-1)]">{book.author.name}</p>
        <h3 className="text-base font-semibold text-text-primary mb-[var(--space-1)]">{book.title}</h3>
        <p className="text-sm text-text-secondary line-clamp-2 mb-[var(--space-2)]">{book.description}</p>
        <div className="flex items-center gap-[var(--space-1)]">
          <span className="text-xs text-accent-gold">★</span>
          <span className="text-xs text-text-tertiary">{book.rating} ({book.reviewCount})</span>
        </div>
      </div>
      <div className="flex flex-col items-end justify-between shrink-0">
        <span className="text-lg font-bold text-text-primary">${book.discountPrice || book.price}</span>
        <button className="h-[var(--height-btn-sm)] px-[var(--space-4)] rounded-[var(--radius-md)] border border-brand-primary text-brand-primary text-xs font-semibold hover:bg-brand-primary hover:text-text-on-brand transition-all duration-[var(--duration-micro)]">
          Agregar
        </button>
      </div>
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="mx-auto max-w-[var(--container-max)] px-[var(--space-6)] md:px-[var(--space-10)] lg:px-[var(--space-16)] py-[var(--space-12)]">
        <Skeleton variant="text" lines={2} className="mb-[var(--space-8)]" />
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-[var(--space-6)]">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} variant="card" />
          ))}
        </div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  )
}
