import type { Book, Author, Category } from '@/lib/types'
import type { AuthorRow, CategoriaRow, LibroRow } from './types'

export function mapAuthor(row: AuthorRow): Author {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    bio: row.bio,
    photo: row.photo ?? undefined,
    bookCount: 0,
  }
}

export function mapCategory(row: CategoriaRow): Category {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    icon: row.icon,
    bookCount: 0,
  }
}

export function mapBook(row: LibroRow): Book {
  const formats = (row.libro_formatos ?? []).map((f) => ({
    type: f.format_type,
    price: Number(f.price),
    stock: f.stock,
  }))

  const baseFormatPrice =
    formats.length > 0 ? Math.min(...formats.map((f) => f.price)) : Number(row.price)

  const effectiveDiscount = row.discount_price != null ? Number(row.discount_price) : undefined

  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    author: mapAuthor(row.autores),
    category: mapCategory(row.categorias),
    description: row.description,
    price: effectiveDiscount ?? baseFormatPrice,
    discountPrice: row.discount_price != null ? Number(row.discount_price) : undefined,
    discountPercentage: row.discount_percentage ?? undefined,
    formats,
    coverImage: row.cover_image,
    images: (row.libro_imagenes ?? []).map((img) => img.url),
    isbn: row.isbn ?? '',
    publisher: row.publisher ?? '',
    pages: row.pages ?? 0,
    language: row.language,
    publishDate: row.publish_date ?? '',
    dimensions: row.dimensions ?? undefined,
    rating: Number(row.rating),
    reviewCount: row.review_count,
    stock: row.stock,
    isBestseller: row.is_bestseller,
    isNew: row.is_new,
    tags: row.tags,
  }
}
