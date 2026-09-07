'use client'

import { useState } from 'react'
import { BookCard } from '@/components/product/BookCard'
import { Carousel } from '@/components/ui/Carousel'
import { cn } from '@/lib/utils'
import type { Book, BookFormat } from '@/lib/types'

type Filter = 'all' | 'fisico' | BookFormat['type']

const FILTERS: { id: Filter; label: string }[] = [
  { id: 'all', label: 'Todos' },
  { id: 'fisico', label: 'Libro físico' },
  { id: 'hardcover', label: 'Tapa dura' },
  { id: 'paperback', label: 'Tapa blanda' },
  { id: 'ebook', label: 'Ebook' },
  { id: 'audiobook', label: 'Audiolibro' },
]

function matchesFilter(book: Book, filter: Filter): boolean {
  if (filter === 'all') return true
  if (filter === 'fisico') {
    return book.formats.some((f) => f.type === 'hardcover' || f.type === 'paperback')
  }
  return book.formats.some((f) => f.type === filter)
}

interface FormatFilterShelfProps {
  books: Book[]
  variant: 'carousel' | 'grid'
}

export function FormatFilterShelf({ books, variant }: FormatFilterShelfProps) {
  const [filter, setFilter] = useState<Filter>('all')

  const counts = FILTERS.map((f) => ({
    ...f,
    count: books.filter((b) => matchesFilter(b, f.id)).length,
  })) as { id: Filter; label: string; count: number }[]

  const filtered = books.filter((b) => matchesFilter(b, filter))

  return (
    <>
      <div
        className="flex items-center gap-[var(--space-2)] mb-[var(--space-6)] overflow-x-auto scrollbar-hide snap-x snap-proximity lg:flex-wrap lg:overflow-visible lg:snap-none [mask-image:linear-gradient(to_right,#000_88%,transparent_100%)] lg:[mask-image:none]"
        role="group"
        aria-label="Filtrar por formato"
      >
        {counts.map((option) => {
          const active = filter === option.id
          return (
            <button
              key={option.id}
              onClick={() => setFilter(option.id)}
              aria-pressed={active}
              className={cn(
                'shrink-0 snap-start inline-flex items-center gap-[var(--space-2)] h-11 px-[var(--space-4)] rounded-[var(--radius-full)] border text-sm font-medium transition-all duration-[var(--duration-micro)]',
                active
                  ? 'border-brand-primary bg-brand-primary text-text-on-brand'
                  : 'border-border-subtle bg-bg-surface text-text-secondary hover:border-brand-primary hover:text-brand-primary'
              )}
            >
              {option.label}
              <span
                className={cn(
                  'text-xs tabular-nums',
                  active ? 'text-text-on-brand/80' : 'text-text-tertiary'
                )}
              >
                {option.count}
              </span>
            </button>
          )
        })}
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm text-text-secondary py-[var(--space-8)]">
          No hay libros en este formato por ahora.
        </p>
      ) : variant === 'carousel' ? (
        <Carousel gap={16} edgeFade>
          {filtered.map((book) => (
            <div key={book.id} className="w-[70vw] max-w-[300px] md:w-[300px]">
              <BookCard book={book} />
            </div>
          ))}
        </Carousel>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-[var(--space-4)] lg:gap-[var(--space-6)]">
          {filtered.map((book) => (
            <BookCard
              key={book.id}
              book={book}
            />
          ))}
        </div>
      )}
    </>
  )
}