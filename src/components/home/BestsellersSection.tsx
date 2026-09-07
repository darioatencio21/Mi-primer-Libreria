import Link from 'next/link'
import { FormatFilterShelf } from '@/components/home/FormatFilterShelf'
import { getBestsellers } from '@/lib/data'

export async function BestsellersSection() {
  const bestsellers = await getBestsellers(10)

  return (
    <section className="pt-[var(--space-16)] md:pt-[var(--space-24)] pb-[var(--space-24)]">
      <div className="mx-auto max-w-[var(--container-max)] px-[var(--space-6)] md:px-[var(--space-10)] lg:px-[var(--space-16)]">
        <div className="flex items-end justify-between mb-[var(--space-8)]">
          <h2 className="text-2xl md:text-4xl font-display font-normal text-text-primary tracking-[var(--tracking-4xl)]">
            Bestsellers del momento
          </h2>
          <Link
            href="/libros/bestsellers"
            className="hidden sm:inline-flex items-center gap-[var(--space-1)] text-sm font-semibold text-brand-primary hover:underline decoration-[1.5px] underline-offset-[3px] transition-transform duration-[var(--duration-micro)] hover:translate-x-0.5"
          >
            Ver todos →
          </Link>
        </div>

        {bestsellers.length > 0 && (
          <FormatFilterShelf books={bestsellers} variant="carousel" />
        )}
      </div>
    </section>
  )
}