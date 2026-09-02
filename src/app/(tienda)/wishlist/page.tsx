'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useWishlist } from '@/lib/store'
import type { Book } from '@/lib/types'
import { BookCard } from '@/components/product/BookCard'
import { EmptyState } from '@/components/ui/EmptyState'

export default function WishlistPage() {
  const ids = useWishlist((state) => state.ids)
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function load() {
      if (ids.length === 0) {
        setBooks([])
        setLoading(false)
        return
      }
      setLoading(true)
      try {
        const res = await fetch(`/api/books?ids=${ids.join(',')}`)
        if (res.ok) {
          const data = await res.json()
          if (!cancelled) setBooks(data.books ?? [])
        }
      } catch {
        if (!cancelled) setBooks([])
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [ids])

  const empty = !loading && ids.length === 0
  const nothingFound = !loading && ids.length > 0 && books.length === 0

  return (
    <div className="mx-auto max-w-[var(--container-max)] px-[var(--space-4)] md:px-[var(--space-10)] lg:px-[var(--space-16)] py-[var(--space-12)] md:py-[var(--space-16)]">
      <h1 className="text-2xl md:text-4xl font-display font-normal text-text-primary tracking-[var(--tracking-4xl)] mb-[var(--space-2)]">
        Lista de deseos
      </h1>
      <p className="text-sm text-text-secondary mb-[var(--space-8)] md:mb-[var(--space-12)]">
        Tus libros favoritos guardados para más adelante.
      </p>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-[var(--space-4)] md:gap-[var(--space-6)]">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-[var(--radius-md)] bg-bg-muted animate-pulse h-[320px]" />
          ))}
        </div>
      ) : empty ? (
        <EmptyState
          variant="wishlist"
          title="Tu lista está vacía"
          description="Guardá los libros que te interesan para encontrarlos fácilmente después."
        />
      ) : nothingFound ? (
        <EmptyState
          variant="wishlist"
          title="No encontramos tus libros"
          description="Algunos libros de tu lista ya no están disponibles. Explorá el catálogo para descubrir nuevos títulos."
        />
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-[var(--space-4)] md:gap-[var(--space-6)]">
            {books.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
          <div className="mt-[var(--space-10)] text-center">
            <Link
              href="/libros"
              className="inline-flex items-center justify-center h-[var(--height-btn-md)] px-[var(--space-6)] rounded-[var(--radius-md)] bg-brand-primary text-text-on-brand font-semibold text-sm hover:bg-brand-primary-hover transition-colors duration-[var(--duration-micro)]"
            >
              Explorar catálogo
            </Link>
          </div>
        </>
      )}
    </div>
  )
}