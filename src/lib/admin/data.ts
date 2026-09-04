import 'server-only'
import { asc, desc, eq, sql } from 'drizzle-orm'
import { db } from '@/lib/db/client'
import {
  authors as authorsTable,
  books as booksTable,
  bookFormats,
  bookImages,
  bookTags,
  categories as categoriesTable,
  orderItems,
  orders,
  users as usersTable,
} from '@/lib/db/schema'
import type { BookFormat } from '@/lib/types'

/**
 * Capa de datos del panel de administración.
 *
 * Lee el mismo esquema que el catálogo del frontend (tablas en inglés vía
 * Drizzle): `books`, `authors`, `categories`, `book_formats`,
 * `book_images`, `book_tags`, `orders` y `order_items`. Las páginas del admin
 * se mantienen en español: acá traduzco filas -> forma esperada por el panel.
 */

export interface AdminLibro {
  id: string
  title: string
  slug: string
  autor_id: string
  categoria_id: string
  autorName: string
  categoriaName: string
  price: number
  discount_price: number | null
  cover_image: string
  isbn: string
  stock: number
  rating: number
  review_count: number
  is_bestseller: boolean
  is_new: boolean
  active: boolean
  created_at: string
}

export interface AdminAutor {
  id: string
  name: string
  slug: string
  bio: string
  photo_url: string | null
  bookCount: number
}

export interface AdminCategoria {
  id: string
  name: string
  slug: string
  description: string | null
  icon: string | null
  sort_order: number
  bookCount: number
}

export interface AdminPedido {
  id: string
  numero: string
  cliente: string
  total: number
  status: string
  itemsCount: number
  created_at: string
  shipping_address: Record<string, unknown>
}

export interface AdminLibroFormato {
  id: string
  format_type: BookFormat['type']
  price: number
  stock: number
}

export interface AdminLibroImagen {
  url: string
}

export interface AdminLibroEditable {
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
  stock: number
  is_bestseller: boolean
  is_new: boolean
  tags: string[]
  libro_formatos: AdminLibroFormato[]
  libro_imagenes: AdminLibroImagen[]
}

export async function getStats() {
  const [contadorLibros, contadorAutores, contadorCategorias, libros, pedidosRecientes] =
    await Promise.all([
      db.select({ count: sql<number>`count(*)::int` }).from(booksTable),
      db.select({ count: sql<number>`count(*)::int` }).from(authorsTable),
      db.select({ count: sql<number>`count(*)::int` }).from(categoriesTable),
      db.select().from(booksTable),
      db
        .select({
          id: orders.id,
          total: orders.total,
          status: orders.status,
          createdAt: orders.createdAt,
          cliente: usersTable.fullName,
          email: usersTable.email,
        })
        .from(orders)
        .leftJoin(usersTable, eq(usersTable.id, orders.userId))
        .orderBy(desc(orders.createdAt))
        .limit(5),
    ])

  return {
    totalLibros: contadorLibros[0]?.count ?? 0,
    totalAutores: contadorAutores[0]?.count ?? 0,
    totalCategorias: contadorCategorias[0]?.count ?? 0,
    stockTotal: libros.reduce((acc, l) => acc + (l.stock || 0), 0),
    bestsellers: libros.filter((l) => l.isBestseller).length,
    nuevos: libros.filter((l) => l.isNew).length,
    pedidosRecientes: pedidosRecientes.map((pedido) => ({
      id: pedido.id,
      numero: pedido.id,
      cliente: pedido.cliente || pedido.email || 'Cliente',
      total: pedido.total,
      status: pedido.status,
      itemsCount: 0,
      shipping_address: {},
      created_at: pedido.createdAt,
    })),
  }
}

export async function listLibros(): Promise<AdminLibro[]> {
  const rows = await db
    .select({
      id: booksTable.id,
      title: booksTable.title,
      slug: booksTable.slug,
      authorId: booksTable.authorId,
      categoryId: booksTable.categoryId,
      price: booksTable.price,
      discountPrice: booksTable.discountPrice,
      coverImageUrl: booksTable.coverImageUrl,
      isbn: booksTable.isbn,
      stock: booksTable.stock,
      rating: booksTable.rating,
      reviewCount: booksTable.reviewCount,
      isBestseller: booksTable.isBestseller,
      isNew: booksTable.isNew,
      createdAt: booksTable.createdAt,
      autorName: authorsTable.name,
      categoriaName: categoriesTable.name,
    })
    .from(booksTable)
    .leftJoin(authorsTable, eq(authorsTable.id, booksTable.authorId))
    .leftJoin(categoriesTable, eq(categoriesTable.id, booksTable.categoryId))
    .orderBy(desc(booksTable.createdAt))

  return rows.map((row) => ({
    id: row.id,
    title: row.title,
    slug: row.slug,
    autor_id: row.authorId,
    categoria_id: row.categoryId,
    autorName: row.autorName ?? '-',
    categoriaName: row.categoriaName ?? '-',
    price: row.price,
    discount_price: row.discountPrice ?? null,
    cover_image: row.coverImageUrl,
    isbn: row.isbn ?? '',
    stock: row.stock,
    rating: row.rating,
    review_count: row.reviewCount,
    is_bestseller: row.isBestseller,
    is_new: row.isNew,
    active: true,
    created_at: row.createdAt,
  }))
}

