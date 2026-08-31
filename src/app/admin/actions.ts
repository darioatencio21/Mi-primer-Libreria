'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'
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
  const supabase = createAdminClient()
  const base = slugify(title) || 'libro'
  let slug = base
  let i = 1
  for (;;) {
    const { data } = await supabase
      .from('libros')
      .select('id')
      .eq('slug', slug)
      .neq('id', excludeId ?? '')
      .maybeSingle()
    if (!data) return slug
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
  const supabase = createAdminClient()

  const title = String(formData.get('title') ?? '').trim()
  if (!title) return { ok: false, message: 'El título es obligatorio.' }

  const autorId = String(formData.get('autor_id') ?? '')
  const categoriaId = String(formData.get('categoria_id') ?? '')
  if (!autorId || !categoriaId) return { ok: false, message: 'Autor y categoría son obligatorios.' }

  const slug = await ensureUniqueSlug(title)

  const { data: libro, error } = await supabase
    .from('libros')
    .insert({
      title,
      slug,
      autor_id: autorId,
      categoria_id: categoriaId,
      description: String(formData.get('description') ?? ''),
      price: toNum(formData.get('price')),
      discount_price: toNumOrNull(formData.get('discount_price')),
      discount_percentage: toIntOrNull(formData.get('discount_percentage')),
      cover_image: String(formData.get('cover_image') ?? '').trim(),
      isbn: String(formData.get('isbn') ?? '').trim() || null,
      publisher: String(formData.get('publisher') ?? '').trim() || null,
      pages: toIntOrNull(formData.get('pages')),
      language: String(formData.get('language') ?? 'Español').trim() || 'Español',
      publish_date: String(formData.get('publish_date') ?? '').trim() || null,
      dimensions: String(formData.get('dimensions') ?? '').trim() || null,
      stock: toInt(formData.get('stock')),
      is_bestseller: checkbox(formData.get('is_bestseller')),
      is_new: checkbox(formData.get('is_new')),
      tags: splitTags(formData.get('tags')),
    })
    .select('id')
    .single()

  if (error) return { ok: false, message: `Error al crear: ${error.message}` }
  if (!libro) return { ok: false, message: 'No se pudo crear el libro.' }

  await replaceFormats(libro.id, formData)
  await replaceImages(libro.id, formData)

  revalidatePath('/libros')
  revalidatePath('/admin/libros')
  redirect('/admin/libros')
}

export async function actualizarLibro(
  id: string,
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  await assertAdmin()
  const supabase = createAdminClient()

  const title = String(formData.get('title') ?? '').trim()
  if (!title) return { ok: false, message: 'El título es obligatorio.' }

  const autorId = String(formData.get('autor_id') ?? '')
  const categoriaId = String(formData.get('categoria_id') ?? '')
  if (!autorId || !categoriaId) return { ok: false, message: 'Autor y categoría son obligatorios.' }

  const { error } = await supabase
    .from('libros')
    .update({
      title,
      autor_id: autorId,
      categoria_id: categoriaId,
      description: String(formData.get('description') ?? ''),
      price: toNum(formData.get('price')),
      discount_price: toNumOrNull(formData.get('discount_price')),
      discount_percentage: toIntOrNull(formData.get('discount_percentage')),
      cover_image: String(formData.get('cover_image') ?? '').trim(),
      isbn: String(formData.get('isbn') ?? '').trim() || null,
      publisher: String(formData.get('publisher') ?? '').trim() || null,
      pages: toIntOrNull(formData.get('pages')),
      language: String(formData.get('language') ?? 'Español').trim() || 'Español',
      publish_date: String(formData.get('publish_date') ?? '').trim() || null,
      dimensions: String(formData.get('dimensions') ?? '').trim() || null,
      stock: toInt(formData.get('stock')),
      is_bestseller: checkbox(formData.get('is_bestseller')),
      is_new: checkbox(formData.get('is_new')),
      tags: splitTags(formData.get('tags')),
    })
    .eq('id', id)

  if (error) return { ok: false, message: `Error al actualizar: ${error.message}` }

  await replaceFormats(id, formData)
  await replaceImages(id, formData)

  revalidatePath(`/libros/${getSlugFromForm(formData) || ''}`)
  revalidatePath('/libros')
  revalidatePath('/admin/libros')
  redirect('/admin/libros')
}

export async function eliminarLibro(id: string): Promise<ActionResult> {
  await assertAdmin()
  const supabase = createAdminClient()
  const { error } = await supabase.from('libros').delete().eq('id', id)
  if (error) return { ok: false, message: `Error al eliminar: ${error.message}` }
  revalidatePath('/libros')
  revalidatePath('/admin/libros')
  return { ok: true }
}

