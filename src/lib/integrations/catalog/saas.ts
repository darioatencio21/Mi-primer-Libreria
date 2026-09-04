import 'server-only'
import type { Author, Book, Category, Review } from '@/lib/types'
import type { CatalogProvider } from './ports'
import { graphqlRequest } from './graphql'
import {
  GET_BOOK_BY_SLUG,
  GET_BOOK_PARAMS,
  GET_BOOKS_BY_AUTHOR,
  GET_BOOKS_BY_IDS,
  GET_BESTSELLERS,
  GET_CATALOG,
  GET_CATALOG_SLUGS,
  GET_FEATURED_AUTHORS,
  GET_NEW_RELEASES,
  GET_RELATED,
  GET_REVIEWS_BY_BOOK,
  GET_ALL_AUTHORS,
  SEARCH_BOOKS,
  GET_CATEGORIES,
  GET_AUTHOR_BY_SLUG,
} from './queries'
import {
  mapSaaSBook,
  mapSaaSBookAuthor,
  mapSaaSBookCategory,
  mapSAASCatalog,
  mapSaaSReview,
  type SaaSAuthor,
  type SaaSBook,
  type SaaSBookCategory,
  type SaaSBookParams,
  type SAASCatalog,
  type SaaSReview,
} from './mappers'

/**
 * Adaptador de catálogo hacia el SaaS EXTERNO (GraphQL).
 * Resuelve el catálogo, precios, imágenes, stock y reseñas desde el servicio
 * remoto en lugar de Supabase.
 *
 * La URL del endpoint se lee en runtime desde CATALOG_API_URL (GraphQL).
 */
export class SaaSCatalogProvider implements CatalogProvider {
  readonly id = 'saas'
  private readonly endpoint: string

  constructor(endpoint?: string) {
    if (!endpoint) {
      throw new Error(
        'SaaSCatalogProvider necesita CATALOG_API_URL (endpoint GraphQL del SaaS)'
      )
    }
    this.endpoint = endpoint
  }

  private token(): string | undefined {
    return process.env.CATALOG_API_TOKEN
  }

  async getBookBySlug(slug: string): Promise<Book | null> {
    const { book } = await graphqlRequest<{ book: SaaSBook | null }>(
      this.endpoint,
      GET_BOOK_BY_SLUG,
      { slug },
      this.token()
    )
    return book == null ? null : mapSaaSBook(book)
  }

  async getBestsellers(limit = 8): Promise<Book[]> {
    const { bestsellers } = await graphqlRequest<{ bestsellers: SaaSBook[] }>(
      this.endpoint,
      GET_BESTSELLERS,
      { limit },
      this.token()
    )
    return (bestsellers ?? []).map(mapSaaSBook)
  }

  async getNewReleases(limit = 8): Promise<Book[]> {
    const { newReleases } = await graphqlRequest<{ newReleases: SaaSBook[] }>(
      this.endpoint,
      GET_NEW_RELEASES,
      { limit },
      this.token()
    )
    return (newReleases ?? []).map(mapSaaSBook)
  }

  async getRelatedBooks(bookId: string, categoryId: string, limit = 8): Promise<Book[]> {
    const { relatedBooks } = await graphqlRequest<{ relatedBooks: SaaSBook[] }>(
      this.endpoint,
      GET_RELATED,
      { bookId, categoryId, limit },
      this.token()
    )
    return (relatedBooks ?? []).map(mapSaaSBook)
  }

  async getBooksByAuthor(authorSlug: string): Promise<Book[]> {
    const { booksByAuthor } = await graphqlRequest<{ booksByAuthor: SaaSBook[] }>(
      this.endpoint,
      GET_BOOKS_BY_AUTHOR,
      { authorSlug },
      this.token()
    )
    return (booksByAuthor ?? []).map(mapSaaSBook)
  }

  async getBooksByIds(ids: string[]): Promise<Book[]> {
    if (ids.length === 0) return []
    const { booksByIds } = await graphqlRequest<{ booksByIds: SaaSBook[] }>(
      this.endpoint,
      GET_BOOKS_BY_IDS,
      { ids },
      this.token()
    )
    return (booksByIds ?? []).map(mapSaaSBook)
  }

  async searchBooks(query: string, limit = 24): Promise<Book[]> {
    if (!query.trim()) return []
    const { searchBooks } = await graphqlRequest<{ searchBooks: SaaSBook[] }>(
      this.endpoint,
      SEARCH_BOOKS,
      { query, limit },
      this.token()
    )
    return (searchBooks ?? []).map(mapSaaSBook)
  }

  async getCatalogBySlug(
    slug: string
  ): Promise<{ title: string; description: string; books: Book[] } | null> {
    const { catalog } = await graphqlRequest<{ catalog: SAASCatalog | null }>(
      this.endpoint,
      GET_CATALOG,
      { slug },
      this.token()
    )
    return catalog == null ? null : mapSAASCatalog(catalog)
  }

  async getCatalogSlugs(): Promise<string[]> {
    const { catalogSlugs } = await graphqlRequest<{ catalogSlugs: string[] }>(
      this.endpoint,
      GET_CATALOG_SLUGS,
      {},
      this.token()
    )
    return catalogSlugs ?? []
  }

  async getBookParams(): Promise<{ categoria: string; slug: string }[]> {
    const { bookParams } = await graphqlRequest<{ bookParams: SaaSBookParams[] }>(
      this.endpoint,
      GET_BOOK_PARAMS,
      {},
      this.token()
    )
    return bookParams ?? []
  }

  async getCategories(): Promise<Category[]> {
    const { categories } = await graphqlRequest<{ categories: SaaSBookCategory[] }>(
      this.endpoint,
      GET_CATEGORIES,
      {},
      this.token()
    )
    return (categories ?? []).map(mapSaaSBookCategory)
  }

  async getFeaturedAuthors(limit = 8): Promise<Author[]> {
    const { featuredAuthors } = await graphqlRequest<{ featuredAuthors: SaaSAuthor[] }>(
      this.endpoint,
      GET_FEATURED_AUTHORS,
      { limit },
      this.token()
    )
    return (featuredAuthors ?? []).map(mapSaaSBookAuthor)
  }

  async getAllAuthors(): Promise<Author[]> {
    const { allAuthors } = await graphqlRequest<{ allAuthors: SaaSAuthor[] }>(
      this.endpoint,
      GET_ALL_AUTHORS,
      {},
      this.token()
    )
    return (allAuthors ?? []).map(mapSaaSBookAuthor)
  }

  async getAuthorBySlug(slug: string): Promise<Author | null> {
    const { authorBySlug } = await graphqlRequest<{ authorBySlug: SaaSAuthor | null }>(
      this.endpoint,
      GET_AUTHOR_BY_SLUG,
      { slug },
      this.token()
    )
    return authorBySlug == null ? null : mapSaaSBookAuthor(authorBySlug)
  }

  async getReviewsByBook(bookId: string): Promise<Review[]> {
    const { reviewsByBook } = await graphqlRequest<{ reviewsByBook: SaaSReview[] }>(
      this.endpoint,
      GET_REVIEWS_BY_BOOK,
      { bookId },
      this.token()
    )
    return (reviewsByBook ?? []).map(mapSaaSReview)
  }
}
