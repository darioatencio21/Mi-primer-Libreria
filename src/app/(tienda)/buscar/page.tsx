import type { Metadata } from 'next'
import { ResultsViewer } from '@/components/search/ResultsViewer'
import { searchBooks } from '@/lib/data'
import { sanitizeSearchQuery } from '@/lib/sanitize'

export const metadata: Metadata = {
  title: 'Buscar libros',
  description: 'Buscá por título, autor, ISBN o editorial en Nova Books.',
}

interface SearchPageProps {
  searchParams: Promise<{ q?: string | string[] }>
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams
  const rawQuery = typeof params.q === 'string' ? params.q : ''
  const query = sanitizeSearchQuery(rawQuery)

  let results: Awaited<ReturnType<typeof searchBooks>> = []
  if (query) {
    results = await searchBooks(query)
  }

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
      </div>

      {results.length === 0 && query ? (
        <div className="py-[var(--space-16)] text-center">
          <p className="text-base font-medium text-text-primary mb-[var(--space-2)]">
            No encontramos resultados para &ldquo;{query}&rdquo;
          </p>
          <p className="text-sm text-text-secondary">
            Intentá con otros términos o explorá nuestras categorías.
          </p>
        </div>
      ) : (
        <ResultsViewer
          books={results}
          initialFilters={{ query }}
        />
      )}
    </div>
  )
}