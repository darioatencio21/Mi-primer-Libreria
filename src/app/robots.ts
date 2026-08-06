import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://novabooks.com'

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/checkout', '/cuenta', '/api'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
