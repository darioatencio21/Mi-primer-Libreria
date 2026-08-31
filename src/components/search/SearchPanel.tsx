'use client'

import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Search, X, Clock, TrendingUp, ArrowRight } from 'lucide-react'
import { sanitizeSearchQuery } from '@/lib/sanitize'
import { formatArs } from '@/lib/format'

const MOCK_RECENT = ['García Márquez', 'Sapiens', 'Novela negra']
const MOCK_TRENDS = ['Haruki Murakami', 'Ciencia ficción', 'Historia', 'Isabel Allende', 'Borges']
const MOCK_CATEGORIES = [
  { name: 'Ficción', icon: 'book-open' },
  { name: 'No Ficción', icon: 'newspaper' },
  { name: 'Infantil', icon: 'baby' },
  { name: 'Académico', icon: 'graduation-cap' },
]

export function SearchPanel({
  isOpen,
  onClose,
}: {
  isOpen: boolean
  onClose: () => void
}) {
  const [query, setQuery] = useState('')
  const [recentSearches, setRecentSearches] = useState(MOCK_RECENT)
  const inputRef = useRef<HTMLInputElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const showResults = useMemo(() => query.trim().length > 0, [query])

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  const handleClose = useCallback(() => {
    setQuery('')
    onClose()
  }, [onClose])

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      const sanitized = sanitizeSearchQuery(query)
      if (sanitized) {
        router.push(`/buscar?q=${encodeURIComponent(sanitized)}`)
        handleClose()
      }
    },
    [query, router, handleClose]
  )

  const handleSuggestionClick = (term: string) => {
    setQuery(term)
    router.push(`/buscar?q=${encodeURIComponent(term)}`)
    handleClose()
  }

  const removeRecent = (term: string) => {
    setRecentSearches((prev) => prev.filter((r) => r !== term))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Buscar libros">
      <div
        className="absolute inset-0 bg-[rgba(23,20,15,0.4)] animate-[fadeIn_200ms_ease-out]"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={panelRef}
        className="relative mx-auto max-w-[640px] mt-[var(--space-16)] px-[var(--space-4)] animate-[fadeInUp_250ms_var(--ease-out-quint)]"
      >
        <div className="bg-bg-elevated rounded-[var(--radius-lg)] shadow-[var(--shadow-xl)] overflow-hidden">
          <form onSubmit={handleSubmit} className="flex items-center gap-[var(--space-3)] px-[var(--space-4)] border-b border-border-subtle">
            <Search className="w-5 h-5 text-text-tertiary shrink-0" aria-hidden="true" />
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Busca por título, autor, ISBN o editorial..."
              className="flex-1 h-[var(--height-search)] bg-transparent text-base text-text-primary placeholder:text-text-tertiary outline-none"
              role="combobox"
              aria-expanded={showResults}
              aria-controls="search-results"
              aria-autocomplete="list"
              autoComplete="off"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="p-[var(--space-1)] text-text-tertiary hover:text-text-primary transition-colors duration-[var(--duration-micro)]"
                aria-label="Limpiar búsqueda"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              type="button"
              onClick={handleClose}
              className="p-[var(--space-2)] text-text-tertiary hover:text-text-primary transition-colors duration-[var(--duration-micro)]"
              aria-label="Cerrar búsqueda"
            >
              <X className="w-5 h-5" />
            </button>
          </form>

          <div id="search-results" className="max-h-[60vh] overflow-y-auto p-[var(--space-4)]">
            {!showResults ? (
              <>
                {recentSearches.length > 0 && (
                  <div className="mb-[var(--space-6)]">
                    <p className="text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-[var(--space-3)]">
                      Búsquedas recientes
                    </p>
                    <div className="flex flex-wrap gap-[var(--space-2)]">
                      {recentSearches.map((term) => (
                        <button
                          key={term}
                          onClick={() => handleSuggestionClick(term)}
                          className="inline-flex items-center gap-[var(--space-2)] px-[var(--space-3)] py-[var(--space-2)] bg-bg-muted rounded-[var(--radius-full)] text-sm text-text-secondary hover:bg-brand-primary-light hover:text-brand-primary transition-colors duration-[var(--duration-micro)]"
                        >
                          <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                          {term}
                          <span
                            role="button"
                            tabIndex={0}
                            onClick={(e) => {
                              e.stopPropagation()
                              removeRecent(term)
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.stopPropagation()
                                removeRecent(term)
                              }
                            }}
                            className="ml-[var(--space-1)] text-text-tertiary hover:text-text-primary"
                            aria-label={`Eliminar ${term} de recientes`}
                          >
                            <X className="w-3 h-3" />
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mb-[var(--space-6)]">
                  <p className="text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-[var(--space-3)]">
                    Tendencias
                  </p>
                  <div className="flex flex-wrap gap-[var(--space-2)]">
                    {MOCK_TRENDS.map((term) => (
                      <button
                        key={term}
                        onClick={() => handleSuggestionClick(term)}
                        className="inline-flex items-center gap-[var(--space-2)] px-[var(--space-3)] py-[var(--space-2)] bg-bg-muted rounded-[var(--radius-full)] text-sm text-text-secondary hover:bg-brand-primary-light hover:text-brand-primary transition-colors duration-[var(--duration-micro)]"
                      >
                        <TrendingUp className="w-3.5 h-3.5" aria-hidden="true" />
                        {term}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-[var(--space-3)]">
                    Categorías populares
                  </p>
                  <div className="grid grid-cols-2 gap-[var(--space-2)]">
                    {MOCK_CATEGORIES.map((cat) => (
                      <button
                        key={cat.name}
                        onClick={() => handleSuggestionClick(cat.name)}
                        className="flex items-center gap-[var(--space-3)] p-[var(--space-3)] rounded-[var(--radius-md)] hover:bg-bg-muted transition-colors duration-[var(--duration-micro)] text-left"
                      >
                        <div className="w-8 h-8 rounded-[var(--radius-sm)] bg-brand-primary-light flex items-center justify-center">
                          <Search className="w-4 h-4 text-brand-primary" aria-hidden="true" />
                        </div>
                        <span className="text-sm text-text-primary">{cat.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="mb-[var(--space-4)]">
                  <p className="text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-[var(--space-2)]">
                    Sugerencias
                  </p>
                  {['Cien años de soledad', 'El coronel no tiene quien le escriba', 'Crónica de una muerte anunciada'].slice(0, 4).map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="w-full flex items-center gap-[var(--space-3)] px-[var(--space-3)] py-[var(--space-2)] rounded-[var(--radius-sm)] hover:bg-bg-muted transition-colors duration-[var(--duration-micro)] text-left"
                    >
                      <Search className="w-4 h-4 text-text-tertiary" aria-hidden="true" />
                      <span className="text-sm text-text-primary">
                        {suggestion.split(new RegExp(`(${query})`, 'i')).map((part, i) =>
                          part.toLowerCase() === query.toLowerCase() ? (
                            <strong key={i} className="font-semibold">{part}</strong>
                          ) : (
                            <span key={i}>{part}</span>
                          )
                        )}
                      </span>
                    </button>
                  ))}
                </div>

                <div className="mb-[var(--space-4)]">
                  <p className="text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-[var(--space-2)]">
                    Libros
                  </p>
                  {[
                    { id: '1', title: 'Cien años de soledad', author: 'Gabriel García Márquez', price: 24.99, coverImage: '/placeholder-book.svg', slug: 'cien-anos-de-soledad', categorySlug: 'ficcion' },
                    { id: '2', title: 'El amor en los tiempos del cólera', author: 'Gabriel García Márquez', price: 18.39, coverImage: '/placeholder-book.svg', slug: 'amor-tiempos-colera', categorySlug: 'ficcion' },
                  ].map((book) => (
                    <Link
                      key={book.id}
                      href={`/libros/${book.categorySlug}/${book.slug}`}
                      onClick={handleClose}
                      className="flex items-center gap-[var(--space-3)] px-[var(--space-3)] py-[var(--space-2)] rounded-[var(--radius-sm)] hover:bg-bg-muted transition-colors duration-[var(--duration-micro)]"
                    >
                      <div className="w-10 h-14 rounded-[var(--radius-sm)] bg-bg-muted overflow-hidden shrink-0 relative">
                        <Image src={book.coverImage} alt="" fill className="object-contain p-1" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-text-primary truncate">{book.title}</p>
                        <p className="text-xs text-text-tertiary">{book.author}</p>
                      </div>
                      <span className="text-sm font-semibold text-text-primary shrink-0">
                        {formatArs(book.price)}
                      </span>
                    </Link>
                  ))}
                </div>

                <div className="mb-[var(--space-4)]">
                  <p className="text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-[var(--space-2)]">
                    Autores
                  </p>
                  {[
                    { id: 'a1', name: 'Gabriel García Márquez', bookCount: 12, slug: 'garcia-marquez' },
                  ].map((author) => (
                    <Link
                      key={author.id}
                      href={`/autores/${author.slug}`}
                      onClick={handleClose}
                      className="flex items-center gap-[var(--space-3)] px-[var(--space-3)] py-[var(--space-2)] rounded-[var(--radius-sm)] hover:bg-bg-muted transition-colors duration-[var(--duration-micro)]"
                    >
                      <div className="w-8 h-8 rounded-full bg-bg-muted flex items-center justify-center shrink-0">
                        <span className="text-xs font-semibold text-text-tertiary">
                          {author.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-text-primary">{author.name}</p>
                        <p className="text-xs text-text-tertiary">{author.bookCount} libros</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-text-tertiary" aria-hidden="true" />
                    </Link>
                  ))}
                </div>

                <div className="border-t border-border-subtle pt-[var(--space-3)]">
                  <button
                    onClick={() => handleSuggestionClick(query)}
                    className="w-full flex items-center justify-center gap-[var(--space-2)] py-[var(--space-3)] text-sm font-semibold text-brand-primary hover:bg-brand-primary-light rounded-[var(--radius-sm)] transition-colors duration-[var(--duration-micro)]"
                  >
                    Ver todos los resultados para &ldquo;{query}&rdquo;
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
