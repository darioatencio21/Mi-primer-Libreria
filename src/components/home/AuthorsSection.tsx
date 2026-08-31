import Link from 'next/link'
import Image from 'next/image'
import { Carousel } from '@/components/ui/Carousel'
import { getAutores } from '@/lib/db'

export async function AuthorsSection() {
  const autores = await getAutores(10)

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
                {author.photo ? (
                  <Image
                    src={author.photo}
                    alt={author.name}
                    width={128}
                    height={128}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-text-tertiary">
                    <svg
                      className="w-16 h-16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <circle cx="12" cy="8" r="4" />
                      <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
                    </svg>
                  </div>
                )}
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
