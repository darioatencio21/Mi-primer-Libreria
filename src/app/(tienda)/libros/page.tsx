import Link from 'next/link'
import type { Metadata } from 'next'
import { getCategories } from '@/lib/data'
import { CATEGORIES } from '@/lib/constants'
import { BookOpen, Newspaper, Baby, Heart, GraduationCap, Image, Feather, Atom, Sparkles } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Libros',
  description: 'Explorá nuestro catálogo de libros por categoría.',
}

const iconMap = {
  'book-open': BookOpen,
  newspaper: Newspaper,
  baby: Baby,
  heart: Heart,
  'graduation-cap': GraduationCap,
  image: Image,
  feather: Feather,
  atom: Atom,
}

const COLLECTION_SLUGS = ['bestsellers', 'novedades', 'ofertas', 'recomendados']

export const revalidate = 3600

export default async function LibrosPage() {
  const categories = await getCategories()
  const hasCategories = categories.length > 0

  return (
    <>
      <section className="min-h-[160px] bg-bg-muted flex items-center py-[var(--space-8)]">
        <div className="mx-auto max-w-[var(--container-max)] px-[var(--space-6)] md:px-[var(--space-10)] lg:px-[var(--space-16)] w-full">
          <h1 className="text-2xl md:text-4xl font-display font-normal text-text-primary tracking-[var(--tracking-4xl)] mb-[var(--space-2)]">
            Libros
          </h1>
          <p className="text-sm text-text-secondary">Explorá el catálogo por categoría o colección.</p>
        </div>
      </section>

      <div className="mx-auto max-w-[var(--container-max)] px-[var(--space-4)] md:px-[var(--space-10)] lg:px-[var(--space-16)] py-[var(--space-12)] md:py-[var(--space-16)]">
        <div className="flex items-center justify-between mb-[var(--space-6)]">
          <h2 className="text-lg md:text-2xl font-display font-normal text-text-primary tracking-[var(--tracking-3xl)]">
            Colecciones
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-[var(--space-4)] mb-[var(--space-12)] md:mb-[var(--space-16)]">
          {COLLECTION_SLUGS.map((slug) => {
            const label = slug.charAt(0).toUpperCase() + slug.slice(1)
            return (
              <Link
                key={slug}
                href={`/libros/${slug}`}
                className="flex flex-col items-start justify-between gap-[var(--space-4)] p-[var(--space-5)] md:p-[var(--space-6)] rounded-[var(--radius-md)] border border-border-subtle bg-bg-surface hover:border-brand-primary hover:shadow-[var(--shadow-md)] transition-all duration-200 group"
              >
                <div className="w-10 h-10 rounded-full bg-brand-primary-light flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-brand-primary" strokeWidth={1.5} aria-hidden="true" />
                </div>
                <span className="text-sm font-semibold text-text-primary group-hover:text-brand-primary transition-colors duration-200">
                  {label}
                </span>
              </Link>
            )
          })}
        </div>

        {hasCategories && (
          <>
            <div className="flex items-center justify-between mb-[var(--space-6)]">
              <h2 className="text-lg md:text-2xl font-display font-normal text-text-primary tracking-[var(--tracking-3xl)]">
                Categorías
              </h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-[var(--space-4)]">
              {categories.map((category) => {
                const match = CATEGORIES.find((c) => c.slug === category.slug)
                const Icon = iconMap[(match?.icon ?? 'book-open') as keyof typeof iconMap]
                return (
                  <Link
                    key={category.slug}
                    href={`/libros/${category.slug}`}
                    className="flex flex-col items-center gap-[var(--space-3)] p-[var(--space-6)] rounded-[var(--radius-md)] border border-border-subtle bg-bg-surface hover:border-brand-primary hover:shadow-[var(--shadow-md)] transition-all duration-200 group text-center"
                  >
                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-bg-muted flex items-center justify-center group-hover:bg-brand-primary-light transition-colors duration-200">
                      <Icon className="w-6 h-6 text-brand-primary" strokeWidth={1.5} aria-hidden="true" />
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-text-primary block group-hover:text-brand-primary transition-colors duration-200">
                        {category.name}
                      </span>
                      <span className="text-xs text-text-tertiary">
                        {category.bookCount} {category.bookCount === 1 ? 'libro' : 'libros'}
                      </span>
                    </div>
                  </Link>
                )
              })}
            </div>
          </>
        )}
      </div>
    </>
  )
}