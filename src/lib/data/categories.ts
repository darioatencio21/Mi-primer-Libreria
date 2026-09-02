import { cache } from 'react'
import { createDataClient } from './client'
import { mapCategory, type CategoryRow } from './mappers'
import type { Category } from '@/lib/types'

export const getCategories = cache(async (): Promise<Category[]> => {
  const supabase = createDataClient()

  const { data, error } = await supabase
    .from('categories')
    .select('id, name, slug, description, icon, book_count:books(count)')
    .order('name')

  if (error) throw error
  if (!data) return []

  return (data as unknown as CategoryRow[]).map(mapCategory)
})