export async function getLibroParaEditar(id: string): Promise<AdminLibroEditable | null> {
  const [row] = await db.select().from(booksTable).where(eq(booksTable.id, id)).limit(1)
  if (!row) return null

  const [formatRows, imageRows, tagRows] = await Promise.all([
    db.select().from(bookFormats).where(eq(bookFormats.bookId, id)),
    db.select().from(bookImages).where(eq(bookImages.bookId, id)).orderBy(bookImages.position),
    db.select().from(bookTags).where(eq(bookTags.bookId, id)),
  ])

  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    autor_id: row.authorId,
    categoria_id: row.categoryId,
    description: row.description,
    price: row.price,
    discount_price: row.discountPrice ?? null,
    discount_percentage: row.discountPercentage ?? null,
    cover_image: row.coverImageUrl,
    isbn: row.isbn,
    publisher: row.publisher,
    pages: row.pages,
    language: row.language,
    publish_date: row.publishDate,
    dimensions: row.dimensions,
    stock: row.stock,
    is_bestseller: row.isBestseller,
    is_new: row.isNew,
    tags: tagRows.map((t) => t.tag),
    libro_formatos: formatRows.map((f) => ({
      id: f.id,
      format_type: f.type,
      price: f.price,
      stock: f.stock,
    })),
    libro_imagenes: imageRows.map((i) => ({ url: i.url })),
  }
}

export async function getAutoresConConteo(): Promise<AdminAutor[]> {
  const rows = await db
    .select({
      id: authorsTable.id,
      name: authorsTable.name,
      slug: authorsTable.slug,
      bio: authorsTable.bio,
      photo_url: authorsTable.photoUrl,
      bookCount: sql<number>`count(${booksTable.id})::int`,
    })
    .from(authorsTable)
    .leftJoin(booksTable, eq(booksTable.authorId, authorsTable.id))
    .groupBy(authorsTable.id)
    .orderBy(asc(authorsTable.name))

  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    slug: row.slug,
    bio: row.bio ?? '',
    photo_url: row.photo_url,
    bookCount: row.bookCount,
  }))
}

export async function getCategoriasConConteo(): Promise<AdminCategoria[]> {
  const rows = await db
    .select({
      id: categoriesTable.id,
      name: categoriesTable.name,
      slug: categoriesTable.slug,
      description: categoriesTable.description,
      icon: categoriesTable.icon,
      bookCount: sql<number>`count(${booksTable.id})::int`,
    })
    .from(categoriesTable)
    .leftJoin(booksTable, eq(booksTable.categoryId, categoriesTable.id))
    .groupBy(categoriesTable.id)
    .orderBy(asc(categoriesTable.name))

  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    icon: row.icon,
    sort_order: 0,
    bookCount: row.bookCount,
  }))
}

export async function listPedidos(): Promise<AdminPedido[]> {
  const rows = await db
    .select({
      id: orders.id,
      total: orders.total,
      status: orders.status,
      createdAt: orders.createdAt,
      shippingAddress: orders.shippingAddress,
      cliente: usersTable.fullName,
      email: usersTable.email,
      itemsCount: sql<number>`count(${orderItems.id})::int`,
    })
    .from(orders)
    .leftJoin(usersTable, eq(usersTable.id, orders.userId))
    .leftJoin(orderItems, eq(orderItems.orderId, orders.id))
    .groupBy(orders.id, usersTable.fullName, usersTable.email)
    .orderBy(desc(orders.createdAt))
    .limit(100)

  return rows.map((row) => ({
    id: row.id,
    numero: row.id,
    cliente: row.cliente || row.email || 'Cliente',
    total: row.total,
    status: row.status,
    itemsCount: row.itemsCount,
    created_at: row.createdAt,
    shipping_address: row.shippingAddress as Record<string, unknown>,
  }))
}