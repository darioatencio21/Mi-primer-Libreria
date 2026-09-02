import { cache } from 'react'
import { createDataClient } from './client'
import { mapReview, type ReviewRow } from './mappers'
import type { Review } from '@/lib/types'

export const getReviewsByBook = cache(async (bookId: string): Promise<Review[]> => {
  const supabase = createDataClient()

  const { data, error } = await supabase
    .from('reviews')
    .select('id, book_id, user_id, user_name, rating, title, content, helpful_count, created_at')
    .eq('book_id', bookId)
    .order('created_at', { ascending: false })

  if (error) throw error
  if (!data) return []

  return (data as unknown as ReviewRow[]).map(mapReview)
})