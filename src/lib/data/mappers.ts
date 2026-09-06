import type { Author, Book, Category, BookFormat, Review } from '@/lib/types'
import { usdToArs } from '@/lib/format'

export interface CategoryRow {
  id: string
  name: string
  slug: string
  description: string | null
  icon: string | null
  book_count?: number | { count: number }
}

export interface AuthorRow {
  id: string
  name: string
  slug: string
  bio: string | null
  photo_url: string | null
  book_count?: number | { count: number }
}

function countValue(
  value: number | { count: number } | { count: number }[] | undefined
): number {
  if (typeof value === 'number') return value
  if (Array.isArray(value)) return value[0]?.count ?? 0
  return value?.count ?? 0
}

export interface BookRow {
  id: string
  title: string
  slug: string
  description: string
  isbn: string
  publisher: string | null
  pages: number | null
  language: string
  publish_date: string | null
  dimensions: string | null
  price: number
  discount_price: number | null
  discount_percentage: number | null
  rating: number
  review_count: number
  stock: number
  is_bestseller: boolean
  is_new: boolean
  cover_image_url: string
  author_id: string
  category_id: string
  author: AuthorRow
  category: CategoryRow
}

export interface FormatRow {
  bookId: string
  type: BookFormat['type']
  price: number
  stock: number
}

export interface ImageRow {
  bookId: string
  url: string
  position: number
}

export interface TagRow {
  bookId: string
  tag: string
}

export interface ReviewRow {
  id: string
  book_id: string
  user_id: string | null
  user_name: string
  rating: number
  title: string | null
  content: string
  helpful_count: number
  created_at: string
}

export function mapCategory(row: CategoryRow): Category {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description ?? '',
    icon: row.icon ?? '',
    bookCount: countValue(row.book_count),
  }
}

export function mapAuthor(row: AuthorRow): Author {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    bio: row.bio ?? '',
    photo: row.photo_url ?? undefined,
    bookCount: countValue(row.book_count),
  }
}

export function mapBook(
  row: BookRow,
  formats: FormatRow[],
  images: ImageRow[],
  tags: TagRow[]
): Book {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    author: {
      id: row.author.id,
      name: row.author.name,
      slug: row.author.slug,
      bio: row.author.bio ?? '',
      bookCount: countValue(row.author.book_count),
    },
    category: mapCategory(row.category),
    description: row.description,
    price: usdToArs(Number(row.price)),
    discountPrice:
      row.discount_price != null ? usdToArs(Number(row.discount_price)) : undefined,
    discountPercentage: row.discount_percentage ?? undefined,
    formats: formats
      .filter((f) => f.bookId === row.id)
      .map((f) => ({ type: f.type, price: usdToArs(Number(f.price)), stock: f.stock })),
    coverImage: row.cover_image_url,
    images: [
      ...new Set(
        images
          .filter((i) => i.bookId === row.id)
          .sort((a, b) => a.position - b.position)
          .map((i) => i.url)
      ),
    ],
    isbn: row.isbn,
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
    tags: tags
      .filter((t) => t.bookId === row.id)
      .map((t) => t.tag),
  }
}

export function mapReview(row: ReviewRow): Review {
  return {
    id: row.id,
    bookId: row.book_id,
    userId: row.user_id ?? '',
    userName: row.user_name,
    rating: row.rating,
    title: row.title ?? '',
    content: row.content,
    helpfulCount: row.helpful_count,
    createdAt: row.created_at,
  }
}