import Link from 'next/link'
import { Carousel } from '@/components/ui/Carousel'
import { getFeaturedAuthors, getAllAuthors } from '@/lib/data'
import { AuthorAvatar } from '@/components/ui/AuthorAvatar'
import { AuthorsExpander } from './AuthorsExpander'

export async function AuthorsSection() {
  const featured = await getFeaturedAuthors(10)
  const all = await getAllAuthors()

  return (
    <section className="py-[var(--space-24)]">
      <div className="mx-auto max-w-[var(--container-max)] px-[var(--space-6)] md:px-[var(--space-10)] lg:px-[var(--space-16)]">
        <h2 className="text-2xl md:text-4xl font-display font-normal text-text-primary tracking-[var(--tracking-4xl)] mb-[var(--space-8)]">
          Autores destacados
        </h2>

        <Carousel gap={16} showDots snapMode="proximity">
          {featured.map((author) => (
            <Link
              key={author.id}
              href={`/autores/${author.slug}`}
              className="w-[160px] flex flex-col items-center text-center group"
            >
              <div className="w-28 h-28 rounded-full bg-bg-muted border-2 border-border-subtle overflow-hidden mb-[var(--space-4)] group-hover:border-brand-primary transition-colors duration-200">
                <AuthorAvatar name={author.name} photo={author.photo} variant="circle" sizes="112px" />
              </div>
              <h3 className="text-base font-semibold text-text-primary mb-[var(--space-1)] group-hover:text-brand-primary transition-colors duration-[var(--duration-micro)]">
                {author.name}
              </h3>
              <p className="text-xs text-text-tertiary">{author.bookCount} libros</p>
            </Link>
          ))}
        </Carousel>

        <AuthorsExpander authors={all} />
      </div>
    </section>
  )
}