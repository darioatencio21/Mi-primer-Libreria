import type { Author, Book, BookFormat, Category, Review } from '@/lib/types'
import { usdToArs } from '@/lib/format'

/**
 * Formato gráfico que devuelve el SaaS EXTERNO (esquema distinto al de
 * Supabase). Acá se define UNA VEZ ese contrato y los mappers que lo
 * convierten a los tipos de dominio de la tienda (`Book`, `Author`, ...).
 *
 * Si tu SaaS nombra campos distinto, ajustá estas interfaces y los mappers,
 * sin tocar el resto de la app.
 */

export interface SaaSBook {
  id: string
  title: string
  slug: string
  summary: string
  isbn: string
  publisher: string | null
  pages: number | null
  language: string
  releaseDate: string | null
  dimensions: string | null
  /** Precios en USD en el SaaS; la tienda los convierte a ARS. */
  basePriceUSD: number
  promoPriceUSD?: number | null
  rating: number
  ratingCount: number
  stock: number
  isBestseller: boolean
  isNew: boolean
  coverImage: string
  author: SaaSAuthor
  category: SaaSBookCategory
  formats: SaaSBookFormat[]
  galleryImages: string[]
  tags: string[]
}

export interface SaaSBookFormat {
  type: BookFormat['type']
  priceUSD: number
  stock: number
}

export interface SaaSBookCategory {
  id: string
  name: string
  slug: string
  description: string
  icon: string
}

export interface SaaSAuthor {
  id: string
  name: string
  slug: string
  bio: string
  photoUrl?: string
  bookCount: number
}

export interface SAASCatalog {
  title: string
  description: string
  books: SaaSBook[]
}

export interface SaaSReview {
  id: string
  bookId: string
  userName: string
  rating: number
  title: string
  content: string
  createdAt: string
}

export interface SaaSBookParams {
  categoria: string
  slug: string
}

// ---------- MAPPERS (SaaS -> dominio) ----------

export function mapSaaSBook(b: SaaSBook): Book {
  return {
    id: b.id,
    title: b.title,
    slug: b.slug,
    author: mapSaaSBookAuthor(b.author),
    category: mapSaaSBookCategory(b.category),
    description: b.summary,
    price: usdToArs(Number(b.basePriceUSD)),
    discountPrice: b.promoPriceUSD != null ? usdToArs(Number(b.promoPriceUSD)) : undefined,
    discountPercentage:
      b.basePriceUSD && b.promoPriceUSD
        ? Math.round((1 - Number(b.promoPriceUSD) / Number(b.basePriceUSD)) * 100)
        : undefined,
    formats: (b.formats ?? []).map((f) => ({
      type: f.type,
      price: usdToArs(Number(f.priceUSD)),
      stock: f.stock,
    })),
    coverImage: b.coverImage,
    images: b.galleryImages ?? [],
    isbn: b.isbn,
    publisher: b.publisher ?? '',
    pages: b.pages ?? 0,
    language: b.language,
    publishDate: b.releaseDate ?? '',
    dimensions: b.dimensions ?? undefined,
    rating: Number(b.rating),
    reviewCount: b.ratingCount,
    stock: b.stock,
    isBestseller: b.isBestseller,
    isNew: b.isNew,
    tags: b.tags ?? [],
  }
}

export function mapSaaSBookAuthor(a: SaaSAuthor): Author {
  return {
    id: a.id,
    name: a.name,
    slug: a.slug,
    bio: a.bio ?? '',
    photo: a.photoUrl ?? undefined,
    bookCount: a.bookCount,
  }
}

export function mapSaaSBookCategory(c: SaaSBookCategory): Category {
  return {
    id: c.id,
    name: c.name,
    slug: c.slug,
    description: c.description ?? '',
    icon: c.icon ?? '',
    bookCount: 0,
  }
}

export function mapSaaSReview(r: SaaSReview): Review {
  return {
    id: r.id,
    bookId: r.bookId,
    userId: '',
    userName: r.userName,
    rating: r.rating,
    title: r.title ?? '',
    content: r.content,
    helpfulCount: 0,
    createdAt: r.createdAt,
  }
}

export function mapSAASCatalog(c: SAASCatalog): { title: string; description: string; books: Book[] } {
  return {
    title: c.title,
    description: c.description,
    books: (c.books ?? []).map(mapSaaSBook),
  }
}
