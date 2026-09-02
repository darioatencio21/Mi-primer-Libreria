import { cache } from 'react'
import { createDataClient } from './client'
import {
  mapBook,
  type BookRow,
  type FormatRow,
  type ImageRow,
  type TagRow,
} from './mappers'
import type { Book, BookFormat } from '@/lib/types'

interface QueryOptions {
  categorySlug?: string
  categoryId?: string
  authorId?: string
  isBestseller?: boolean
  isNew?: boolean
  hasDiscount?: boolean
  excludeBookId?: string
  recommended?: boolean
  formatType?: BookFormat['type']
  tag?: string
  order?: { column: string; ascending?: boolean; nullsFirst?: boolean }
  limit?: number
}

async function queryBooks(options: QueryOptions): Promise<Book[]> {
  const supabase = createDataClient()

  let query = supabase
    .from('books')
    .select('*, author:author_id(id, name, slug, bio, photo_url), category:category_id(id, name, slug, description, icon)')

  if (options.categorySlug) {
    const { data: category, error: categoryError } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', options.categorySlug)
      .maybeSingle()

    if (categoryError) throw categoryError
    if (!category) return []

    query = query.eq('category_id', category.id)
  }
  if (options.categoryId) {
    query = query.eq('category_id', options.categoryId)
  }
  if (options.authorId) {
    query = query.eq('author_id', options.authorId)
  }
  if (options.isBestseller) {
    query = query.eq('is_bestseller', true)
  }
  if (options.isNew) {
    query = query.eq('is_new', true)
  }
  if (options.hasDiscount) {
    query = query.not('discount_price', 'is', null)
  }
  if (options.excludeBookId) {
    query = query.neq('id', options.excludeBookId)
  }
  if (options.formatType) {
    const { data: formatBookIds, error: formatError } = await supabase
      .from('book_formats')
      .select('book_id')
      .eq('type', options.formatType)

    if (formatError) throw formatError
    const ids = (formatBookIds ?? []).map((row) => row.book_id)
    if (ids.length === 0) return []
    query = query.in('id', ids)
  }
  if (options.tag) {
    const { data: tagBookIds, error: tagError } = await supabase
      .from('book_tags')
      .select('book_id')
      .ilike('tag', `%${options.tag}%`)

    if (tagError) throw tagError
    const ids = (tagBookIds ?? []).map((row) => row.book_id)
    if (ids.length === 0) return []
    query = query.in('id', ids)
  }

  if (options.order) {
    query = query.order(options.order.column, {
      ascending: options.order.ascending ?? true,
      nullsFirst: options.order.nullsFirst ?? false,
    })
  }

  if (options.limit) {
    query = query.limit(options.limit)
  }

  const { data, error } = await query
  if (error) throw error
  if (!data || data.length === 0) return []

  return hydrateBooks(data as unknown as BookRow[])
}

export async function hydrateBooks(rows: BookRow[]): Promise<Book[]> {
  const ids = rows.map((row) => row.id)
  const supabase = createDataClient()

  const [formatsRes, imagesRes, tagsRes] = await Promise.all([
    supabase.from('book_formats').select('book_id, type, price, stock').in('book_id', ids),
    supabase.from('book_images').select('book_id, url, position').in('book_id', ids).order('position'),
    supabase.from('book_tags').select('book_id, tag').in('book_id', ids),
  ])

  if (formatsRes.error) throw formatsRes.error
  if (imagesRes.error) throw imagesRes.error
  if (tagsRes.error) throw tagsRes.error

  const formats = (formatsRes.data ?? []) as FormatRow[]
  const images = (imagesRes.data ?? []) as ImageRow[]
  const tags = (tagsRes.data ?? []) as TagRow[]

  return rows.map((row) => mapBook(row, formats, images, tags))
}

export const getBookBySlug = cache(async (slug: string): Promise<Book | null> => {
  const supabase = createDataClient()

  const { data, error } = await supabase
    .from('books')
    .select('*, author:author_id(id, name, slug, bio, photo_url), category:category_id(id, name, slug, description, icon)')
    .eq('slug', slug)
    .maybeSingle()

  if (error) throw error
  if (!data) return null

  const books = await hydrateBooks([data as unknown as BookRow])
  return books[0] ?? null
})

export const getBooksByIds = cache(async (ids: string[]): Promise<Book[]> => {
  if (ids.length === 0) return []

  const supabase = createDataClient()
  const { data, error } = await supabase
    .from('books')
    .select('*, author:author_id(id, name, slug, bio, photo_url), category:category_id(id, name, slug, description, icon)')
    .in('id', ids)

  if (error) throw error
  if (!data || data.length === 0) return []

  return hydrateBooks(data as unknown as BookRow[])
})

export const getBooksByAuthor = cache(
  async (authorSlug: string): Promise<Book[]> => {
    const supabase = createDataClient()

    const { data: author, error: authorError } = await supabase
      .from('authors')
      .select('id')
      .eq('slug', authorSlug)
      .maybeSingle()

    if (authorError) throw authorError
    if (!author) return []

    return queryBooks({
      authorId: author.id,
      order: { column: 'title' },
    })
  }
)

export const getBestsellers = cache(async (limit = 8): Promise<Book[]> => {
  return queryBooks({
    isBestseller: true,
    order: { column: 'rating', ascending: false },
    limit,
  })
})

