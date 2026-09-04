import { cache } from 'react'
import { asc, eq, sql } from 'drizzle-orm'
import { db } from '@/lib/db/client'
import { books as booksTable, categories as categoriesTable } from '@/lib/db/schema'
import { mapCategory } from './mappers'
import type { Category } from '@/lib/types'

export const getCategories = cache(async (): Promise<Category[]> => {
  try {
    const rows = await db
      .select({
        id: categoriesTable.id,
        name: categoriesTable.name,
        slug: categoriesTable.slug,
        description: categoriesTable.description,
        icon: categoriesTable.icon,
        book_count: sql<number>`count(${booksTable.id})::int`,
      })
      .from(categoriesTable)
      .leftJoin(booksTable, eq(booksTable.categoryId, categoriesTable.id))
      .groupBy(categoriesTable.id)
      .orderBy(asc(categoriesTable.name))

    return rows.map((row) =>
      mapCategory({
        id: row.id,
        name: row.name,
        slug: row.slug,
        description: row.description,
        icon: row.icon,
        book_count: row.book_count,
      })
    )
  } catch (err) {
    console.warn('No se pudieron cargar categorías:', err)
    return []
  }
})