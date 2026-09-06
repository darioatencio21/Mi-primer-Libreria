import { NextRequest, NextResponse } from 'next/server'
import { searchBooks } from '@/lib/data'

export async function GET(request: NextRequest) {
  const raw = request.nextUrl.searchParams.get('q') ?? ''
  const q = raw.replace(/[<>]/g, '').slice(0, 100).trim()
  if (q.length < 2) return NextResponse.json({ results: [] })

  const books = await searchBooks(q, 6)

  const results = books.map((book) => ({
    id: book.id,
    title: book.title,
    slug: book.slug,
    categorySlug: book.category.slug,
    coverImage: book.coverImage,
    authorName: book.author.name,
    price: book.price,
    rating: book.rating,
  }))

  return NextResponse.json({ results })
}