import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://novabooks.com'

  const staticPages = [
    '',
    '/libros',
    '/libros/ficcion',
    '/libros/no-ficcion',
    '/libros/infantil',
    '/libros/autoayuda',
    '/libros/academico',
    '/libros/comics',
    '/libros/poesia',
    '/libros/ciencia',
    '/libros/bestsellers',
    '/libros/novedades',
    '/libros/ofertas',
    '/libros/recomendados',
    '/buscar',
    '/ayuda/faq',
    '/ayuda/envios',
    '/ayuda/devoluciones',
    '/ayuda/contacto',
    '/empresa/sobre-nosotros',
    '/empresa/sostenibilidad',
  ]

  return staticPages.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: path === '' ? 'daily' : 'weekly',
    priority: path === '' ? 1 : path.startsWith('/libros/') ? 0.8 : 0.5,
  }))
}