async function replaceFormats(libroId: string, formData: FormData): Promise<void> {
  const supabase = createAdminClient()
  await supabase.from('libro_formatos').delete().eq('libro_id', libroId)
  const tipos = ['hardcover', 'paperback', 'ebook', 'audiobook'] as const
  const rows = tipos
    .map((tipo) => {
      const price = toNumOrNull(formData.get(`format_${tipo}_price`))
      const stock = toIntOrNull(formData.get(`format_${tipo}_stock`))
      if (price == null || price <= 0) return null
      return { libro_id: libroId, format_type: tipo, price, stock: stock ?? 0 }
    })
    .filter((r): r is NonNullable<typeof r> => r != null)
  if (rows.length > 0) {
    await supabase.from('libro_formatos').insert(rows)
  }
}

async function replaceImages(libroId: string, formData: FormData): Promise<void> {
  const supabase = createAdminClient()
  await supabase.from('libro_imagenes').delete().eq('libro_id', libroId)
  const urls = String(formData.get('images') ?? '')
    .split(',')
    .map((u) => u.trim())
    .filter(Boolean)
  if (urls.length > 0) {
    await supabase
      .from('libro_imagenes')
      .insert(urls.map((url, i) => ({ libro_id: libroId, url, alt: null, sort_order: i })))
  }
}

function getSlugFromForm(formData: FormData): string {
  return String(formData.get('slug') ?? '')
}

// ---------- AUTORES ----------

export async function crearAutor(formData: FormData): Promise<ActionResult> {
  await assertAdmin()
  const supabase = createAdminClient()
  const name = String(formData.get('name') ?? '').trim()
  if (!name) return { ok: false, message: 'El nombre es obligatorio.' }
  const slug = slugify(name)
  const { error } = await supabase
    .from('autores')
    .insert({ name, slug, bio: String(formData.get('bio') ?? '').trim(), photo: nullable(formData.get('photo')) })
  if (error) return { ok: false, message: `Error: ${error.message}` }
  revalidatePath('/admin/autores')
  return { ok: true }
}

export async function actualizarAutor(id: string, formData: FormData): Promise<ActionResult> {
  await assertAdmin()
  const supabase = createAdminClient()
  const name = String(formData.get('name') ?? '').trim()
  if (!name) return { ok: false, message: 'El nombre es obligatorio.' }
  const { error } = await supabase
    .from('autores')
    .update({
      name,
      bio: String(formData.get('bio') ?? '').trim(),
      photo: nullable(formData.get('photo')),
    })
    .eq('id', id)
  if (error) return { ok: false, message: `Error: ${error.message}` }
  revalidatePath('/admin/autores')
  return { ok: true }
}

export async function eliminarAutor(id: string): Promise<ActionResult> {
  await assertAdmin()
  const supabase = createAdminClient()
  const { error } = await supabase.from('autores').delete().eq('id', id)
  if (error) return { ok: false, message: `Error: ${error.message}` }
  revalidatePath('/admin/autores')
  return { ok: true }
}

// ---------- CATEGORÍAS ----------

export async function crearCategoria(formData: FormData): Promise<ActionResult> {
  await assertAdmin()
  const supabase = createAdminClient()
  const name = String(formData.get('name') ?? '').trim()
  if (!name) return { ok: false, message: 'El nombre es obligatorio.' }
  const slug = slugify(name)
  const { error } = await supabase
    .from('categorias')
    .insert({
      name,
      slug,
      description: String(formData.get('description') ?? '').trim(),
      icon: String(formData.get('icon') ?? '').trim(),
      sort_order: toInt(formData.get('sort_order')),
    })
  if (error) return { ok: false, message: `Error: ${error.message}` }
  revalidatePath('/admin/categorias')
  return { ok: true }
}

export async function actualizarCategoria(id: string, formData: FormData): Promise<ActionResult> {
  await assertAdmin()
  const supabase = createAdminClient()
  const name = String(formData.get('name') ?? '').trim()
  if (!name) return { ok: false, message: 'El nombre es obligatorio.' }
  const { error } = await supabase
    .from('categorias')
    .update({
      name,
      description: String(formData.get('description') ?? '').trim(),
      icon: String(formData.get('icon') ?? '').trim(),
      sort_order: toInt(formData.get('sort_order')),
    })
    .eq('id', id)
  if (error) return { ok: false, message: `Error: ${error.message}` }
  revalidatePath('/admin/categorias')
  return { ok: true }
}

export async function eliminarCategoria(id: string): Promise<ActionResult> {
  await assertAdmin()
  const supabase = createAdminClient()
  const { error } = await supabase.from('categorias').delete().eq('id', id)
  if (error) return { ok: false, message: `Error: ${error.message}` }
  revalidatePath('/admin/categorias')
  return { ok: true }
}

// ---------- PEDIDOS ----------

export async function actualizarEstadoPedido(id: string, status: string): Promise<ActionResult> {
  await assertAdmin()
  const supabase = createAdminClient()
  const valid = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']
  if (!valid.includes(status)) return { ok: false, message: 'Estado no válido.' }
  const { error } = await supabase.from('pedidos').update({ status }).eq('id', id)
  if (error) return { ok: false, message: `Error: ${error.message}` }
  revalidatePath('/admin/pedidos')
  return { ok: true }
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
