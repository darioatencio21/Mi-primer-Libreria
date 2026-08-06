'use client'

import Link from 'next/link'
import { BookCard } from '@/components/product/BookCard'
import { Carousel } from '@/components/ui/Carousel'
import type { Book } from '@/lib/types'

const MOCK_BESTSELLERS: Book[] = [
  {
    id: '1',
    title: 'Cien años de soledad',
    slug: 'cien-anos-de-soledad',
    author: { id: 'a1', name: 'Gabriel García Márquez', slug: 'garcia-marquez', bio: '', bookCount: 12 },
    category: { id: 'c1', name: 'Ficción', slug: 'ficcion', description: '', icon: '', bookCount: 0 },
    description: 'La obra maestra del realismo mágico.',
    price: 24.99,
    formats: [{ type: 'paperback', price: 24.99, stock: 15 }],
    coverImage: '/placeholder-book.svg',
    images: [],
    isbn: '978-0-00-000000-0',
    publisher: 'Editorial Sudamericana',
    pages: 471,
    language: 'Español',
    publishDate: '1967-05-30',
    rating: 4.8,
    reviewCount: 2847,
    stock: 15,
    isBestseller: true,
    isNew: false,
    tags: ['realismo mágico', 'clásico'],
  },
  {
    id: '2',
    title: 'El amor en los tiempos del cólera',
    slug: 'amor-tiempos-colera',
    author: { id: 'a1', name: 'Gabriel García Márquez', slug: 'garcia-marquez', bio: '', bookCount: 12 },
    category: { id: 'c1', name: 'Ficción', slug: 'ficcion', description: '', icon: '', bookCount: 0 },
    description: 'Una historia de amor que trasciende el tiempo.',
    price: 22.99,
    discountPrice: 18.39,
    discountPercentage: 20,
    formats: [{ type: 'paperback', price: 18.39, stock: 8 }],
    coverImage: '/placeholder-book.svg',
    images: [],
    isbn: '978-0-00-000000-1',
    publisher: 'Editorial Sudamericana',
    pages: 368,
    language: 'Español',
    publishDate: '1985-09-05',
    rating: 4.7,
    reviewCount: 1923,
    stock: 8,
    isBestseller: true,
    isNew: false,
    tags: ['romance', 'clásico'],
  },
  {
    id: '3',
    title: 'Kafka en la orilla',
    slug: 'kafka-en-la-orilla',
    author: { id: 'a2', name: 'Haruki Murakami', slug: 'haruki-murakami', bio: '', bookCount: 15 },
    category: { id: 'c1', name: 'Ficción', slug: 'ficcion', description: '', icon: '', bookCount: 0 },
    description: 'Un viaje surrealista entre dos mundos.',
    price: 26.99,
    formats: [{ type: 'hardcover', price: 26.99, stock: 12 }],
    coverImage: '/placeholder-book.svg',
    images: [],
    isbn: '978-0-00-000000-2',
    publisher: 'Tusquets Editores',
    pages: 505,
    language: 'Español',
    publishDate: '2002-09-12',
    rating: 4.6,
    reviewCount: 1456,
    stock: 12,
    isBestseller: true,
    isNew: false,
    tags: ['surrealismo', 'contemporáneo'],
  },
  {
    id: '4',
    title: 'Sapiens: De animales a dioses',
    slug: 'sapiens-de-animales-a-dioses',
    author: { id: 'a3', name: 'Yuval Noah Harari', slug: 'yuval-harari', bio: '', bookCount: 4 },
    category: { id: 'c2', name: 'No Ficción', slug: 'no-ficcion', description: '', icon: '', bookCount: 0 },
    description: 'Una breve historia de la humanidad.',
    price: 29.99,
    formats: [{ type: 'paperback', price: 29.99, stock: 20 }],
    coverImage: '/placeholder-book.svg',
    images: [],
    isbn: '978-0-00-000000-3',
    publisher: 'Debate',
    pages: 496,
    language: 'Español',
    publishDate: '2014-09-04',
    rating: 4.7,
    reviewCount: 3892,
    stock: 20,
    isBestseller: true,
    isNew: false,
    tags: ['historia', 'antropología'],
  },
  {
    id: '5',
    title: 'El principito',
    slug: 'el-principito',
    author: { id: 'a4', name: 'Antoine de Saint-Exupéry', slug: 'saint-exupery', bio: '', bookCount: 3 },
    category: { id: 'c3', name: 'Infantil', slug: 'infantil', description: '', icon: '', bookCount: 0 },
    description: 'Lo esencial es invisible a los ojos.',
    price: 14.99,
    formats: [{ type: 'hardcover', price: 14.99, stock: 30 }],
    coverImage: '/placeholder-book.svg',
    images: [],
    isbn: '978-0-00-000000-4',
    publisher: 'Salamandra',
    pages: 96,
    language: 'Español',
    publishDate: '1943-04-06',
    rating: 4.9,
    reviewCount: 5621,
    stock: 30,
    isBestseller: true,
    isNew: false,
    tags: ['clásico', 'infantil'],
  },
]

export function BestsellersSection() {
  return (
    <section className="py-[var(--space-24)]">
      <div className="mx-auto max-w-[var(--container-max)] px-[var(--space-6)] md:px-[var(--space-10)] lg:px-[var(--space-16)]">
        <div className="flex items-end justify-between mb-[var(--space-8)]">
          <h2 className="text-2xl md:text-4xl font-display font-normal text-text-primary tracking-[var(--tracking-4xl)]">
            Bestsellers del momento
          </h2>
          <Link
            href="/libros/bestsellers"
            className="hidden sm:inline-flex text-sm font-semibold text-brand-primary hover:underline decoration-[1.5px] underline-offset-[3px]"
          >
            Ver todos →
          </Link>
        </div>

        <Carousel gap={24}>
          {MOCK_BESTSELLERS.map((book) => (
            <div key={book.id} className="w-[280px] md:w-[300px]">
              <BookCard book={book} />
            </div>
          ))}
        </Carousel>
      </div>
    </section>
  )
}
