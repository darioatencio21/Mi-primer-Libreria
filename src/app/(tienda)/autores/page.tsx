import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllAuthors } from '@/lib/data'
import { AuthorAvatar } from '@/components/ui/AuthorAvatar'

export const metadata: Metadata = {
  title: 'Autores',
  description: 'Conocé a los autores destacados de Tus Libros Ya.',
}

export const revalidate = 3600

export default async function AutoresPage() {
  const authors = await getAllAuthors()

  return (
    <>
      <section className="min-h-[160px] bg-bg-muted flex items-center py-[var(--space-8)]">
        <div className="mx-auto max-w-[var(--container-max)] px-[var(--space-6)] md:px-[var(--space-10)] lg:px-[var(--space-16)] w-full">
          <h1 className="text-2xl md:text-4xl font-display font-normal text-text-primary tracking-[var(--tracking-4xl)] mb-[var(--space-2)]">
            Autores
          </h1>
          <p className="text-sm text-text-secondary">Descubrí las voces que forman parte de nuestro catálogo.</p>
        </div>
      </section>

      <div className="mx-auto max-w-[var(--container-max)] px-[var(--space-4)] md:px-[var(--space-10)] lg:px-[var(--space-16)] py-[var(--space-12)] md:py-[var(--space-16)]">
        {authors.length === 0 ? (
          <p className="text-sm text-text-secondary text-center py-[var(--space-16)]">
            Todavía no hay autores publicados.
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-[var(--space-6)] md:gap-[var(--space-8)]">
            {authors.map((author) => (
              <Link
                key={author.id}
                href={`/autores/${author.slug}`}
                className="flex flex-col items-center text-center group"
              >
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-bg-muted border-2 border-border-subtle overflow-hidden mb-[var(--space-3)] md:mb-[var(--space-4)] group-hover:border-brand-primary transition-colors duration-200">
                  <AuthorAvatar name={author.name} photo={author.photo} variant="circle" sizes="128px" />
                </div>
                <h2 className="text-sm md:text-base font-semibold text-text-primary mb-[var(--space-1)] group-hover:text-brand-primary transition-colors duration-[var(--duration-micro)]">
                  {author.name}
                </h2>
                <p className="text-xs text-text-tertiary">
                  {author.bookCount} {author.bookCount === 1 ? 'libro' : 'libros'}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  )
}