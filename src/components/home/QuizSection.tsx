import { BookQuiz } from './BookQuiz'
import { getBestsellers, getNewReleases } from '@/lib/data'

export async function QuizSection() {
  const [bestsellers, newReleases] = await Promise.all([getBestsellers(8), getNewReleases(8)])

  const pool = [...bestsellers, ...newReleases].filter(
    (book, index, all) => all.findIndex((b) => b.id === book.id) === index
  )

  if (pool.length === 0) return null

  return (
    <section className="py-[var(--space-24)] bg-bg-muted">
      <div className="mx-auto max-w-[var(--container-max)] px-[var(--space-6)] md:px-[var(--space-10)] lg:px-[var(--space-16)]">
        <BookQuiz pool={pool} />
      </div>
    </section>
  )
}