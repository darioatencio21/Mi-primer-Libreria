import { SearchCatalog } from '@/components/search/SearchCatalog'
import { getLibrosPorCategoria } from '@/lib/db'
import { sanitizeSearchQuery } from '@/lib/sanitize'

interface PageProps {
  searchParams: Promise<{ q?: string; categoria?: string }>
}

export default async function SearchPage({ searchParams }: PageProps) {
  const sp = await searchParams
  const query = sanitizeSearchQuery(sp.q || '')

  let books
  if (sp.categoria) {
    books = await getLibrosPorCategoria(sp.categoria)
  } else if (query) {
    const { buscarLibros } = await import('@/lib/db')
    books = await buscarLibros({ query })
  } else {
    const { getRecomendados } = await import('@/lib/db')
    books = await getRecomendados(30)
  }

  return <SearchCatalog books={books} query={query} />
}
