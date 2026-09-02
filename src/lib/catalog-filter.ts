import type { Book, SearchFilters } from '@/lib/types'
import { getBookDisplayPrice } from '@/lib/book-price'

export function filterBooks(books: Book[], filters: SearchFilters): Book[] {
  let result = books

  if (filters.category) {
    result = result.filter((book) => book.category.slug === filters.category)
  }
  if (filters.format && filters.format.length > 0) {
    result = result.filter((book) =>
      filters.format!.some((type) => book.formats.some((format) => format.type === type))
    )
  }
  if (filters.language && filters.language.length > 0) {
    result = result.filter((book) => filters.language!.includes(book.language))
  }
  if (filters.priceMin != null) {
    result = result.filter((book) => getBookDisplayPrice(book) >= filters.priceMin!)
  }
  if (filters.priceMax != null) {
    result = result.filter((book) => getBookDisplayPrice(book) <= filters.priceMax!)
  }
  if (filters.inStockOnly) {
    result = result.filter((book) => book.stock > 0)
  }

  return sortBooks(result, filters.sortBy)
}

export function sortBooks(
  books: Book[],
  sortBy: SearchFilters['sortBy']
): Book[] {
  const sorted = [...books]

  switch (sortBy) {
    case 'price_asc':
      return sorted.sort(
        (a, b) => getBookDisplayPrice(a) - getBookDisplayPrice(b)
      )
    case 'price_desc':
      return sorted.sort(
        (a, b) => getBookDisplayPrice(b) - getBookDisplayPrice(a)
      )
    case 'rating':
      return sorted.sort((a, b) => b.rating - a.rating)
    case 'newest':
      return sorted.sort(
        (a, b) => (b.publishDate ?? '').localeCompare(a.publishDate ?? '')
      )
    default:
      return sorted
  }
}