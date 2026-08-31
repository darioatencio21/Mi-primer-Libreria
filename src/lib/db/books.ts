import { createClient } from '@/lib/supabase/server'
import type { Book, Author, Category, SearchFilters } from '@/lib/types'
import { mapAuthor, mapBook, mapCategory } from './mappers'
import type { AuthorRow, CategoriaRow, LibroRow } from './types'

/** Selección base de un libro con autor, categoría y formatos embebidos. */
const LIBRO_SELECT = `
  *,
  autores (*),
  categorias (*),
  libro_formatos (*)
`

/** Selección de un libro con todo (formatos + imágenes). */
const LIBRO_SELECT_FULL = `
  *,
  autores (*),
  categorias (*),
  libro_formatos (*),
  libro_imagenes (*)
`

export async function getBestsellers(limit = 10): Promise<Book[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('libros')
    .select(LIBRO_SELECT)
    .eq('is_bestseller', true)
    .order('rating', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('getBestsellers error:', error.message)
    return []
  }
  return (data ?? []).map((row) => mapBook(row as unknown as LibroRow))
}

export async function getRecomendados(limit = 8): Promise<Book[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('libros')
    .select(LIBRO_SELECT)
    .order('rating', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('getRecomendados error:', error.message)
    return []
  }
  return (data ?? []).map((row) => mapBook(row as unknown as LibroRow))
}

export async function getLibrosPorCategoria(
  categoriaSlug: string,
  opts: { limit?: number } = {}
): Promise<Book[]> {
  const supabase = await createClient()
  let query = supabase
    .from('libros')
    .select(LIBRO_SELECT)

  if (categoriaSlug) {
    query = query.eq('categorias.slug', categoriaSlug)
  }

  if (opts.limit) {
    query = query.limit(opts.limit)
  }

  const { data, error } = await query

  if (error) {
    console.error('getLibrosPorCategoria error:', error.message)
    return []
  }
  return (data ?? []).map((row) => mapBook(row as unknown as LibroRow))
}

export async function getLibroPorSlug(slug: string): Promise<Book | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('libros')
    .select(LIBRO_SELECT_FULL)
    .eq('slug', slug)
    .single()

  if (error) {
    console.error('getLibroPorSlug error:', error.message)
    return null
  }
  return mapBook(data as unknown as LibroRow)
}

export async function getCategorias(): Promise<Category[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('categorias')
    .select(`*`)
    .order('sort_order', { ascending: true })

  if (error) {
    console.error('getCategorias error:', error.message)
    return []
  }
  return (data ?? []).map((row) => mapCategory(row as CategoriaRow))
}

export async function getAutores(limit = 10): Promise<Author[]> {
  const supabase = await createClient()
  // book count agregado server-side a partir de libros activos
  const { data, error } = await supabase.from('autores').select('*').limit(limit)

  if (error) {
    console.error('getAutores error:', error.message)
    return []
  }
  const autores = (data ?? []).map((row) => mapAuthor(row as AuthorRow))

  if (autores.length === 0) return autores

  const ids = autores.map((a) => a.id)
  const { data: counts } = await supabase
    .from('libros')
    .select('autor_id')
    .in('autor_id', ids)

  const countByAuthor = new Map<string, number>()
  ;(counts ?? []).forEach((r) => {
    const id = r.autor_id as string
    countByAuthor.set(id, (countByAuthor.get(id) ?? 0) + 1)
  })

  return autores
    .map((a) => ({ ...a, bookCount: countByAuthor.get(a.id) ?? 0 }))
    .sort((x, y) => y.bookCount - x.bookCount)
}

/** Ejecuta la búsqueda con filtros sobre la tabla libros. */
export async function buscarLibros(
  filters: SearchFilters,
  opts: { limit?: number } = {}
): Promise<Book[]> {
  const supabase = await createClient()
  let query = supabase.from('libros').select(LIBRO_SELECT)

  if (filters.query) {
    query = query.ilike('title', `%${filters.query}%`)
  }
  if (filters.category) {
    query = query.eq('categorias.slug', filters.category)
  }
  if (filters.author) {
    query = query.eq('autores.slug', filters.author)
  }
  if (filters.publisher) {
    query = query.ilike('publisher', `%${filters.publisher}%`)
  }
  if (filters.language && filters.language.length > 0) {
    query = query.in('language', filters.language)
  }
  if (filters.inStockOnly) {
    query = query.gt('stock', 0)
  }
  if (filters.priceMin != null) {
    query = query.gte('price', filters.priceMin)
  }
  if (filters.priceMax != null) {
    query = query.lte('price', filters.priceMax)
  }

  switch (filters.sortBy) {
    case 'price_asc':
      query = query.order('price', { ascending: true })
      break
    case 'price_desc':
      query = query.order('price', { ascending: false })
      break
    case 'rating':
      query = query.order('rating', { ascending: false })
      break
    case 'newest':
      query = query.order('created_at', { ascending: false })
      break
    default:
      query = query.order('rating', { ascending: false })
  }

  if (opts.limit) {
    query = query.limit(opts.limit)
  }

  const { data, error } = await query

  if (error) {
    console.error('buscarLibros error:', error.message)
    return []
  }
  return (data ?? []).map((row) => mapBook(row as unknown as LibroRow))
}

export interface ResenaView {
  id: string
  bookId: string
  userName: string
  rating: number
  title: string
  content: string
  helpful: number
  date: string
}

/** Reseñas de un libro, ordenadas por fecha. Necesita JOIN con profiles para el nombre. */
export async function getResenasDeLibro(libroId: string): Promise<ResenaView[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('resenas')
    .select(`*, profiles (full_name)`)
    .eq('libro_id', libroId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('getResenasDeLibro error:', error.message)
    return []
  }

  return (data ?? []).map((r) => {
    const row = r as unknown as {
      id: string
      libro_id: string
      rating: number
      title: string
      content: string
      helpful_count: number
      created_at: string
      profiles: { full_name: string | null } | null
    }
    return {
      id: row.id,
      bookId: row.libro_id,
      userName: row.profiles?.full_name ?? 'Lector',
      rating: row.rating,
      title: row.title,
      content: row.content,
      helpful: row.helpful_count,
      date: row.created_at,
    }
  })
}

/** Libros relacionados: misma categoría, excluyendo el actual. */
export async function getLibrosRelacionados(bookId: string, categoriaSlug: string, limit = 8): Promise<Book[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('libros')
    .select(LIBRO_SELECT)
    .eq('categorias.slug', categoriaSlug)
    .neq('id', bookId)
    .order('rating', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('getLibrosRelacionados error:', error.message)
    return []
  }
  return (data ?? []).map((row) => mapBook(row as unknown as LibroRow))
}
