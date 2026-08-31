import { notFound } from 'next/navigation'
import { ProductView, type ReviewView } from '@/components/catalog/ProductView'
import { getLibroPorSlug, getResenasDeLibro, getLibrosRelacionados } from '@/lib/db'

interface PageProps {
  params: Promise<{ categoria: string; slug: string }>
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params

  const book = await getLibroPorSlug(slug)
  if (!book) {
    notFound()
  }

  const [resenasRaw, related] = await Promise.all([
    getResenasDeLibro(book.id),
    getLibrosRelacionados(book.id, book.category.slug, 8),
  ])

  const resenas: ReviewView[] = resenasRaw.map((r) => ({
    id: r.id,
    userName: r.userName,
    rating: r.rating,
    date: r.date,
    title: r.title,
    content: r.content,
    helpful: r.helpful,
  }))

  return (
    <ProductView
      book={book}
      reviews={resenas}
      related={related}
      categoryName={book.category.name}
    />
  )
}
