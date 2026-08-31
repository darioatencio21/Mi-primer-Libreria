import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tus Libros Ya | Librería online premium',
  description:
    'Descubre libros físicos, ebooks y audiolibros curados. Envío rápido, devoluciones fáciles y atención personalizada.',
  openGraph: {
    title: 'Tus Libros Ya | Librería online premium',
    description:
      'Descubre libros físicos, ebooks y audiolibros curados. Envío rápido, devoluciones fáciles y atención personalizada.',
    type: 'website',
    siteName: 'Tus Libros Ya',
    locale: 'es_ES',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tus Libros Ya | Librería online premium',
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

