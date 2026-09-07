import 'server-only'
import { getCatalogProvider } from '@/lib/integrations'

/**
 * FACHADA DEL CATÁLOGO.
 *
 * Cada función delega en el adaptador de catálogo ACTIVO (ver
 * `src/lib/integrations/registry.ts`). Por defecto es `postgres` (baja a
 * `@/lib/data/{books,categories,authors,reviews}`), con lo cual el
 * comportamiento es idéntico al histórico. Si se define `CATALOG_PROVIDER=saas`,
 * la tienda lee el catálogo de Camaleón sin tocar estas páginas.
 *
 * Nota: no hay ciclo de dependencias porque `catalog/postgres.ts` importa los
 * módulos internos con rutas profundas (books/categories/authors/reviews).
 */
export function getBookBySlug(slug: string) {
  return getCatalogProvider().getBookBySlug(slug)
}
export function getBestsellers(limit?: number) {
  return getCatalogProvider().getBestsellers(limit)
}
export function getNewReleases(limit?: number) {
  return getCatalogProvider().getNewReleases(limit)
}
export function getRelatedBooks(bookId: string, categoryId: string, limit?: number) {
  return getCatalogProvider().getRelatedBooks(bookId, categoryId, limit)
}
export function getBooksByAuthor(authorSlug: string) {
  return getCatalogProvider().getBooksByAuthor(authorSlug)
}
export function getBooksByIds(ids: string[]) {
  return getCatalogProvider().getBooksByIds(ids)
}
export function searchBooks(query: string, limit?: number) {
  return getCatalogProvider().searchBooks(query, limit)
}
export function getCatalogBySlug(slug: string) {
  return getCatalogProvider().getCatalogBySlug(slug)
}
export function getCatalogSlugs() {
  return getCatalogProvider().getCatalogSlugs()
}
export function getBookParams() {
  return getCatalogProvider().getBookParams()
}
export function getCategories() {
  return getCatalogProvider().getCategories()
}
export function getFeaturedAuthors(limit?: number) {
  return getCatalogProvider().getFeaturedAuthors(limit)
}
export function getAllAuthors() {
  return getCatalogProvider().getAllAuthors()
}
export function getAuthorBySlug(slug: string) {
  return getCatalogProvider().getAuthorBySlug(slug)
}
export function getReviewsByBook(bookId: string) {
  return getCatalogProvider().getReviewsByBook(bookId)
}