import { notFound } from 'next/navigation'
import { getLibroParaEditar, getAutoresConConteo, getCategoriasConConteo } from '@/lib/admin/data'
import { PageHeader } from '../../_components'
import { LibroForm, type LibroFormData } from '../_libro-form'

interface PageProps {
  params: Promise<{ id: string }>
}

function formatPrice(n: unknown): string {
  return n == null ? '' : String(n)
}

export default async function EditarLibroPage({ params }: PageProps) {
  const { id } = await params
  const [libro, autores, categorias] = await Promise.all([
    getLibroParaEditar(id),
    getAutoresConConteo(),
    getCategoriasConConteo(),
  ])

  if (!libro) notFound()

  const fmt = (libro.libro_formatos ?? []).reduce((acc, f) => {
    acc[f.format_type] = f
    return acc
  }, {} as Record<string, { format_type: string; price: number; stock: number }>)

  const initial: LibroFormData = {
    id: libro.id,
    title: libro.title,
    slug: libro.slug,
    autor_id: libro.autor_id,
    categoria_id: libro.categoria_id,
    description: libro.description,
    price: formatPrice(libro.price),
    discount_price: formatPrice(libro.discount_price),
    discount_percentage: formatPrice(libro.discount_percentage),
    cover_image: libro.cover_image,
    isbn: libro.isbn ?? '',
    publisher: libro.publisher ?? '',
    pages: libro.pages != null ? String(libro.pages) : '',
    language: libro.language,
    publish_date: libro.publish_date ?? '',
    dimensions: libro.dimensions ?? '',
    stock: String(libro.stock),
    is_bestseller: libro.is_bestseller,
    is_new: libro.is_new,
    tags: (libro.tags ?? []).join(', '),
    formato_hardcover_price: formatPrice(fmt.hardcover?.price),
    formato_hardcover_stock: fmt.hardcover != null ? String(fmt.hardcover.stock) : '',
    formato_paperback_price: formatPrice(fmt.paperback?.price),
    formato_paperback_stock: fmt.paperback != null ? String(fmt.paperback.stock) : '',
    formato_ebook_price: formatPrice(fmt.ebook?.price),
    formato_ebook_stock: fmt.ebook != null ? String(fmt.ebook.stock) : '',
    formato_audiobook_price: formatPrice(fmt.audiobook?.price),
    formato_audiobook_stock: fmt.audiobook != null ? String(fmt.audiobook.stock) : '',
    images: (libro.libro_imagenes ?? []).map((img) => img.url).join(', '),
  }

  return (
    <div>
      <PageHeader title="Editar libro" description={`Editando "${libro.title}"`} />
      <LibroForm autores={autores} categorias={categorias} initial={initial} isEditing />
    </div>
  )
}