export const getNewReleases = cache(async (limit = 8): Promise<Book[]> => {
  return queryBooks({
    isNew: true,
    order: { column: 'publish_date', ascending: false },
    limit,
  })
})

export const getRelatedBooks = cache(
  async (bookId: string, categoryId: string, limit = 8): Promise<Book[]> => {
    return queryBooks({
      categoryId,
      excludeBookId: bookId,
      recommended: true,
      order: { column: 'rating', ascending: false },
      limit,
    })
  }
)

export const searchBooks = cache(async (rawQuery: string, limit = 24): Promise<Book[]> => {
  const term = rawQuery.trim()
  if (!term) return []

  const supabase = createDataClient()
  const pattern = `%${term}%`

  const [authorMatch, tagMatch] = await Promise.all([
    supabase.from('authors').select('id').ilike('name', pattern).limit(50),
    supabase.from('book_tags').select('book_id').ilike('tag', pattern).limit(100),
  ])

  if (authorMatch.error) throw authorMatch.error
  if (tagMatch.error) throw tagMatch.error

  const authorIds = (authorMatch.data ?? []).map((row) => row.id)
  const tagBookIds = (tagMatch.data ?? []).map((row) => row.book_id)

  const orParts = [
    `title.ilike.${pattern.replaceAll(' ', '%')}`,
    `isbn.ilike.${pattern}`,
    `publisher.ilike.${pattern}`,
  ]
  if (authorIds.length > 0) {
    orParts.push(`author_id.in.(${authorIds.join(',')})`)
  }
  if (tagBookIds.length > 0) {
    orParts.push(`id.in.(${tagBookIds.join(',')})`)
  }

  const { data, error } = await supabase
    .from('books')
    .select('*, author:author_id(id, name, slug, bio, photo_url), category:category_id(id, name, slug, description, icon)')
    .or(orParts.join(','))
    .order('rating', { ascending: false })
    .limit(limit)

  if (error) throw error
  if (!data || data.length === 0) return []

  return hydrateBooks(data as unknown as BookRow[])
})

const COLLECTIONS: Record<string, { title: string; description: string }> = {
  bestsellers: { title: 'Bestsellers', description: 'Los libros más leídos del momento' },
  novedades: { title: 'Novedades', description: 'Los lanzamientos más recientes' },
  ofertas: { title: 'Ofertas', description: 'Grandes libros a precios especiales' },
  recomendados: { title: 'Recomendados', description: 'Selecciones curadas por nuestro equipo' },
  otono: { title: 'Lo mejor del otoño', description: 'Las novedades editoriales de la temporada' },
  'voces-contemporaneas': {
    title: 'Las voces que definen nuestra época',
    description: 'Ensayos, novelas y memorias que capturan el espíritu de nuestro tiempo',
  },
  revistas: { title: 'Revistas', description: 'Publicaciones periódicas y revistas culturales' },
  audiolibros: { title: 'Audiolibros', description: 'Grandes historias para escuchar donde quieras' },
}

export async function getCatalogBySlug(slug: string): Promise<{
  title: string
  description: string
  books: Book[]
} | null> {
  const supabase = createDataClient()

  const { data: category, error } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .maybeSingle()

  if (error) throw error

  if (category) {
    const books = await queryBooks({ categorySlug: slug, order: { column: 'title' } })
    return {
      title: category.name,
      description: category.description ?? '',
      books,
    }
  }

  const collection = COLLECTIONS[slug]
  if (!collection) return null

  const collectionQueries: Record<string, QueryOptions> = {
    bestsellers: { isBestseller: true, order: { column: 'rating', ascending: false } },
    novedades: { isNew: true, order: { column: 'publish_date', ascending: false } },
    ofertas: { hasDiscount: true, order: { column: 'discount_percentage', ascending: false } },
    recomendados: { recommended: true, order: { column: 'rating', ascending: false } },
    otono: { isNew: true, order: { column: 'publish_date', ascending: false } },
    'voces-contemporaneas': { order: { column: 'rating', ascending: false } },
    revistas: { tag: 'revista', order: { column: 'title' } },
    audiolibros: { formatType: 'audiobook', order: { column: 'rating', ascending: false } },
  }

  const books = await queryBooks(collectionQueries[slug] ?? { order: { column: 'rating', ascending: false } })
  return { title: collection.title, description: collection.description, books }
}

export async function getBookParams(): Promise<{ categoria: string; slug: string }[]> {
  const supabase = createDataClient()

  const { data, error } = await supabase
    .from('books')
    .select('slug, category:category_id(slug)')

  if (error) throw error

  return (data ?? [])
    .map((row) => {
      const category = row.category as { slug: string } | { slug: string }[] | null | undefined
      const categoria = Array.isArray(category) ? category[0]?.slug : category?.slug
      return { categoria: categoria ?? '', slug: row.slug }
    })
    .filter((params) => params.categoria.length > 0)
}

export async function getCatalogSlugs(): Promise<string[]> {
  const supabase = createDataClient()

  const { data, error } = await supabase.from('categories').select('slug')

  if (error) throw error

  return [
    ...(data ?? []).map((row) => row.slug),
    ...Object.keys(COLLECTIONS),
  ]
}