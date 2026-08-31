import 'server-only'
import { createAdminClient } from '@/lib/supabase/admin'
import type { LibroRow, AuthorRow, CategoriaRow, FormatType } from '@/lib/db/types'
import { mapBook } from '@/lib/db/mappers'

const LIBRO_ITEM_SELECT = `
  id, title, slug, autor_id, categoria_id, price, discount_price, discount_percentage,
  cover_image, isbn, stock, rating, review_count, is_bestseller, is_new, active, created_at,
  autores (id, name, slug),
  categorias (id, name, slug)
`

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

export interface AdminBookFormData {
  id?: string
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
  libro_formatos: { id?: string; format_type: FormatType; price: number; stock: number }[]
  libro_imagenes: { url: string; alt?: string; sort_order: number }[]
}

export interface AdminAutor extends AuthorRow {
  createdAt?: string
  bookCount: number
}

export interface AdminCategoria extends CategoriaRow {
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

export async function getStats() {
  const supabase = createAdminClient()
  const [libros, { count: librosCount }, autores, categorias, pedidos] = await Promise.all([
    supabase.from('libros').select('id, stock, is_bestseller, is_new'),
    supabase.from('libros').select('*', { count: 'exact', head: true }),
    supabase.from('autores').select('*'),
    supabase.from('categorias').select('*'),
    supabase.from('pedidos').select('*').order('created_at', { ascending: false }).limit(5),
  ])

  return {
    totalLibros: librosCount ?? 0,
    totalAutores: autores.data?.length ?? 0,
    totalCategorias: categorias.data?.length ?? 0,
    stockTotal: (libros.data ?? []).reduce((acc, l) => acc + (l.stock ?? 0), 0),
    bestsellers: (libros.data ?? []).filter((l) => l.is_bestseller).length,
    nuevos: (libros.data ?? []).filter((l) => l.is_new).length,
    pedidosRecientes: (pedidos.data ?? []) as unknown as AdminPedido[],
  }
}

export async function listLibros(): Promise<AdminLibro[]> {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('libros')
    .select(LIBRO_ITEM_SELECT)
    .order('created_at', { ascending: false })

  if (error) return []
  return (data ?? []).map((r) => {
    const row = r as unknown as {
      id: string
      title: string
      slug: string
      autor_id: string
      categoria_id: string
      price: number
      discount_price: number | null
      cover_image: string
      isbn: string | null
      stock: number
      rating: number
      review_count: number
      is_bestseller: boolean
      is_new: boolean
      active: boolean
      created_at: string
      autores: AuthorRow | null
      categorias: CategoriaRow | null
    }
    return {
      id: row.id,
      title: row.title,
      slug: row.slug,
      autor_id: row.autor_id,
      categoria_id: row.categoria_id,
      autorName: row.autores?.name ?? '-',
      categoriaName: row.categorias?.name ?? '-',
      price: Number(row.price),
      discount_price: row.discount_price != null ? Number(row.discount_price) : null,
      cover_image: row.cover_image,
      isbn: row.isbn ?? '',
      stock: row.stock,
      rating: Number(row.rating),
      review_count: row.review_count,
      is_bestseller: row.is_bestseller,
      is_new: row.is_new,
      active: row.active,
      created_at: row.created_at,
    }
  })
}

export async function getLibroParaEditar(id: string) {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('libros')
    .select('*, autores (*), categorias (*), libro_formatos (*), libro_imagenes (*)')
    .eq('id', id)
    .single()
  if (error || !data) return null
  return data as unknown as LibroRow & { libro_imagenes: { url: string; alt: string | null; sort_order: number }[] }
}

export async function getAutoresConConteo(): Promise<AdminAutor[]> {
  const supabase = createAdminClient()
  const { data } = await supabase.from('autores').select('*').order('name', { ascending: true })
  const autores = (data ?? []) as unknown as AuthorRow[]
  const { data: libros } = await supabase.from('libros').select('autor_id')
  const count = new Map<string, number>()
  ;(libros ?? []).forEach((l) => count.set(l.autor_id as string, (count.get(l.autor_id as string) ?? 0) + 1))
  return autores.map((a) => ({ ...a, bookCount: count.get(a.id) ?? 0 }))
}

export async function getCategoriasConConteo(): Promise<AdminCategoria[]> {
  const supabase = createAdminClient()
  const { data } = await supabase.from('categorias').select('*').order('sort_order', { ascending: true })
  const cats = (data ?? []) as unknown as CategoriaRow[]
  const { data: libros } = await supabase.from('libros').select('categoria_id')
  const count = new Map<string, number>()
  ;(libros ?? []).forEach((l) => count.set(l.categoria_id as string, (count.get(l.categoria_id as string) ?? 0) + 1))
  return cats.map((c) => ({ ...c, bookCount: count.get(c.id) ?? 0 }))
}

export async function listPedidos(): Promise<AdminPedido[]> {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('pedidos')
    .select('*, profiles (full_name, email), pedido_items (id)')
    .order('created_at', { ascending: false })
    .limit(100)
  if (error) return []
  return (data ?? []).map((r) => {
    const row = r as unknown as {
      id: string
      numero: string
      total: number
      status: string
      created_at: string
      shipping_address: Record<string, unknown>
      profiles: { full_name: string | null; email: string | null } | null
      pedido_items: unknown[]
    }
    return {
      id: row.id,
      numero: row.numero,
      cliente: row.profiles?.full_name || row.profiles?.email || 'Cliente',
      total: Number(row.total),
      status: row.status,
      itemsCount: (row.pedido_items ?? []).length,
      created_at: row.created_at,
      shipping_address: row.shipping_address,
    }
  })
}
