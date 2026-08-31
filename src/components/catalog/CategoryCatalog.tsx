'use client'

import { useState } from 'react'
import { SlidersHorizontal, LayoutGrid, List } from 'lucide-react'
import { BookCard } from '@/components/product/BookCard'
import { FilterSidebar } from '@/components/search/FilterSidebar'
import { Pagination } from '@/components/ui/Pagination'
import { cn } from '@/lib/utils'
import type { SearchFilters, Book } from '@/lib/types'

interface CategoryCatalogProps {
  books: Book[]
  info: { title: string; description: string }
  perPage?: number
}

export function CategoryCatalog({ books, info, perPage = 12 }: CategoryCatalogProps) {
  const [filters, setFilters] = useState<SearchFilters>({})
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)

  const filtered = books.filter((book) => {
    if (filters.format && filters.format.length > 0) {
      const hasFormat = book.formats.some((f) => filters.format!.includes(f.type))
      if (!hasFormat) return false
    }
    if (filters.inStockOnly && book.stock === 0) return false
    if (filters.priceMin != null && book.price < filters.priceMin) return false
    if (filters.priceMax != null && book.price > filters.priceMax) return false
    return true
  })

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage))
  const pageBooks = filtered.slice((currentPage - 1) * perPage, currentPage * perPage)

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
            {filtered.length} libros
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
            {pageBooks.length === 0 ? (
              <p className="text-text-secondary text-center py-[var(--space-16)]">
                No hay libros que coincidan con los filtros.
              </p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-[var(--space-6)]">
                {pageBooks.map((book) => (
                  <BookCard key={book.id} book={book} />
                ))}
              </div>
            )}

            {totalPages > 1 && (
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
    </>
  )
}
