import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const revalidate = 0

interface RouteContext {
  params: Promise<{ isbn: string }>
}

/**
 * Devuelve la portada de un libro, sirviéndola a través del servidor
 * (proxy) para evitar bloqueos de hotlinking y CORS.
 *
 * Orden de búsqueda:
 *   1. Open Library por ISBN exacto
 *   2. Open Library por título + autor (si el ISBN no tiene portada)
 *   3. Google Books (proxy de la miniatura)
 *   4. Si ninguna tiene portada, no-content (el cliente usa el placeholder)
 */
export async function GET(request: NextRequest, { params }: RouteContext) {
  const { isbn: raw } = await params
  const isbn = (raw || '')
    .replace(/[^0-9Xx]/g, '')
    .toUpperCase()
  const title = (request.nextUrl.searchParams.get('t') || '').trim()
  const author = (request.nextUrl.searchParams.get('a') || '').trim()
  // Tamaño de Open Library: S (miniaturas ~36px), M (tarjetas ~180px), L (vista grande ~317px)
  const size = (request.nextUrl.searchParams.get('size') || 'M').toUpperCase()
  const coverSize = ['S', 'M', 'L'].includes(size) ? size : 'M'

  const CACHE = {
    'Content-Type': 'image/jpeg',
    'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
  }

  const serve = (buffer: ArrayBuffer, contentType: string) =>
    new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: { ...CACHE, 'Content-Type': contentType || 'image/jpeg' },
    })

  async function coverFromId(coverId: number | undefined) {
    if (!coverId) return null
    const img = await fetch(`https://covers.openlibrary.org/b/id/${coverId}-${coverSize}.jpg`, {
      signal: AbortSignal.timeout(6000),
    })
    if (!img.ok) return null
    return serve(await img.arrayBuffer(), img.headers.get('content-type') || 'image/jpeg')
  }

  // 1) Open Library por ISBN
  if (isbn && isbn.length >= 10) {
    try {
      const search = await fetch(
        `https://openlibrary.org/search.json?q=isbn:${isbn}&fields=cover_i&limit=1`,
        { signal: AbortSignal.timeout(6000) }
      )
      const data = await search.json()
      const coverFromIsbn = await coverFromId(data?.docs?.[0]?.cover_i)
      if (coverFromIsbn) return coverFromIsbn
    } catch {
      // continuar
    }
  }

  // 2) Open Library por título + autor
  if (title) {
    try {
      const q = [title, author].filter(Boolean).join(' ')
      const search = await fetch(
        `https://openlibrary.org/search.json?q=${encodeURIComponent(q)}&fields=cover_i&limit=1`,
        { signal: AbortSignal.timeout(6000) }
      )
      const data = await search.json()
      const coverFromTitle = await coverFromId(data?.docs?.[0]?.cover_i)
      if (coverFromTitle) return coverFromTitle
    } catch {
      // continuar
    }
  }

  // 3) Google Books
  if (isbn && isbn.length >= 10) {
    try {
      const gb = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}&maxResults=1`,
        { signal: AbortSignal.timeout(6000) }
      )
      const gbData = await gb.json()
      const thumb = gbData?.items?.[0]?.volumeInfo?.imageLinks?.thumbnail
      if (thumb) {
        const httpsThumb = thumb.replace(/^http:/, 'https:')
        const img = await fetch(httpsThumb, { signal: AbortSignal.timeout(6000) })
        if (img.ok) {
          return serve(await img.arrayBuffer(), img.headers.get('content-type') || 'image/jpeg')
        }
      }
    } catch {
      // sin portada
    }
  }

  return new NextResponse(null, { status: 404 })
}
