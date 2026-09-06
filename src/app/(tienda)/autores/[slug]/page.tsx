import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getAuthorBySlug, getBooksByAuthor } from '@/lib/data'
import { BookCard } from '@/components/product/BookCard'
import { AuthorAvatar } from '@/components/ui/AuthorAvatar'

export const revalidate = 3600

interface AuthorPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: AuthorPageProps): Promise<Metadata> {
  const { slug } = await params
  const author = await getAuthorBySlug(slug)

  if (!author) {
    return { title: 'Autor no encontrado' }
  }

  return {
    title: author.name,
    description: author.bio ? author.bio.slice(0, 155) : `Libros de ${author.name} en Tus Libros Ya.`,
  }
}

export default async function AuthorPage({ params }: AuthorPageProps) {
  const { slug } = await params
  const author = await getAuthorBySlug(slug)

  if (!author) {
    notFound()
  }

  const books = await getBooksByAuthor(slug)

  return (
    <>
      <section className="bg-bg-muted py-[var(--space-8)] md:py-[var(--space-12)]">
        <div className="mx-auto max-w-[var(--container-max)] px-[var(--space-6)] md:px-[var(--space-10)] lg:px-[var(--space-16)]">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-[var(--space-6)] text-center sm:text-left">
            <div className="w-28 h-28 md:w-36 md:h-36 rounded-full bg-bg-surface border-2 border-border-subtle overflow-hidden shrink-0">
              <AuthorAvatar name={author.name} photo={author.photo} variant="circle" sizes="144px" />
            </div>
            <div>
              <h1 className="text-2xl md:text-4xl font-display font-normal text-text-primary tracking-[var(--tracking-4xl)] mb-[var(--space-2)]">
                {author.name}
              </h1>
              <p className="text-sm text-text-tertiary mb-[var(--space-3)]">
                {author.bookCount} {author.bookCount === 1 ? 'libro' : 'libros'} en el catálogo
              </p>
              {author.bio && (
                <p className="text-sm md:text-base text-text-secondary max-w-[640px]">{author.bio}</p>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[var(--container-max)] px-[var(--space-4)] md:px-[var(--space-10)] lg:px-[var(--space-16)] py-[var(--space-12)] md:py-[var(--space-16)]">
        <h2 className="text-lg md:text-2xl font-display font-normal text-text-primary tracking-[var(--tracking-3xl)] mb-[var(--space-6)] md:mb-[var(--space-8)]">
          Libros de {author.name}
        </h2>
        {books.length === 0 ? (
          <p className="text-sm text-text-secondary text-center py-[var(--space-16)]">
            Todavía no hay libros publicados de este autor.
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-[var(--space-4)] md:gap-[var(--space-6)]">
            {books.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        )}
      </div>
    </>
  )
}