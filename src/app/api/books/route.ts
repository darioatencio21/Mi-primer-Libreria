import { NextResponse, type NextRequest } from 'next/server'
import { getBooksByIds } from '@/lib/data'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const ids = request.nextUrl.searchParams.get('ids')?.split(',').filter(Boolean) ?? []

  if (ids.length === 0) {
    return NextResponse.json({ books: [] })
  }

  if (ids.length > 100) {
    return NextResponse.json({ error: 'Demasiados IDs' }, { status: 400 })
  }

  try {
    const books = await getBooksByIds(ids)
    return NextResponse.json({ books })
  } catch (error) {
    console.error('[api/books] Error fetching books by ids:', error)
    return NextResponse.json({ error: 'No se pudieron cargar los libros' }, { status: 500 })
  }
}