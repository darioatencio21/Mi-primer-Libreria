import { cache } from 'react'
import { createDataClient } from './client'
import { mapAuthor, type AuthorRow } from './mappers'
import type { Author } from '@/lib/types'

export const getFeaturedAuthors = cache(async (limit = 8): Promise<Author[]> => {
  const supabase = createDataClient()

  const { data, error } = await supabase
    .from('authors')
    .select('id, name, slug, bio, photo_url, book_count:books(count)')
    .order('name')
    .limit(limit)

  if (error) throw error
  if (!data) return []

  return (data as unknown as AuthorRow[]).map(mapAuthor)
})

export const getAllAuthors = cache(async (): Promise<Author[]> => {
  const supabase = createDataClient()

  const { data, error } = await supabase
    .from('authors')
    .select('id, name, slug, bio, photo_url, book_count:books(count)')
    .order('name')

  if (error) throw error
  if (!data) return []

  return (data as unknown as AuthorRow[]).map(mapAuthor)
})

export const getAuthorBySlug = cache(async (slug: string): Promise<Author | null> => {
  const supabase = createDataClient()

  const { data, error } = await supabase
    .from('authors')
    .select('id, name, slug, bio, photo_url, book_count:books(count)')
    .eq('slug', slug)
    .maybeSingle()

  if (error) throw error
  if (!data) return null

  return mapAuthor(data as unknown as AuthorRow)
})