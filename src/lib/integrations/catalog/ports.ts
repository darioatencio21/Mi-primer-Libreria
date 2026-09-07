import 'server-only'
import type { Author, Book, Category, Review } from '@/lib/types'

/**
 * PUERTO del catálogo.
 *
 * Define QUÉ necesita la tienda para mostrar libros, categorías, autores y
 * reseñas. El código de la tienda (páginas y componentes server) depende de
 * esta interfaz, NO de Postgres ni del SaaS directamente.
 *
 * La implementación por defecto (PostgresCatalogProvider) envuelve los
 * `@/lib/data` existentes. La RestCatalogProvider consulta la API REST de
 * Camaleón (ver rest.ts + docs/saas-catalog-rest.md). Cambiar la fuente =
 * cambiar CATALOG_PROVIDER en .env.
 */
export interface CatalogProvider {
  readonly id: string

  getBookBySlug(slug: string): Promise<Book | null>

  getBestsellers(limit?: number): Promise<Book[]>
  getNewReleases(limit?: number): Promise<Book[]>
  getRelatedBooks(bookId: string, categoryId: string, limit?: number): Promise<Book[]>
  getBooksByAuthor(authorSlug: string): Promise<Book[]>
  getBooksByIds(ids: string[]): Promise<Book[]>

  searchBooks(query: string, limit?: number): Promise<Book[]>

  /** Detalle de una categoría o colección: título, descripción y libros. */
  getCatalogBySlug(
    slug: string
  ): Promise<{ title: string; description: string; books: Book[] } | null>

  /** Slugs de categorías + colecciones, para generar rutas estáticas. */
  getCatalogSlugs(): Promise<string[]>
  /** `{ categoria, slug }` para generar rutas estáticas de libros. */
  getBookParams(): Promise<{ categoria: string; slug: string }[]>

  getCategories(): Promise<Category[]>
  getFeaturedAuthors(limit?: number): Promise<Author[]>
  getAllAuthors(): Promise<Author[]>
  getAuthorBySlug(slug: string): Promise<Author | null>

  getReviewsByBook(bookId: string): Promise<Review[]>
}
