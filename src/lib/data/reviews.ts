import { cache } from 'react'
import { and, desc, eq, isNull } from 'drizzle-orm'
import { db } from '@/lib/db/client'
import { reviews as reviewsTable } from '@/lib/db/schema'
import { mapReview, type ReviewRow } from './mappers'
import type { Review } from '@/lib/types'

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