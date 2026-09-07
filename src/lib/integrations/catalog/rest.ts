import 'server-only'
import type { Author, Book, Category, Review } from '@/lib/types'
import type { CatalogProvider } from './ports'
import { externalRequest } from '../http'
import {
  mapSaaSCatalog,
  mapSaaSCatalogAuthor,
  mapSaaSCatalogBook,
  mapSaaSCatalogCategory,
  mapSaaSCatalogReview,
  type SaaSCatalog,
  type SaaSCatalogAuthor as SaaSCatalogAuthorShape,
  type SaaSCatalogBook,
  type SaaSCatalogBookParams,
  type SaaSCatalogCategory,
  type SaaSCatalogReview,
} from './mappers'

/**
 * Adaptador de catálogo hacia Camaleón (SaaS externo) vía REST/JSON.
 * Resuelve catálogo, precios (en ARS), imágenes, stock y reseñas desde el
 * servicio remoto en lugar de la base local.
 *
 * Env vars:
 *   CATALOG_API_URL          = base URL de la API REST de Camaleón (ej: https://.../api)
 *   CATALOG_API_TOKEN        = token Bearer opcional (JWT de negocio)
 *   CATALOG_API_TENANT_SLUG  = slug multi-tenant (header X-Tenant-Slug)
 *
 * El contrato REST esperado se documenta en docs/saas-catalog-rest.md.
 */
export class RestCatalogProvider implements CatalogProvider {
  readonly id = 'saas'
  private readonly baseUrl: string

  constructor(baseUrl?: string) {
    if (!baseUrl) {
      throw new Error('RestCatalogProvider necesita CATALOG_API_URL (base REST de Camaleón)')
    }
    this.baseUrl = baseUrl.replace(/\/+$/, '')
  }

  private headers(): Record<string, string> {
    const headers: Record<string, string> = {}
    const token = process.env.CATALOG_API_TOKEN
    const tenant = process.env.CATALOG_API_TENANT_SLUG
    if (token) headers['Authorization'] = `Bearer ${token}`
    if (tenant) headers['X-Tenant-Slug'] = tenant
    return headers
  }

  private get<T>(path: string, query?: Record<string, string | number | undefined>): Promise<T> {
    const params = new URLSearchParams()
    if (query) {
      for (const [key, value] of Object.entries(query)) {
        if (value !== undefined && value !== '') params.set(key, String(value))
      }
    }
    const qs = params.toString()
    return externalRequest<T>(`${path}${qs ? `?${qs}` : ''}`, {
      baseUrl: this.baseUrl,
      method: 'GET',
      headers: this.headers(),
    })
  }

  async getBookBySlug(slug: string): Promise<Book | null> {
    const data = await this.get<{ book: SaaSCatalogBook | null }>(`/catalog/books/${slug}`)
    return data.book == null ? null : mapSaaSCatalogBook(data.book)
  }

  async getBestsellers(limit = 8): Promise<Book[]> {
    const data = await this.get<{ books: SaaSCatalogBook[] | null }>('/catalog/bestsellers', { limit })
    return (data.books ?? []).map(mapSaaSCatalogBook)
  }

  async getNewReleases(limit = 8): Promise<Book[]> {
    const data = await this.get<{ books: SaaSCatalogBook[] | null }>('/catalog/new-releases', { limit })
    return (data.books ?? []).map(mapSaaSCatalogBook)
  }

  async getRelatedBooks(bookId: string, categoryId: string, limit = 8): Promise<Book[]> {
    const data = await this.get<{ books: SaaSCatalogBook[] | null }>(
      `/catalog/books/${bookId}/related`,
      { categoryId, limit }
    )
    return (data.books ?? []).map(mapSaaSCatalogBook)
  }

  async getBooksByAuthor(authorSlug: string): Promise<Book[]> {
    const data = await this.get<{ books: SaaSCatalogBook[] | null }>(
      `/catalog/authors/${authorSlug}/books`
    )
    return (data.books ?? []).map(mapSaaSCatalogBook)
  }

  async getBooksByIds(ids: string[]): Promise<Book[]> {
    if (ids.length === 0) return []
    const data = await this.get<{ books: SaaSCatalogBook[] | null }>('/catalog/books', {
      ids: ids.join(','),
    })
    return (data.books ?? []).map(mapSaaSCatalogBook)
  }

  async searchBooks(query: string, limit = 24): Promise<Book[]> {
    if (!query.trim()) return []
    const data = await this.get<{ books: SaaSCatalogBook[] | null }>('/catalog/search', {
      q: query,
      limit,
    })
    return (data.books ?? []).map(mapSaaSCatalogBook)
  }

  async getCatalogBySlug(
    slug: string
  ): Promise<{ title: string; description: string; books: Book[] } | null> {
    const data = await this.get<{ catalog: SaaSCatalog | null }>(`/catalog/${slug}`)
    return data.catalog == null ? null : mapSaaSCatalog(data.catalog)
  }

  async getCatalogSlugs(): Promise<string[]> {
    const data = await this.get<{ slugs: string[] | null }>('/catalog/slugs')
    return data.slugs ?? []
  }

  async getBookParams(): Promise<{ categoria: string; slug: string }[]> {
    const data = await this.get<{ bookParams: SaaSCatalogBookParams[] | null }>('/catalog/book-params')
    return data.bookParams ?? []
  }

  async getCategories(): Promise<Category[]> {
    const data = await this.get<{ categories: SaaSCatalogCategory[] | null }>('/catalog/categories')
    return (data.categories ?? []).map(mapSaaSCatalogCategory)
  }

  async getFeaturedAuthors(limit = 8): Promise<Author[]> {
    const data = await this.get<{ authors: SaaSCatalogAuthorShape[] | null }>(
      '/catalog/authors/featured',
      { limit }
    )
    return (data.authors ?? []).map(mapSaaSCatalogAuthor)
  }

  async getAllAuthors(): Promise<Author[]> {
    const data = await this.get<{ authors: SaaSCatalogAuthorShape[] | null }>('/catalog/authors')
    return (data.authors ?? []).map(mapSaaSCatalogAuthor)
  }

  async getAuthorBySlug(slug: string): Promise<Author | null> {
    const data = await this.get<{ author: SaaSCatalogAuthorShape | null }>(`/catalog/authors/${slug}`)
    return data.author == null ? null : mapSaaSCatalogAuthor(data.author)
  }

  async getReviewsByBook(bookId: string): Promise<Review[]> {
    const data = await this.get<{ reviews: SaaSCatalogReview[] | null }>(
      `/catalog/books/${bookId}/reviews`
    )
    return (data.reviews ?? []).map(mapSaaSCatalogReview)
  }
}