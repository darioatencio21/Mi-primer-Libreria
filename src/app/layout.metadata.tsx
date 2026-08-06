import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Nova Books | Librería online premium',
  description:
    'Descubre libros físicos, ebooks y audiolibros curados. Envío rápido, devoluciones fáciles y atención personalizada.',
  openGraph: {
    title: 'Nova Books | Librería online premium',
    description:
      'Descubre libros físicos, ebooks y audiolibros curados. Envío rápido, devoluciones fáciles y atención personalizada.',
    type: 'website',
    siteName: 'Nova Books',
    locale: 'es_ES',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nova Books | Librería online premium',
    description:
      'Descubre libros físicos, ebooks y audiolibros curados.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
