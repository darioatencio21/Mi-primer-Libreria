import { cache } from 'react'
import { and, asc, desc, eq, ilike, inArray, isNotNull, ne, or } from 'drizzle-orm'
import { db } from '@/lib/db/client'
import {
  authors as authorsTable,
  books as booksTable,
  bookFormats,
  bookImages,
  bookTags,
  categories as categoriesTable,
} from '@/lib/db/schema'
import {
  mapBook,
  type AuthorRow,
  type BookRow,
  type CategoryRow,
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
  formatType?: BookFormat['type']
  tag?: string
  order?: { column: string; ascending?: boolean }
  limit?: number
}

function ordering(column: string) {
  switch (column) {
    case 'rating':
      return booksTable.rating
    case 'title':
      return booksTable.title
    case 'publish_date':
      return booksTable.publishDate
    case 'discount_percentage':
      return booksTable.discountPercentage
    default:
      return booksTable.createdAt
  }
}

function toBookRow(
  row: typeof booksTable.$inferSelect,
  author: ReturnType<typeof toAuthorRow> | undefined,
  category: ReturnType<typeof toCategoryRow> | undefined
): BookRow {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    description: row.description,
    isbn: row.isbn,
    publisher: row.publisher,
    pages: row.pages,
    language: row.language,
    publish_date: row.publishDate,
    dimensions: row.dimensions,
    price: row.price,
    discount_price: row.discountPrice,
    discount_percentage: row.discountPercentage,
    rating: row.rating,
    review_count: row.reviewCount,
    stock: row.stock,
    is_bestseller: row.isBestseller,
    is_new: row.isNew,
    cover_image_url: row.coverImageUrl,
    author_id: row.authorId,
    category_id: row.categoryId,
    author: author ?? { id: '', name: '', slug: '', bio: '', photo_url: null },
    category: category ?? { id: '', name: '', slug: '', description: '', icon: null },
  }
}

function toAuthorRow(row: typeof authorsTable.$inferSelect | undefined): AuthorRow | undefined {
  if (!row) return undefined
  return { id: row.id, name: row.name, slug: row.slug, bio: row.bio, photo_url: row.photoUrl }
}

function toCategoryRow(row: typeof categoriesTable.$inferSelect | undefined): CategoryRow | undefined {
  if (!row) return undefined
  return { id: row.id, name: row.name, slug: row.slug, description: row.description, icon: row.icon }
}

interface HydratedBook {
  row: BookRow
  formats: FormatRow[]
  images: ImageRow[]
  tags: TagRow[]
}

async function hydrateBooks2(rows: (typeof booksTable.$inferSelect)[]): Promise<HydratedBook[]> {
  if (rows.length === 0) return []

  const ids = rows.map((r) => r.id)

  const [formatRows, imageRows, tagRows, authorRows, categoryRows] = await Promise.all([
    db.select().from(bookFormats).where(inArray(bookFormats.bookId, ids)),
    db.select().from(bookImages).where(inArray(bookImages.bookId, ids)).orderBy(asc(bookImages.position)),
    db.select().from(bookTags).where(inArray(bookTags.bookId, ids)),
    db.select().from(authorsTable).where(inArray(authorsTable.id, [...new Set(rows.map((r) => r.authorId))])),
    db.select().from(categoriesTable).where(inArray(categoriesTable.id, [...new Set(rows.map((r) => r.categoryId))])),
  ])

  const authorMap = new Map(authorRows.map((a) => [a.id, toAuthorRow(a)]))
  const categoryMap = new Map(categoryRows.map((c) => [c.id, toCategoryRow(c)]))

  const formatsByBook = groupBy(formatRows, (f) => f.bookId)
  const imagesByBook = groupBy(imageRows, (i) => i.bookId)
  const tagsByBook = groupBy(tagRows, (t) => t.bookId)

  return rows.map((row) => ({
    row: toBookRow(row, authorMap.get(row.authorId), categoryMap.get(row.categoryId)),
    formats: (formatsByBook.get(row.id) ?? []) as unknown as FormatRow[],
    images: (imagesByBook.get(row.id) ?? []) as unknown as ImageRow[],
    tags: (tagsByBook.get(row.id) ?? []) as unknown as TagRow[],
  }))
}

