import type { Author, Book, BookFormat, Category, Review } from '@/lib/types'

/**
 * Formato que devuelve el SaaS EXTERNO (Camaleón) vía REST/JSON. Este es EL
 * ÚNICO lugar donde se define ese contrato y los mappers que lo convierten a
 * los tipos de dominio de la tienda (`Book`, `Author`, ...).
 *
 * Camaleón es un POS argentino: los precios ya vienen en PESOS (ARS) directo,
 * por lo que NO se convierte moneda acá. Si Camaleón nombra campos distinto
 * o anida la respuesta, ajustá estas interfaces y los mappers sin tocar el
 * resto de la app.
 */

export interface SaaSCatalogBook {
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
  /** Precios en ARS (pesos argentinos), tal como los maneja Camaleón. */
  basePriceARS: number
  promoPriceARS?: number | null
  rating: number
  ratingCount: number
  stock: number
  isBestseller: boolean
  isNew: boolean
  coverImage: string
  author: SaaSCatalogAuthor
  category: SaaSCatalogCategory
  formats: SaaSCatalogFormat[]
  galleryImages: string[]
  tags: string[]
}

export interface SaaSCatalogFormat {
  type: BookFormat['type']
  priceARS: number
  stock: number
}

export interface SaaSCatalogCategory {
  id: string
  name: string
  slug: string
  description: string
  icon: string
  bookCount?: number
}

export interface SaaSCatalogAuthor {
  id: string
  name: string
  slug: string
  bio: string
  photoUrl?: string
  bookCount?: number
}

export interface SaaSCatalog {
  title: string
  description: string
  books: SaaSCatalogBook[]
}

export interface SaaSCatalogReview {
  id: string
  bookId: string
  userName: string
  rating: number
  title: string
  content: string
  createdAt: string
}

export interface SaaSCatalogBookParams {
  categoria: string
  slug: string
}

// ---------- MAPPERS (SaaS -> dominio) ----------

export function mapSaaSCatalogBook(b: SaaSCatalogBook): Book {
  return {
    id: b.id,
    title: b.title,
    slug: b.slug,
    author: mapSaaSCatalogAuthor(b.author),
    category: mapSaaSCatalogCategory(b.category),
    description: b.summary,
    price: Number(b.basePriceARS),
    discountPrice: b.promoPriceARS != null ? Number(b.promoPriceARS) : undefined,
    discountPercentage:
      b.basePriceARS && b.promoPriceARS
        ? Math.round((1 - Number(b.promoPriceARS) / Number(b.basePriceARS)) * 100)
        : undefined,
    formats: (b.formats ?? []).map((f) => ({
      type: f.type,
      price: Number(f.priceARS),
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

export function mapSaaSCatalogAuthor(a: SaaSCatalogAuthor): Author {
  return {
    id: a.id,
    name: a.name,
    slug: a.slug,
    bio: a.bio ?? '',
    photo: a.photoUrl ?? undefined,
    bookCount: a.bookCount ?? 0,
  }
}

export function mapSaaSCatalogCategory(c: SaaSCatalogCategory): Category {
  return {
    id: c.id,
    name: c.name,
    slug: c.slug,
    description: c.description ?? '',
    icon: c.icon ?? '',
    bookCount: c.bookCount ?? 0,
  }
}

export function mapSaaSCatalogReview(r: SaaSCatalogReview): Review {
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

export function mapSaaSCatalog(c: SaaSCatalog): {
  title: string
  description: string
  books: Book[]
} {
  return {
    title: c.title,
    description: c.description,
    books: (c.books ?? []).map(mapSaaSCatalogBook),
  }
}