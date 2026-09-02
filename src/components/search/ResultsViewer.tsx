'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import { SlidersHorizontal, LayoutGrid, List, ChevronDown } from 'lucide-react'
import { BookCard } from '@/components/product/BookCard'
import { FilterSidebar } from '@/components/search/FilterSidebar'
import { Pagination } from '@/components/ui/Pagination'
import { cn } from '@/lib/utils'
import { filterBooks } from '@/lib/catalog-filter'
import { getBookDisplayPrice } from '@/lib/book-price'
import { formatArs } from '@/lib/format'
import { useCart, useUi } from '@/lib/store'
import type { Book, SearchFilters } from '@/lib/types'

const SORT_OPTIONS = [
  { value: 'relevance', label: 'Relevancia' },
  { value: 'price_asc', label: 'Precio: menor a mayor' },
  { value: 'price_desc', label: 'Precio: mayor a menor' },
  { value: 'rating', label: 'Mejor valorados' },
  { value: 'newest', label: 'Más recientes' },
]

const PAGE_SIZE = 12

interface ResultsViewerProps {
  books: Book[]
  initialFilters?: SearchFilters
  unit?: string
}

export function ResultsViewer({ books, initialFilters = {}, unit = 'libros' }: ResultsViewerProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    ...initialFilters,
    sortBy: initialFilters.sortBy ?? 'relevance',
  })
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [sortOpen, setSortOpen] = useState(false)

  const results = useMemo(() => filterBooks(books, filters), [books, filters])
  const totalPages = Math.max(1, Math.ceil(results.length / PAGE_SIZE))
  const safePage = Math.min(currentPage, totalPages)
  const pageItems = results.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE
  )

  const handleFilterChange = (next: SearchFilters) => {
    setCurrentPage(1)
    setFilters(next)
  }

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-x-[var(--space-4)] gap-y-[var(--space-3)] mb-[var(--space-6)]">
        <div className="flex items-center gap-[var(--space-2)] sm:gap-[var(--space-3)]">
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="lg:hidden inline-flex items-center justify-center gap-[var(--space-2)] h-[var(--height-btn-md)] px-[var(--space-3)] sm:px-[var(--space-4)] rounded-[var(--radius-md)] border border-border-subtle text-sm text-text-secondary hover:text-text-primary hover:border-border-hover transition-colors duration-[var(--duration-micro)]"
          >
            <SlidersHorizontal className="w-4 h-4" aria-hidden="true" />
            Filtros
          </button>
          <p className="text-sm text-text-secondary whitespace-nowrap">
            {results.length} {unit}
          </p>
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
                      handleFilterChange({ ...filters, sortBy: option.value as SearchFilters['sortBy'] })
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
        <FilterSidebar filters={filters} onFilterChange={handleFilterChange} />

        <div className="flex-1 min-w-0">
          {pageItems.length === 0 ? (
            <div className="py-[var(--space-16)] text-center">
              <p className="text-base font-medium text-text-primary mb-[var(--space-2)]">
                No encontramos resultados
              </p>
              <p className="text-sm text-text-secondary">
                Probá ajustando los filtros o explorando otras categorías.
              </p>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-[var(--space-6)]">
              {pageItems.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col divide-y divide-border-subtle">
              {pageItems.map((book) => (
                <ListViewCard key={book.id} book={book} />
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="mt-[var(--space-12)]">
              <Pagination
                currentPage={safePage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </div>
      </div>

      <FilterSidebar
        filters={filters}
        onFilterChange={handleFilterChange}
        isMobile
        isOpen={mobileFiltersOpen}
        onClose={() => setMobileFiltersOpen(false)}
      />
    </>
  )
}

function ListViewCard({ book }: { book: Book }) {
  const addItem = useCart((state) => state.addItem)
  const openCart = useUi((state) => state.openCart)

  const handleAddToCart = () => {
    const defaultFormat = book.formats.some((f) => f.type === 'paperback')
      ? 'paperback'
      : book.formats[0]?.type
    if (defaultFormat) {
      addItem(book, defaultFormat, 1)
    }
    openCart()
  }

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
      <div className="flex flex-col items-end justify-between shrink-0 gap-[var(--space-3)]">
        <span className="text-lg font-bold text-text-primary whitespace-nowrap">{formatArs(getBookDisplayPrice(book))}</span>
        <button
          onClick={handleAddToCart}
          className="h-[var(--height-btn-sm)] px-[var(--space-4)] rounded-[var(--radius-md)] bg-brand-primary text-text-on-brand text-xs font-semibold hover:bg-brand-primary-hover transition-colors duration-200 ease-out"
        >
          Agregar
        </button>
      </div>
    </div>
  )
}