function groupBy<T>(items: T[], key: (item: T) => string): Map<string, T[]> {
  const map = new Map<string, T[]>()
  for (const item of items) {
    const k = key(item)
    const list = map.get(k) ?? []
    list.push(item)
    map.set(k, list)
  }
  return map
}

function toBook(hydrated: HydratedBook): Book {
  return mapBook(hydrated.row, hydrated.formats, hydrated.images, hydrated.tags)
}

async function queryBooks(options: QueryOptions): Promise<Book[]> {
  const conditions = []

  if (options.categorySlug) {
    const category = await db.query.categories.findFirst({ where: eq(categoriesTable.slug, options.categorySlug) })
    if (!category) return []
    conditions.push(eq(booksTable.categoryId, category.id))
  }
  if (options.categoryId) conditions.push(eq(booksTable.categoryId, options.categoryId))
  if (options.authorId) conditions.push(eq(booksTable.authorId, options.authorId))
  if (options.isBestseller) conditions.push(eq(booksTable.isBestseller, true))
  if (options.isNew) conditions.push(eq(booksTable.isNew, true))
  if (options.hasDiscount) conditions.push(isNotNull(booksTable.discountPrice))
  if (options.excludeBookId) conditions.push(ne(booksTable.id, options.excludeBookId))

  if (options.formatType) {
    const formatRows = await db.select({ bookId: bookFormats.bookId }).from(bookFormats).where(eq(bookFormats.type, options.formatType))
    const ids = formatRows.map((r) => r.bookId)
    if (ids.length === 0) return []
    conditions.push(inArray(booksTable.id, ids))
  }

  if (options.tag) {
    const tagRows = await db.select({ bookId: bookTags.bookId }).from(bookTags).where(ilike(bookTags.tag, `%${options.tag}%`))
    const ids = tagRows.map((r) => r.bookId)
    if (ids.length === 0) return []
    conditions.push(inArray(booksTable.id, ids))
  }

  const where = conditions.length > 0 ? and(...conditions) : undefined
  const orderByColumn = options.order
    ? options.order.ascending === false
      ? desc(ordering(options.order.column))
      : asc(ordering(options.order.column))
    : undefined

  const rows = await db
    .select()
    .from(booksTable)
    .where(where)
    .orderBy(orderByColumn ?? asc(booksTable.title))
    .limit(options.limit ?? 100)

  const hydrated = await hydrateBooks2(rows)
  return hydrated.map(toBook)
}

export const getBookBySlug = cache(async (slug: string): Promise<Book | null> => {
  const row = await db.query.books.findFirst({ where: eq(booksTable.slug, slug) })
  if (!row) return null
  const [hydrated] = await hydrateBooks2([row])
  return hydrated ? toBook(hydrated) : null
})

export const getBooksByIds = cache(async (ids: string[]): Promise<Book[]> => {
  if (ids.length === 0) return []
  const rows = await db.select().from(booksTable).where(inArray(booksTable.id, ids))
  const hydrated = await hydrateBooks2(rows)
  return hydrated.map(toBook)
})

export const getBooksByAuthor = cache(async (authorSlug: string): Promise<Book[]> => {
  const author = await db.query.authors.findFirst({ where: eq(authorsTable.slug, authorSlug) })
  if (!author) return []
  return queryBooks({ authorId: author.id, order: { column: 'title' } })
})

export const getBestsellers = cache(async (limit = 8): Promise<Book[]> => {
  try {
    return await queryBooks({ isBestseller: true, order: { column: 'rating', ascending: false }, limit })
  } catch (err) {
    console.warn('No se pudieron cargar bestsellers:', err)
    return []
  }
})

export const getNewReleases = cache(async (limit = 8): Promise<Book[]> => {
  try {
    return await queryBooks({ isNew: true, order: { column: 'publish_date', ascending: false }, limit })
  } catch (err) {
    console.warn('No se pudieron cargar novedades:', err)
    return []
  }
})

