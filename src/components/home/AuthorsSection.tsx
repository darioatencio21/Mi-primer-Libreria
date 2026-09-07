import Link from 'next/link'
import { Carousel } from '@/components/ui/Carousel'
import { getFeaturedAuthors } from '@/lib/data'
import { AuthorCard } from '@/components/ui/AuthorCard'
import { Plus } from 'lucide-react'

export async function AuthorsSection() {
  const featured = await getFeaturedAuthors(10)

  return (
    <section className="py-[var(--space-24)]">
      <div className="mx-auto max-w-[var(--container-max)] px-[var(--space-6)] md:px-[var(--space-10)] lg:px-[var(--space-16)]">
        <h2 className="text-2xl md:text-4xl font-display font-normal text-text-primary tracking-[var(--tracking-4xl)] mb-[var(--space-8)]">
          Autores destacados
        </h2>

        <Carousel gap={16} showDots snapMode="proximity">
          {featured.map((author) => (
            <AuthorCard key={author.id} author={author} className="w-[160px]" />
          ))}

          <Link
            href="/autores"
            className="w-[160px] flex flex-col items-center text-center group"
            aria-label="Ver todos los autores"
          >
            <div className="w-28 h-28 rounded-full bg-bg-muted border-2 border-dashed border-border-subtle flex items-center justify-center text-text-tertiary mb-[var(--space-4)] group-hover:border-brand-primary group-hover:text-brand-primary transition-colors duration-200">
              <Plus className="w-9 h-9" aria-hidden="true" />
            </div>
            <span className="text-base font-semibold text-text-primary group-hover:text-brand-primary transition-colors duration-[var(--duration-micro)]">
              Ver más
            </span>
          </Link>
        </Carousel>
      </div>
    </section>
  )
}