'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { and, eq, ne, sql } from 'drizzle-orm'
import { db } from '@/lib/db/client'
import {
  authors as authorsTable,
  books as booksTable,
  bookFormats,
  bookImages,
  bookTags,
  categories as categoriesTable,
  orders,
  reviews as reviewsTable,
  settings as settingsTable,
} from '@/lib/db/schema'
import {
  CHECKOUT_SETTINGS_KEY,
  normalizeCheckoutConfig,
} from '@/lib/checkout-config'
import {
  verifyAdminPassword,
  createAdminSession,
  destroyAdminSession,
  isAdminSessionActive,
} from '@/lib/admin/auth'

interface ActionResult {
  ok: boolean
  message?: string
}

async function assertAdmin() {
  const active = await isAdminSessionActive()
  if (!active) {
    redirect('/admin/login')
  }
}

function slugify(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

async function ensureUniqueSlug(title: string, excludeId?: string): Promise<string> {
  const base = slugify(title) || 'libro'
  let slug = base
  let i = 1
  for (;;) {
    const existing = await db.query.books.findFirst({
      where: excludeId
        ? and(eq(booksTable.slug, slug), ne(booksTable.id, excludeId))
        : eq(booksTable.slug, slug),
      columns: { id: true },
    })
    if (!existing) return slug
    i += 1
    slug = `${base}-${i}`
  }
}

// ---------- SESIÓN ----------

export async function loginAdmin(prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const password = String(formData.get('password') ?? '')
  if (!verifyAdminPassword(password)) {
    return { ok: false, message: 'Contraseña incorrecta.' }
  }
  await createAdminSession()
  redirect('/admin')
}

export async function logoutAdmin() {
  await destroyAdminSession()
  redirect('/admin/login')
}

// ---------- LIBROS ----------

export async function crearLibro(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  await assertAdmin()

  try {
    const title = String(formData.get('title') ?? '').trim()
    if (!title) return { ok: false, message: 'El título es obligatorio.' }

    const autorId = String(formData.get('autor_id') ?? '')
    const categoriaId = String(formData.get('categoria_id') ?? '')
    if (!autorId || !categoriaId) return { ok: false, message: 'Autor y categoría son obligatorios.' }

    const isbn = String(formData.get('isbn') ?? '').trim()
    if (!isbn) return { ok: false, message: 'El ISBN es obligatorio.' }

    const slug = await ensureUniqueSlug(title)

    const [libro] = await db
      .insert(booksTable)
      .values({
        title,
        slug,
        authorId: autorId,
        categoryId: categoriaId,
        description: String(formData.get('description') ?? ''),
        price: toNum(formData.get('price')),
        discountPrice: toNumOrNull(formData.get('discount_price')),
        discountPercentage: toIntOrNull(formData.get('discount_percentage')),
        coverImageUrl: String(formData.get('cover_image') ?? '').trim(),
        isbn,
        publisher: String(formData.get('publisher') ?? '').trim() || null,
        pages: toIntOrNull(formData.get('pages')),
        language: String(formData.get('language') ?? 'Español').trim() || 'Español',
        publishDate: String(formData.get('publish_date') ?? '').trim() || null,
        dimensions: String(formData.get('dimensions') ?? '').trim() || null,
        stock: toInt(formData.get('stock')),
        isBestseller: checkbox(formData.get('is_bestseller')),
        isNew: checkbox(formData.get('is_new')),
      })
      .returning({ id: booksTable.id })

    if (!libro) return { ok: false, message: 'No se pudo crear el libro.' }

    await replaceFormats(libro.id, formData)
    await replaceImages(libro.id, formData)
    await replaceTags(libro.id, formData)

    revalidatePath('/libros')
    revalidatePath('/admin/libros')
    redirect('/admin/libros')
  } catch (err) {
    return { ok: false, message: `Error al crear: ${messageOf(err)}` }
  }
}

export async function actualizarLibro(
  id: string,
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  await assertAdmin()

  try {
    const title = String(formData.get('title') ?? '').trim()
    if (!title) return { ok: false, message: 'El título es obligatorio.' }

    const autorId = String(formData.get('autor_id') ?? '')
    const categoriaId = String(formData.get('categoria_id') ?? '')
    if (!autorId || !categoriaId) return { ok: false, message: 'Autor y categoría son obligatorios.' }

    const isbn = String(formData.get('isbn') ?? '').trim()
    if (!isbn) return { ok: false, message: 'El ISBN es obligatorio.' }

    await db
      .update(booksTable)
      .set({
        title,
        authorId: autorId,
        categoryId: categoriaId,
        description: String(formData.get('description') ?? ''),
        price: toNum(formData.get('price')),
        discountPrice: toNumOrNull(formData.get('discount_price')),
        discountPercentage: toIntOrNull(formData.get('discount_percentage')),
        coverImageUrl: String(formData.get('cover_image') ?? '').trim(),
        isbn,
        publisher: String(formData.get('publisher') ?? '').trim() || null,
        pages: toIntOrNull(formData.get('pages')),
        language: String(formData.get('language') ?? 'Español').trim() || 'Español',
        publishDate: String(formData.get('publish_date') ?? '').trim() || null,
        dimensions: String(formData.get('dimensions') ?? '').trim() || null,
        stock: toInt(formData.get('stock')),
        isBestseller: checkbox(formData.get('is_bestseller')),
        isNew: checkbox(formData.get('is_new')),
      })
      .where(eq(booksTable.id, id))

    await replaceFormats(id, formData)
    await replaceImages(id, formData)
    await replaceTags(id, formData)

    revalidatePath(`/libros/${getSlugFromForm(formData) || ''}`)
    revalidatePath('/libros')
    revalidatePath('/admin/libros')
    redirect('/admin/libros')
  } catch (err) {
    return { ok: false, message: `Error al actualizar: ${messageOf(err)}` }
  }
}

export async function eliminarLibro(id: string): Promise<ActionResult> {
  await assertAdmin()
  try {
    await db.delete(booksTable).where(eq(booksTable.id, id))
    revalidatePath('/libros')
    revalidatePath('/admin/libros')
    return { ok: true }
  } catch (err) {
    return { ok: false, message: `Error al eliminar: ${messageOf(err)}` }
  }
}

const FORMAT_TYPES = ['hardcover', 'paperback', 'ebook', 'audiobook'] as const

async function replaceFormats(bookId: string, formData: FormData): Promise<void> {
  await db.delete(bookFormats).where(eq(bookFormats.bookId, bookId))
  const rows = FORMAT_TYPES
    .map((tipo) => {
      const price = toNumOrNull(formData.get(`format_${tipo}_price`))
      const stock = toIntOrNull(formData.get(`format_${tipo}_stock`))
      if (price == null || price <= 0) return null
      return { bookId, type: tipo, price, stock: stock ?? 0 }
    })
    .filter((r): r is NonNullable<typeof r> => r != null)
  if (rows.length > 0) {
    await db.insert(bookFormats).values(rows)
  }
}

async function replaceImages(bookId: string, formData: FormData): Promise<void> {
  await db.delete(bookImages).where(eq(bookImages.bookId, bookId))
  const urls = String(formData.get('images') ?? '')
    .split(',')
    .map((u) => u.trim())
    .filter(Boolean)
  if (urls.length > 0) {
    await db.insert(bookImages).values(urls.map((url, i) => ({ bookId, url, position: i })))
  }
}

async function replaceTags(bookId: string, formData: FormData): Promise<void> {
  await db.delete(bookTags).where(eq(bookTags.bookId, bookId))
  const tags = splitTags(formData.get('tags'))
  if (tags.length > 0) {
    await db.insert(bookTags).values(tags.map((tag) => ({ bookId, tag })))
  }
}

function getSlugFromForm(formData: FormData): string {
  return String(formData.get('slug') ?? '')
}

// ---------- AUTORES ----------

export async function crearAutor(formData: FormData): Promise<ActionResult> {
  await assertAdmin()
  try {
    const name = String(formData.get('name') ?? '').trim()
    if (!name) return { ok: false, message: 'El nombre es obligatorio.' }
    const slug = slugify(name)
    await db.insert(authorsTable).values({
      name,
      slug,
      bio: String(formData.get('bio') ?? '').trim(),
      photoUrl: nullable(formData.get('photo_url')),
    })
    revalidatePath('/admin/autores')
    return { ok: true }
  } catch (err) {
    return { ok: false, message: `Error: ${messageOf(err)}` }
  }
}

export async function actualizarAutor(id: string, formData: FormData): Promise<ActionResult> {
  await assertAdmin()
  try {
    const name = String(formData.get('name') ?? '').trim()
    if (!name) return { ok: false, message: 'El nombre es obligatorio.' }
    await db
      .update(authorsTable)
      .set({
        name,
        bio: String(formData.get('bio') ?? '').trim(),
        photoUrl: nullable(formData.get('photo_url')),
      })
      .where(eq(authorsTable.id, id))
    revalidatePath('/admin/autores')
    return { ok: true }
  } catch (err) {
    return { ok: false, message: `Error: ${messageOf(err)}` }
  }
}

export async function eliminarAutor(id: string): Promise<ActionResult> {
  await assertAdmin()
  try {
    await db.delete(authorsTable).where(eq(authorsTable.id, id))
    revalidatePath('/admin/autores')
    return { ok: true }
  } catch (err) {
    return { ok: false, message: `Error: ${messageOf(err)}` }
  }
}

// ---------- CATEGORÍAS ----------

export async function crearCategoria(formData: FormData): Promise<ActionResult> {
  await assertAdmin()
  try {
    const name = String(formData.get('name') ?? '').trim()
    if (!name) return { ok: false, message: 'El nombre es obligatorio.' }
    const slug = slugify(name)
    await db.insert(categoriesTable).values({
      name,
      slug,
      description: String(formData.get('description') ?? '').trim(),
      icon: String(formData.get('icon') ?? '').trim(),
    })
    revalidatePath('/admin/categorias')
    return { ok: true }
  } catch (err) {
    return { ok: false, message: `Error: ${messageOf(err)}` }
  }
}

export async function actualizarCategoria(id: string, formData: FormData): Promise<ActionResult> {
  await assertAdmin()
  try {
    const name = String(formData.get('name') ?? '').trim()
    if (!name) return { ok: false, message: 'El nombre es obligatorio.' }
    await db
      .update(categoriesTable)
      .set({
        name,
        description: String(formData.get('description') ?? '').trim(),
        icon: String(formData.get('icon') ?? '').trim(),
      })
      .where(eq(categoriesTable.id, id))
    revalidatePath('/admin/categorias')
    return { ok: true }
  } catch (err) {
    return { ok: false, message: `Error: ${messageOf(err)}` }
  }
}

export async function eliminarCategoria(id: string): Promise<ActionResult> {
  await assertAdmin()
  try {
    await db.delete(categoriesTable).where(eq(categoriesTable.id, id))
    revalidatePath('/admin/categorias')
    return { ok: true }
  } catch (err) {
    return { ok: false, message: `Error: ${messageOf(err)}` }
  }
}

// ---------- PEDIDOS ----------

const ORDER_STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'] as const
type OrderStatusValue = (typeof ORDER_STATUSES)[number]

export async function actualizarEstadoPedido(id: string, status: string): Promise<ActionResult> {
  await assertAdmin()
  if (!(ORDER_STATUSES as readonly string[]).includes(status)) {
    return { ok: false, message: 'Estado no válido.' }
  }
  try {
    await db.update(orders).set({ status: status as OrderStatusValue }).where(eq(orders.id, id))
    revalidatePath('/admin/pedidos')
    return { ok: true }
  } catch (err) {
    return { ok: false, message: `Error: ${messageOf(err)}` }
  }
}

// ---------- CONFIGURACIÓN DEL CHECKOUT ----------

export async function guardarConfiguracionCheckout(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  await assertAdmin()

  try {
    const [row] = await db
      .select()
      .from(settingsTable)
      .where(eq(settingsTable.key, CHECKOUT_SETTINGS_KEY))
      .limit(1)
    const current = normalizeCheckoutConfig(row?.value)

    const shippingMethods = current.shippingMethods.map((m) => ({
      ...m,
      label: String(formData.get(`shipping_${m.id}_label`) ?? '').trim() || m.label,
      time: String(formData.get(`shipping_${m.id}_time`) ?? '').trim() || m.time,
      price: toNum(formData.get(`shipping_${m.id}_price`)),
    }))

    const paymentMethods = current.paymentMethods.map((m) => ({
      ...m,
      label: String(formData.get(`payment_${m.id}_label`) ?? '').trim() || m.label,
      icon: String(formData.get(`payment_${m.id}_icon`) ?? '').trim() || m.icon,
      enabled: formData.get(`payment_${m.id}_enabled`) === 'on',
    }))

    const freeShippingThreshold = toNum(formData.get('free_shipping_threshold'))

    if (shippingMethods.some((m) => m.price < 0)) {
      return { ok: false, message: 'Los precios de envío no pueden ser negativos.' }
    }
    if (freeShippingThreshold < 0) {
      return { ok: false, message: 'El umbral de envío gratis no puede ser negativo.' }
    }

    const value = { shippingMethods, paymentMethods, freeShippingThreshold }

    await db
      .insert(settingsTable)
      .values({ key: CHECKOUT_SETTINGS_KEY, value, updatedAt: new Date().toISOString() })
      .onConflictDoUpdate({
        target: settingsTable.key,
        set: { value, updatedAt: new Date().toISOString() },
      })

    revalidatePath('/admin/configuracion')
    revalidatePath('/')
    return { ok: true }
  } catch (err) {
    return { ok: false, message: `Error al guardar: ${messageOf(err)}` }
  }
}

// ---------- RESEÑAS ----------

async function refreshBookRating(bookId: string | null): Promise<void> {
  if (!bookId) return
  const [agg] = await db
    .select({
      avg: sql<string>`round(coalesce(avg(${reviewsTable.rating}), 0)::numeric, 2)`,
      count: sql<number>`count(*)::int`,
    })
    .from(reviewsTable)
    .where(eq(reviewsTable.bookId, bookId))

  await db
    .update(booksTable)
    .set({
      rating: Number(agg?.avg ?? 0),
      reviewCount: agg?.count ?? 0,
    })
    .where(eq(booksTable.id, bookId))
}

export async function crearReseña(formData: FormData): Promise<ActionResult> {
  await assertAdmin()
  try {
    const bookId = String(formData.get('book') ?? '').trim() || null
    const userName = String(formData.get('userName') ?? '').trim()
    const rating = toInt(formData.get('rating'))
    const title = String(formData.get('title') ?? '').trim().slice(0, 120)
    const content = String(formData.get('content') ?? '').trim().slice(0, 2000)

    if (!userName) return { ok: false, message: 'El nombre del cliente es obligatorio.' }
    if (rating < 1 || rating > 5) {
      return { ok: false, message: 'La calificación debe ser entre 1 y 5.' }
    }
    if (!content) return { ok: false, message: 'El comentario es obligatorio.' }

    await db.insert(reviewsTable).values({ bookId, userName, rating, title: title || null, content })

    if (bookId) await refreshBookRating(bookId)
    revalidatePath('/admin/resenas')
    revalidatePath('/')
    return { ok: true }
  } catch (err) {
    return { ok: false, message: `Error: ${messageOf(err)}` }
  }
}

export async function actualizarReseña(id: string, formData: FormData): Promise<ActionResult> {
  await assertAdmin()
  try {
    const [existing] = await db.select().from(reviewsTable).where(eq(reviewsTable.id, id)).limit(1)
    if (!existing) return { ok: false, message: 'Reseña no encontrada.' }

    const bookId =
      String(formData.get('book') ?? '').trim() || null
    const userName = String(formData.get('userName') ?? '').trim()
    const rating = toInt(formData.get('rating'))
    const title = String(formData.get('title') ?? '').trim().slice(0, 120)
    const content = String(formData.get('content') ?? '').trim().slice(0, 2000)

    if (!userName) return { ok: false, message: 'El nombre del cliente es obligatorio.' }
    if (rating < 1 || rating > 5) {
      return { ok: false, message: 'La calificación debe ser entre 1 y 5.' }
    }

    await db
      .update(reviewsTable)
      .set({ bookId, userName, rating, title: title || null, content })
      .where(eq(reviewsTable.id, id))

    if (existing.bookId !== bookId && existing.bookId) await refreshBookRating(existing.bookId)
    if (bookId) await refreshBookRating(bookId)
    revalidatePath('/admin/resenas')
    revalidatePath('/')
    return { ok: true }
  } catch (err) {
    return { ok: false, message: `Error: ${messageOf(err)}` }
  }
}

export async function eliminarReseña(id: string): Promise<ActionResult> {
  await assertAdmin()
  try {
    const [existing] = await db.select().from(reviewsTable).where(eq(reviewsTable.id, id)).limit(1)
    if (!existing) return { ok: false, message: 'Reseña no encontrada.' }

    await db.delete(reviewsTable).where(eq(reviewsTable.id, id))
    if (existing.bookId) await refreshBookRating(existing.bookId)
    revalidatePath('/admin/resenas')
    revalidatePath('/')
    return { ok: true }
  } catch (err) {
    return { ok: false, message: `Error: ${messageOf(err)}` }
  }
}

// ---------- HELPERS ----------

function toNum(v: FormDataEntryValue | null): number {
  const n = parseFloat(String(v ?? ''))
  return isNaN(n) ? 0 : n
}
function toNumOrNull(v: FormDataEntryValue | null): number | null {
  const s = String(v ?? '').trim()
  if (!s) return null
  const n = parseFloat(s)
  return isNaN(n) ? null : n
}
function toInt(v: FormDataEntryValue | null): number {
  return Math.round(toNum(v))
}
function toIntOrNull(v: FormDataEntryValue | null): number | null {
  const n = toNumOrNull(v)
  return n == null ? null : Math.round(n)
}
function checkbox(v: FormDataEntryValue | null): boolean {
  return v === 'on' || v === 'true' || v === '1'
}
function nullable(v: FormDataEntryValue | null): string | null {
  const s = String(v ?? '').trim()
  return s || null
}
function splitTags(v: FormDataEntryValue | null): string[] {
  return String(v ?? '')
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean)
}
function messageOf(err: unknown): string {
  return err instanceof Error ? err.message : String(err)
}