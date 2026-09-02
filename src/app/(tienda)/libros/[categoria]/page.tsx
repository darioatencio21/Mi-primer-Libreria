import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ResultsViewer } from '@/components/search/ResultsViewer'
import { getCatalogBySlug, getCatalogSlugs } from '@/lib/data'
import { CATEGORIES } from '@/lib/constants'

export const revalidate = 3600

interface CategoryPageProps {
  params: Promise<{ categoria: string }>
}

export async function generateStaticParams() {
  const slugs = await getCatalogSlugs()
  return slugs.map((categoria) => ({ categoria }))
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { categoria } = await params
  const catalog = await getCatalogBySlug(categoria)

  if (!catalog) {
    return { title: 'Categoría no encontrada' }
  }

  return {
    title: catalog.title,
    description: catalog.description,
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { categoria } = await params
  const catalog = await getCatalogBySlug(categoria)

  if (!catalog) {
    notFound()
  }

  const categorySlug = CATEGORIES.some((c) => c.slug === categoria) ? categoria : undefined

  return (
    <>
      <section className="min-h-[160px] bg-bg-muted flex items-center py-[var(--space-8)]">
        <div className="mx-auto max-w-[var(--container-max)] px-[var(--space-6)] md:px-[var(--space-10)] lg:px-[var(--space-16)] w-full">
          <h1 className="text-2xl md:text-4xl font-display font-normal text-text-primary tracking-[var(--tracking-4xl)] mb-[var(--space-2)]">
            {catalog.title}
          </h1>
          <p className="text-sm text-text-secondary">{catalog.description}</p>
        </div>
      </section>

      <div className="mx-auto max-w-[var(--container-max)] px-[var(--space-6)] md:px-[var(--space-10)] lg:px-[var(--space-16)] py-[var(--space-8)]">
        <ResultsViewer
          books={catalog.books}
          initialFilters={{ category: categorySlug }}
        />
      </div>
    </>
  )
}