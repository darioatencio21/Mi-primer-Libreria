import 'server-only'
import {
  getBookBySlug,
  getBestsellers,
  getNewReleases,
  getRelatedBooks,
  getBooksByAuthor,
  getBooksByIds,
  searchBooks,
  getCatalogBySlug,
  getCatalogSlugs,
  getBookParams,
} from '@/lib/data/books'
import { getCategories } from '@/lib/data/categories'
import { getFeaturedAuthors, getAllAuthors, getAuthorBySlug } from '@/lib/data/authors'
import { getReviewsByBook } from '@/lib/data/reviews'
import type { CatalogProvider } from './ports'

/**
 * Adaptador de catálogo LOCAL: reenvía a los módulos de datos de Postgres
 * (`@/lib/data/{books,categories,authors,reviews}`, vía rutas profundas para
 * evitar el ciclo con la fachada `@/lib/data`). Es el proveedor por defecto
 * mientras no se conecte el SaaS externo. Mantiene exactamente el mismo
 * comportamiento.
 */
export class PostgresCatalogProvider implements CatalogProvider {
  readonly id = 'postgres'

  getBookBySlug = getBookBySlug
  getBestsellers = getBestsellers
  getNewReleases = getNewReleases
  getRelatedBooks = getRelatedBooks
  getBooksByAuthor = getBooksByAuthor
  getBooksByIds = getBooksByIds
  searchBooks = searchBooks
  getCatalogBySlug = getCatalogBySlug
  getCatalogSlugs = getCatalogSlugs
  getBookParams = getBookParams
  getCategories = getCategories
  getFeaturedAuthors = getFeaturedAuthors
  getAllAuthors = getAllAuthors
  getAuthorBySlug = getAuthorBySlug
  getReviewsByBook = getReviewsByBook
}