export const getRelatedBooks = cache(
  async (bookId: string, categoryId: string, limit = 8): Promise<Book[]> => {
    return queryBooks({
      categoryId,
      excludeBookId: bookId,
      order: { column: 'rating', ascending: false },
      limit,
    })
  }
)

export const searchBooks = cache(async (rawQuery: string, limit = 24): Promise<Book[]> => {
  const term = rawQuery.trim()
  if (!term) return []

  const pattern = `%${term}%`

  const authorRows = await db.select().from(authorsTable).where(ilike(authorsTable.name, pattern)).limit(50)
  const tagRows = await db.select().from(bookTags).where(ilike(bookTags.tag, pattern)).limit(100)

  const conditions = [
    ilike(booksTable.title, `%${term.replaceAll(' ', '%')}%`),
    ilike(booksTable.isbn, pattern),
    ilike(booksTable.publisher, pattern),
  ]
  if (authorRows.length > 0) conditions.push(inArray(booksTable.authorId, authorRows.map((r) => r.id)))
  if (tagRows.length > 0) conditions.push(inArray(booksTable.id, tagRows.map((r) => r.bookId)))

  const rows = await db
    .select()
    .from(booksTable)
    .where(or(...conditions))
    .orderBy(desc(booksTable.rating))
    .limit(limit)

  const hydrated = await hydrateBooks2(rows)
  return hydrated.map(toBook)
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
  const category = await db.query.categories.findFirst({ where: eq(categoriesTable.slug, slug) })

  if (category) {
    const books = await queryBooks({ categorySlug: slug, order: { column: 'title' } })
    return { title: category.name, description: category.description ?? '', books }
  }

  const collection = COLLECTIONS[slug]
  if (!collection) return null

  const collectionQueries: Record<string, QueryOptions> = {
    bestsellers: { isBestseller: true, order: { column: 'rating', ascending: false } },
    novedades: { isNew: true, order: { column: 'publish_date', ascending: false } },
    ofertas: { hasDiscount: true, order: { column: 'discount_percentage', ascending: false } },
    recomendados: { order: { column: 'rating', ascending: false } },
    otono: { isNew: true, order: { column: 'publish_date', ascending: false } },
    'voces-contemporaneas': { order: { column: 'rating', ascending: false } },
    revistas: { tag: 'revista', order: { column: 'title' } },
    audiolibros: { formatType: 'audiobook', order: { column: 'rating', ascending: false } },
  }

  const books = await queryBooks(collectionQueries[slug] ?? { order: { column: 'rating', ascending: false } })
  return { title: collection.title, description: collection.description, books }
}

export async function getBookParams(): Promise<{ categoria: string; slug: string }[]> {
  try {
    const bookRows = await db.select().from(booksTable)
    const categoryRows = await db.select().from(categoriesTable)
    const categoryMap = new Map(categoryRows.map((c) => [c.id, c]))

    return bookRows
      .map((row) => ({ categoria: categoryMap.get(row.categoryId)?.slug ?? '', slug: row.slug }))
      .filter((params) => params.categoria.length > 0)
  } catch (err) {
    // Sin DB en el build (Docker) se generan rutas dinámicas en vez de fallar.
    console.warn('No se pudieron generar parámetros de libros:', err)
    return []
  }
}

export async function getCatalogSlugs(): Promise<string[]> {
  try {
    const rows = await db.select().from(categoriesTable)
    return [...rows.map((row) => row.slug), ...Object.keys(COLLECTIONS)]
  } catch (err) {
    console.warn('No se pudieron generar slugs de catálogo:', err)
    return []
  }
}

export async function hydrateBooks(rows: BookRow[]): Promise<Book[]> {
  const ids = rows.map((row) => row.id)
  const [formatRows, imageRows, tagRows] = await Promise.all([
    db.select().from(bookFormats).where(inArray(bookFormats.bookId, ids)),
    db.select().from(bookImages).where(inArray(bookImages.bookId, ids)).orderBy(asc(bookImages.position)),
    db.select().from(bookTags).where(inArray(bookTags.bookId, ids)),
  ])
  return rows.map((row) =>
    mapBook(row, formatRows as unknown as FormatRow[], imageRows as unknown as ImageRow[], tagRows as unknown as TagRow[])
  )
}