import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ProductView } from '@/components/product/ProductView'
import { getBookBySlug, getBookParams } from '@/lib/data'

export const revalidate = 3600

interface ProductPageProps {
  params: Promise<{ categoria: string; slug: string }>
}

export async function generateStaticParams() {
  return getBookParams()
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params
  const book = await getBookBySlug(slug)

  if (!book) {
    return { title: 'Libro no encontrado' }
  }

  return {
    title: `${book.title} · ${book.author.name}`,
    description: book.description.slice(0, 155),
    openGraph: {
      title: `${book.title} · ${book.author.name}`,
      description: book.description.slice(0, 155),
      type: 'book',
      images: [{ url: book.coverImage }],
    },
    alternates: {
      canonical: `/libros/${book.category.slug}/${book.slug}`,
    },
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params
  const book = await getBookBySlug(slug)

  if (!book) {
    notFound()
  }

  return <ProductView book={book} />
}