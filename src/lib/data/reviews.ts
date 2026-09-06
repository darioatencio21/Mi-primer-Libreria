import { cache } from 'react'
import { and, desc, eq, isNull } from 'drizzle-orm'
import { db } from '@/lib/db/client'
import { books as booksTable, reviews as reviewsTable } from '@/lib/db/schema'
import { mapReview, type ReviewRow } from './mappers'
import type { Book, Review, ReviewPreview } from '@/lib/types'

export const getReviewsByBook = cache(async (bookId: string): Promise<Review[]> => {
  const rows = await db
    .select()
    .from(reviewsTable)
    .where(and(eq(reviewsTable.bookId, bookId), isNull(reviewsTable.userId)))
    .orderBy(desc(reviewsTable.createdAt))

  return rows.map((row) =>
    mapReview({
      id: row.id,
      book_id: row.bookId,
      user_id: row.userId,
      user_name: row.userName,
      rating: row.rating,
      title: row.title,
      content: row.content,
      helpful_count: row.helpfulCount,
      created_at: row.createdAt,
    } as ReviewRow)
  )
})

export async function getReviewPreviewsByBooks(
  books: Pick<Book, 'id' | 'title'>[]
): Promise<Record<string, ReviewPreview | null>> {
  const entries = await Promise.all(
    books.map(async (book) => {
      const [first] = await getReviewsByBook(book.id)
      if (!first) return [book.id, null] as const
      return [
        book.id,
        {
          content: first.content,
          userName: first.userName,
          rating: first.rating,
          bookTitle: book.title,
        },
      ] as const
    })
  )
  return Object.fromEntries(entries)
}

export const getRecentReviews = cache(async (limit = 8): Promise<ReviewPreview[]> => {
  const rows = await db
    .select({
      userName: reviewsTable.userName,
      rating: reviewsTable.rating,
      content: reviewsTable.content,
      bookTitle: booksTable.title,
    })
    .from(reviewsTable)
    .leftJoin(booksTable, eq(reviewsTable.bookId, booksTable.id))
    .where(isNull(reviewsTable.userId))
    .orderBy(desc(reviewsTable.createdAt))
    .limit(limit)

  return rows.map((row) => ({
    content: row.content,
    userName: row.userName,
    rating: row.rating,
    bookTitle: row.bookTitle ?? undefined,
  }))
})