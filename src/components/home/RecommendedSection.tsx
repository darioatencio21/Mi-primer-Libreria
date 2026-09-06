import Link from 'next/link'
import { FormatFilterShelf } from '@/components/home/FormatFilterShelf'
import { RotatingOpinions } from '@/components/home/RotatingOpinions'
import { getNewReleases, getReviewPreviewsByBooks } from '@/lib/data'

export async function RecommendedSection() {
  const libros = await getNewReleases(8)
  const reviewPreviews = await getReviewPreviewsByBooks(libros)

  const opinions = Object.values(reviewPreviews).filter(
    (preview): preview is NonNullable<typeof preview> => preview !== null
  )

  return (
    <section className="py-[var(--space-24)] bg-bg-muted">
      <div className="mx-auto max-w-[var(--container-max)] px-[var(--space-6)] md:px-[var(--space-10)] lg:px-[var(--space-16)]">
        <div className="flex items-end justify-between mb-[var(--space-8)]">
          <h2 className="text-2xl md:text-4xl font-display font-normal text-text-primary tracking-[var(--tracking-4xl)]">
            Recomendados para ti
          </h2>
          <Link
            href="/libros/recomendados"
            className="hidden sm:inline-flex items-center gap-[var(--space-1)] text-sm font-semibold text-brand-primary hover:underline decoration-[1.5px] underline-offset-[3px] transition-transform duration-[var(--duration-micro)] hover:translate-x-0.5"
          >
            Ver más →
          </Link>
        </div>

        {opinions.length > 0 && <RotatingOpinions items={opinions} />}

        {libros.length > 0 && (
          <FormatFilterShelf books={libros} variant="grid" reviewPreviews={reviewPreviews} />
        )}
      </div>
    </section>
  )
}