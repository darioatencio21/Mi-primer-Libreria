import 'server-only'
import {
  getAuthorBySlug,
  getBestsellers,
  getBookBySlug,
  getBookParams,
  getBooksByAuthor,
  getBooksByIds,
  getCatalogBySlug,
  getCatalogSlugs,
  getFeaturedAuthors,
  getNewReleases,
  getRelatedBooks,
  getReviewsByBook,
  getAllAuthors,
  searchBooks,
  getCategories,
} from '@/lib/data'
import type { CatalogProvider } from './ports'

/**
 * Adaptador de catálogo LOCAL: reenvía a las funciones de `@/lib/data`
 * (lectura de Postgres vía Drizzle). Es el proveedor por defecto mientras no
 * se conecte el SaaS externo. Mantiene exactamente el mismo comportamiento.
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