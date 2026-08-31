import { notFound } from 'next/navigation'
import { CategoryCatalog } from '@/components/catalog/CategoryCatalog'
import { getLibrosPorCategoria } from '@/lib/db'
import type { Book } from '@/lib/types'

const SPECIAL_CATEGORIES: Record<
  string,
  { title: string; description: string; filter: (b: Book) => boolean }
> = {
  bestsellers: {
    title: 'Bestsellers',
    description: 'Los libros más leídos del momento',
    filter: (b) => b.isBestseller,
  },
  novedades: {
    title: 'Novedades',
    description: 'Los lanzamientos más recientes',
    filter: (b) => b.isNew,
  },
  ofertas: {
    title: 'Ofertas',
    description: 'Grandes libros a precios especiales',
    filter: (b) => b.discountPrice != null,
  },
  recomendados: {
    title: 'Recomendados',
    description: 'Selecciones curadas por nuestro equipo',
    filter: () => true,
  },
}

interface PageProps {
  params: Promise<{ categoria: string }>
}

export default async function CategoryPage({ params }: PageProps) {
  const { categoria } = await params
  const slug = categoria || 'ficcion'

  const special = SPECIAL_CATEGORIES[slug]

  let books: Book[] = []
  let title: string | undefined
  let description: string | undefined

  if (special) {
    books = await getLibrosPorCategoria('')
    books = books.filter(special.filter)
    title = special.title
    description = special.description
  } else {
    books = await getLibrosPorCategoria(slug)
    // buscamos la categoría para su título/descripción
    const first = books[0]
    if (first) {
      title = first.category.name
      description = first.category.description
    }
  }

  if (books.length === 0 && !special) {
    notFound()
  }

  const info = {
    title: title ?? 'Libros',
    description: description ?? 'Explora nuestro catálogo',
  }

  return <CategoryCatalog books={books} info={info} perPage={12} />
}
