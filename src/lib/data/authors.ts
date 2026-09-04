import { cache } from 'react'
import { asc, eq, sql } from 'drizzle-orm'
import { db } from '@/lib/db/client'
import { authors as authorsTable, books as booksTable } from '@/lib/db/schema'
import { mapAuthor, type AuthorRow } from './mappers'
import type { Author } from '@/lib/types'

async function fetchAuthors(where?: ReturnType<typeof eq>, limit?: number): Promise<Author[]> {
  try {
    const query = db
      .select({
        id: authorsTable.id,
        name: authorsTable.name,
        slug: authorsTable.slug,
        bio: authorsTable.bio,
        photo_url: authorsTable.photoUrl,
        book_count: sql<number>`count(${booksTable.id})::int`,
      })
      .from(authorsTable)
      .leftJoin(booksTable, eq(booksTable.authorId, authorsTable.id))
      .groupBy(authorsTable.id)
      .orderBy(asc(authorsTable.name))
      .$dynamic()

    const rows = where ? await query.where(where).limit(limit ?? 100) : (limit ? await query.limit(limit) : await query)

    return rows.map((row) =>
      mapAuthor({
        id: row.id,
        name: row.name,
        slug: row.slug,
        bio: row.bio,
        photo_url: row.photo_url,
        book_count: row.book_count,
      } as AuthorRow)
    )
  } catch (err) {
    console.warn('No se pudieron cargar autores:', err)
    return []
  }
}

export const getFeaturedAuthors = cache(async (limit = 8): Promise<Author[]> => {
  return fetchAuthors(undefined, limit)
})

export const getAllAuthors = cache(async (): Promise<Author[]> => {
  return fetchAuthors()
})

export const getAuthorBySlug = cache(async (slug: string): Promise<Author | null> => {
  const [author] = await fetchAuthors(eq(authorsTable.slug, slug), 1)
  return author ?? null
})