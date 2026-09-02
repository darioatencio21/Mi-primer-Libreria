import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const revalidate = 0

interface RouteContext {
  params: Promise<{ nombre: string }>
}

/**
 * Devuelve la foto de un autor (escritor) sirviéndola a través del servidor
 * (proxy) para evitar bloqueos de hotlinking y CORS.
 *
 * Orden de búsqueda:
 *   1. Open Library por nombre (cada resultado hasta encontrar una foto válida)
 *   2. Wikipedia (español) con `pageimages` como respaldo
 */
export async function GET(request: NextRequest, { params }: RouteContext) {
  const { nombre: raw } = await params
  const nombre = decodeURIComponent(raw || '').trim()
  if (!nombre) {
    return new NextResponse(null, { status: 404 })
  }

  const CACHE = {
    'Cache-Control': 'public, max-age=604800, stale-while-revalidate=2592000',
  }

  const serve = (buffer: ArrayBuffer, contentType: string) =>
    new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: { ...CACHE, 'Content-Type': contentType || 'image/jpeg' },
    })

  const isValidImage = (contentType: string, buffer: ArrayBuffer) =>
    contentType.startsWith('image/') && buffer.byteLength >= 2000

  async function serveRemote(url: string) {
    const img = await fetch(url, { signal: AbortSignal.timeout(8000) })
    if (!img.ok) return null
    const contentType = img.headers.get('content-type') || ''
    const buffer = await img.arrayBuffer()
    if (!isValidImage(contentType, buffer)) return null
    return serve(buffer, contentType)
  }

  // 1) Open Library
  try {
    const search = await fetch(
      `https://openlibrary.org/search/authors.json?q=${encodeURIComponent(nombre)}&limit=5`,
      { signal: AbortSignal.timeout(6000) }
    )
    if (search.ok) {
      const data = await search.json()
      const docs: { key?: string }[] = data?.docs ?? []
      for (const doc of docs) {
        if (!doc.key) continue
        const photo = await serveRemote(
          `https://covers.openlibrary.org/a/olid/${doc.key}-M.jpg`
        )
        if (photo) return photo
      }
    }
  } catch {
    // continuar a Wikipedia
  }

  // 2) Wikipedia (idioma configurable por parámetro de consulta)
  const lang = request.nextUrl.searchParams.get('lang') || 'es'
  try {
    const titles = nombre
    const apiUrl =
      `https://${lang}.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(titles)}` +
      `&prop=pageimages&format=json&pithumbsize=400&redirects=1`
    const wp = await fetch(apiUrl, { signal: AbortSignal.timeout(8000) })
    if (wp.ok) {
      const wpData = await wp.json()
      const pages = wpData?.query?.pages ?? {}
      for (const page of Object.values(pages) as {
        thumbnail?: { source?: string }
        pageimage?: string
      }[]) {
        const thumb = page?.thumbnail?.source
        if (!thumb) continue
        // Wikipedia nos da la miniatura cacheada; pedimos la versión a tamaño completo
        // (`/thumb/`) o directamente la miniatura original
        const photo = await serveRemote(thumb)
        if (photo) return photo
      }
    }
  } catch {
    // sin foto
  }

  return new NextResponse(null, { status: 404 })
}