import Link from 'next/link'
import { BookCard } from '@/components/product/BookCard'
import { Carousel } from '@/components/ui/Carousel'
import { getBestsellers } from '@/lib/data'

export async function BestsellersSection() {
  const bestsellers = await getBestsellers(10)

  return (
    <section className="py-[var(--space-24)]">
      <div className="mx-auto max-w-[var(--container-max)] px-[var(--space-6)] md:px-[var(--space-10)] lg:px-[var(--space-16)]">
        <div className="flex items-end justify-between mb-[var(--space-8)]">
          <h2 className="text-2xl md:text-4xl font-display font-normal text-text-primary tracking-[var(--tracking-4xl)]">
            Bestsellers del momento
          </h2>
          <Link
            href="/libros/bestsellers"
            className="hidden sm:inline-flex text-sm font-semibold text-brand-primary hover:underline decoration-[1.5px] underline-offset-[3px]"
          >
            Ver todos →
          </Link>
        </div>

        <Carousel gap={24}>
          {bestsellers.map((book) => (
            <div key={book.id} className="w-[280px] md:w-[300px]">
              <BookCard book={book} />
            </div>
          ))}
        </Carousel>
      </div>
    </section>
  )
}
