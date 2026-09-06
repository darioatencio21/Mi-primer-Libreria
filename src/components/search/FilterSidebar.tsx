'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { SearchFilters, BookFormat } from '@/lib/types'

interface FilterSidebarProps {
  filters: SearchFilters
  onFilterChange: (filters: SearchFilters) => void
  isMobile?: boolean
  isOpen?: boolean
  onClose?: () => void
}

const FORMATS: { value: BookFormat['type']; label: string }[] = [
  { value: 'hardcover', label: 'Tapa dura' },
  { value: 'paperback', label: 'Tapa blanda' },
  { value: 'ebook', label: 'Ebook' },
  { value: 'audiobook', label: 'Audiolibro' },
]

const LANGUAGES = ['Español', 'Inglés', 'Portugués', 'Francés', 'Italiano']

const DATE_RANGES = [
  { value: 'month', label: 'Último mes' },
  { value: 'year', label: 'Último año' },
  { value: 'classics', label: 'Clásicos' },
]

const POPULARITY_CHIPS = [
  { value: 'bestsellers', label: 'Más vendidos' },
  { value: 'top-rated', label: 'Mejor valorados' },
  { value: 'new', label: 'Novedades' },
]

export function FilterSidebar({
  filters,
  onFilterChange,
  isMobile = false,
  isOpen = false,
  onClose,
}: FilterSidebarProps) {
  const [openSections, setOpenSections] = useState<Set<string>>(
    new Set(['category', 'price', 'format'])
  )

  const toggleSection = (section: string) => {
    setOpenSections((prev) => {
      const next = new Set(prev)
      if (next.has(section)) next.delete(section)
      else next.add(section)
      return next
    })
  }

  const updateFilter = <K extends keyof SearchFilters>(
    key: K,
    value: SearchFilters[K]
  ) => {
    onFilterChange({ ...filters, [key]: value })
  }

  const toggleArrayFilter = <K extends keyof SearchFilters>(
    key: K,
    value: string
  ) => {
    const current = (filters[key] as string[] | undefined) || []
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value]
    onFilterChange({ ...filters, [key]: next as SearchFilters[K] })
  }

  const activeFilterCount = Object.entries(filters).filter(
    ([key, value]) => {
      if (key === 'query' || key === 'sortBy') return false
      if (Array.isArray(value)) return value.length > 0
      if (typeof value === 'boolean') return value
      return value !== undefined && value !== null
    }
  ).length

  const clearAll = () => {
    const { query, sortBy } = filters
    onFilterChange({ query, sortBy })
  }

  const content = (
    <div className="flex flex-col gap-[var(--space-6)]">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-text-primary">Filtros</h3>
        {activeFilterCount > 0 && (
          <button
            onClick={clearAll}
            className="inline-flex items-center min-h-[44px] px-[var(--space-3)] -my-2 text-xs font-medium text-accent-terracotta hover:underline"
          >
            Limpiar todo ({activeFilterCount})
          </button>
        )}
      </div>

      <FilterSection
        title="Precio"
        isOpen={openSections.has('price')}
        onToggle={() => toggleSection('price')}
      >
        <div className="flex items-center gap-[var(--space-3)]">
          <input
            type="number"
            placeholder="Min"
            value={filters.priceMin ?? ''}
            onChange={(e) =>
              updateFilter('priceMin', e.target.value ? Number(e.target.value) : undefined)
            }
            className="w-full h-11 px-[var(--space-3)] rounded-[var(--radius-sm)] border border-border-input text-sm text-text-primary bg-bg-surface focus:border-brand-primary focus:outline-none"
            min={0}
          />
          <span className="text-text-tertiary text-sm">—</span>
          <input
            type="number"
            placeholder="Max"
            value={filters.priceMax ?? ''}
            onChange={(e) =>
              updateFilter('priceMax', e.target.value ? Number(e.target.value) : undefined)
            }
            className="w-full h-11 px-[var(--space-3)] rounded-[var(--radius-sm)] border border-border-input text-sm text-text-primary bg-bg-surface focus:border-brand-primary focus:outline-none"
            min={0}
          />
        </div>
      </FilterSection>

      <FilterSection
        title="Formato"
        isOpen={openSections.has('format')}
        onToggle={() => toggleSection('format')}
      >
        <div className="flex flex-col gap-[var(--space-1)]">
          {FORMATS.map((format) => (
            <label
              key={format.value}
              className="flex items-center gap-[var(--space-3)] min-h-[44px] cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={(filters.format || []).includes(format.value)}
                onChange={() => toggleArrayFilter('format', format.value)}
                className="w-4 h-4 rounded border-border-input text-brand-primary focus:ring-brand-primary/12 accent-brand-primary"
              />
              <span className="text-sm text-text-secondary group-hover:text-text-primary transition-colors duration-[var(--duration-micro)]">
                {format.label}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      <FilterSection
        title="Idioma"
        isOpen={openSections.has('language')}
        onToggle={() => toggleSection('language')}
      >
        <div className="flex flex-col gap-[var(--space-1)]">
          {LANGUAGES.map((lang) => (
            <label
              key={lang}
              className="flex items-center gap-[var(--space-3)] min-h-[44px] cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={(filters.language || []).includes(lang)}
                onChange={() => toggleArrayFilter('language', lang)}
                className="w-4 h-4 rounded border-border-input text-brand-primary focus:ring-brand-primary/12 accent-brand-primary"
              />
              <span className="text-sm text-text-secondary group-hover:text-text-primary transition-colors duration-[var(--duration-micro)]">
                {lang}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      <FilterSection
        title="Disponibilidad"
        isOpen={openSections.has('availability')}
        onToggle={() => toggleSection('availability')}
      >
        <label className="flex items-center gap-[var(--space-3)] min-h-[44px] cursor-pointer">
          <button
            role="switch"
            aria-checked={filters.inStockOnly || false}
            onClick={() => updateFilter('inStockOnly', !filters.inStockOnly)}
            className={cn(
              'relative w-10 h-6 rounded-full transition-colors duration-[180ms]',
              filters.inStockOnly ? 'bg-brand-primary' : 'bg-border-input'
            )}
          >
            <span
              className={cn(
                'absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-[var(--shadow-xs)] transition-transform duration-[180ms]',
                filters.inStockOnly && 'translate-x-4'
              )}
            />
          </button>
          <span className="text-sm text-text-secondary">Solo en stock</span>
        </label>
      </FilterSection>

      <FilterSection
        title="Fecha de publicación"
        isOpen={openSections.has('date')}
        onToggle={() => toggleSection('date')}
      >
        <div className="flex flex-col gap-[var(--space-2)]">
          {DATE_RANGES.map((range) => (
            <label
              key={range.value}
              className="flex items-center gap-[var(--space-2)] cursor-pointer group"
            >
              <input
                type="radio"
                name="dateRange"
                className="w-4 h-4 border-border-input text-brand-primary focus:ring-brand-primary/12 accent-brand-primary"
              />
              <span className="text-sm text-text-secondary group-hover:text-text-primary transition-colors duration-[var(--duration-micro)]">
                {range.label}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      <div>
        <p className="text-sm font-semibold text-text-primary mb-[var(--space-3)]">Popularidad</p>
        <div className="flex flex-wrap gap-[var(--space-2)]">
          {POPULARITY_CHIPS.map((chip) => (
<button
            key={chip.value}
            className="px-[var(--space-3)] py-[var(--space-2)] min-h-[44px] rounded-[var(--radius-full)] text-xs font-medium bg-bg-muted text-text-secondary hover:bg-brand-primary-light hover:text-brand-primary transition-colors duration-[var(--duration-micro)]"
          >
              {chip.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )

  if (isMobile) {
    return (
      <>
        {isOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              className="absolute inset-0 bg-[rgba(23,20,15,0.4)] animate-[fadeIn_200ms_ease-out]"
              onClick={onClose}
              aria-hidden="true"
            />
            <div className="absolute right-0 top-0 bottom-0 w-full max-w-[360px] bg-bg-elevated shadow-[var(--shadow-xl)] p-[var(--space-6)] pb-[calc(var(--space-6)+env(safe-area-inset-bottom))] overflow-y-auto animate-[fadeInUp_300ms_var(--ease-out-quint)]">
              <div className="flex items-center justify-between mb-[var(--space-6)]">
                <h2 className="text-lg font-semibold text-text-primary">Filtros</h2>
                <button
                  onClick={onClose}
                  className="p-[var(--space-2)] text-text-tertiary hover:text-text-primary transition-colors duration-[var(--duration-micro)]"
                  aria-label="Cerrar filtros"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              {content}
            </div>
          </div>
        )}
      </>
    )
  }

  return (
    <aside className="hidden lg:block w-[280px] shrink-0 sticky top-[calc(var(--height-header)+var(--space-4))] self-start">
      {content}
    </aside>
  )
}

function FilterSection({
  title,
  isOpen,
  onToggle,
  children,
}: {
  title: string
  isOpen: boolean
  onToggle: () => void
  children: React.ReactNode
}) {
  return (
    <div className="border-b border-border-subtle pb-[var(--space-4)]">
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full min-h-[44px] py-[var(--space-2)] text-left group"
        aria-expanded={isOpen}
      >
        <span className="text-sm font-semibold text-text-primary">{title}</span>
        <svg
          className={cn(
            'w-4 h-4 text-text-tertiary transition-transform duration-200 ease-out',
            isOpen && 'rotate-180'
          )}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      <div
        className={cn(
          'grid transition-[grid-template-rows] duration-200 ease-out',
          isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        )}
      >
        <div className="overflow-hidden">
          <div className="pt-[var(--space-3)]">{children}</div>
        </div>
      </div>
    </div>
  )
}
