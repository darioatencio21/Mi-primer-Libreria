import type { BookFormat } from '@/lib/types'

export type FormatType = BookFormat['type']

export interface AuthorRow {
  id: string
  name: string
  slug: string
  bio: string
  photo: string | null
}

export interface CategoriaRow {
  id: string
  name: string
  slug: string
  description: string
  icon: string
  sort_order: number
}

export interface LibroFormatoRow {
  id: string
  libro_id: string
  format_type: FormatType
  price: number
  stock: number
}

export interface LibroImagenRow {
  id: string
  libro_id: string
  url: string
  alt: string | null
  sort_order: number
}

/** Fila combinada de la tabla `libros` con sus relaciones (autores, categorias). */
export interface LibroRow {
  id: string
  title: string
  slug: string
  autor_id: string
  categoria_id: string
  description: string
  price: number
  discount_price: number | null
  discount_percentage: number | null
  cover_image: string
  isbn: string | null
  publisher: string | null
  pages: number | null
  language: string
  publish_date: string | null
  dimensions: string | null
  rating: number
  review_count: number
  stock: number
  is_bestseller: boolean
  is_new: boolean
  tags: string[]
  autores: AuthorRow
  categorias: CategoriaRow
  /** Opcional: se incluye solo si la query pide formatos. */
  libro_formatos?: LibroFormatoRow[]
  /** Opcional: se incluye solo si la query pide imágenes. */
  libro_imagenes?: LibroImagenRow[]
}

export interface ResenaRow {
  id: string
  libro_id: string
  user_id: string
  rating: number
  title: string
  content: string
  helpful_count: number
  created_at: string
}
