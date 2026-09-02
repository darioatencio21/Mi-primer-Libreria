import type { Book } from '@/lib/types'
import { getBookDisplayPrice } from '@/lib/book-price'

export function generateProductJsonLd(book: Book) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: book.title,
    description: book.description,
    isbn: book.isbn,
    author: {
      '@type': 'Person',
      name: book.author.name,
    },
    publisher: {
      '@type': 'Organization',
      name: book.publisher,
    },
    datePublished: book.publishDate,
    numberOfPages: book.pages,
    inLanguage: book.language,
    image: book.coverImage,
    offers: {
      '@type': 'Offer',
      price: getBookDisplayPrice(book).toFixed(2),
      priceCurrency: 'ARS',
      availability: book.stock > 0
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: book.rating,
      reviewCount: book.reviewCount,
    },
  }
}

export function generateBreadcrumbJsonLd(
  items: { label: string; href?: string }[]
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      item: item.href
        ? `${process.env.NEXT_PUBLIC_SITE_URL || 'https://tuslibrosya.com'}${item.href}`
        : undefined,
    })),
  }
}

export function generateOrganizationJsonLd() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tuslibrosya.com'

  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Tus Libros Ya',
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    sameAs: [],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      availableLanguage: ['Spanish', 'English'],
    },
  }
}

