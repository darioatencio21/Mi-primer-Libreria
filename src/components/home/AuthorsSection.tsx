import Link from 'next/link'
import { Carousel } from '@/components/ui/Carousel'
import { getFeaturedAuthors } from '@/lib/data'
import { AuthorAvatar } from '@/components/ui/AuthorAvatar'

export async function AuthorsSection() {
  const autores = await getFeaturedAuthors(10)

  return (
    <section className="py-[var(--space-24)]">
      <div className="mx-auto max-w-[var(--container-max)] px-[var(--space-6)] md:px-[var(--space-10)] lg:px-[var(--space-16)]">
        <div className="flex items-end justify-between mb-[var(--space-8)]">
          <h2 className="text-2xl md:text-4xl font-display font-normal text-text-primary tracking-[var(--tracking-4xl)]">
            Autores destacados
          </h2>
          <Link
            href="/autores"
            className="hidden sm:inline-flex text-sm font-semibold text-brand-primary hover:underline decoration-[1.5px] underline-offset-[3px]"
          >
            Ver todos →
          </Link>
        </div>

        <Carousel gap={24}>
          {autores.map((author) => (
            <Link
              key={author.id}
              href={`/autores/${author.slug}`}
              className="w-[200px] flex flex-col items-center text-center group"
            >
              <div className="w-32 h-32 rounded-full bg-bg-muted border-2 border-border-subtle overflow-hidden mb-[var(--space-4)] group-hover:border-brand-primary transition-colors duration-200">
                <AuthorAvatar name={author.name} photo={author.photo} variant="circle" sizes="128px" />
              </div>
              <h3 className="text-base font-semibold text-text-primary mb-[var(--space-1)] group-hover:text-brand-primary transition-colors duration-[var(--duration-micro)]">
                {author.name}
              </h3>
              <p className="text-xs text-text-tertiary">{author.bookCount} libros</p>
            </Link>
          ))}
        </Carousel>
      </div>
    </section>
  )
}
