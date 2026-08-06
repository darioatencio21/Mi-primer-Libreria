import Link from 'next/link'
import { BookCard } from '@/components/product/BookCard'
import type { Book } from '@/lib/types'

const MOCK_RECOMMENDED: Book[] = [
  {
    id: '6',
    title: 'Tokio blues',
    slug: 'tokio-blues',
    author: { id: 'a2', name: 'Haruki Murakami', slug: 'haruki-murakami', bio: '', bookCount: 15 },
    category: { id: 'c1', name: 'Ficción', slug: 'ficcion', description: '', icon: '', bookCount: 0 },
    description: 'Una novela sobre la juventud y la nostalgia.',
    price: 23.99,
    formats: [{ type: 'paperback', price: 23.99, stock: 10 }],
    coverImage: '/placeholder-book.svg',
    images: [],
    isbn: '978-0-00-000000-5',
    publisher: 'Tusquets Editores',
    pages: 352,
    language: 'Español',
    publishDate: '1987-09-04',
    rating: 4.5,
    reviewCount: 1234,
    stock: 10,
    isBestseller: false,
    isNew: true,
    tags: ['contemporáneo', 'japón'],
  },
  {
    id: '7',
    title: '21 lecciones para el siglo XXI',
    slug: '21-lecciones-siglo-xxi',
    author: { id: 'a3', name: 'Yuval Noah Harari', slug: 'yuval-harari', bio: '', bookCount: 4 },
    category: { id: 'c2', name: 'No Ficción', slug: 'no-ficcion', description: '', icon: '', bookCount: 0 },
    description: 'Reflexiones sobre los desafíos del presente.',
    price: 27.99,
    formats: [{ type: 'paperback', price: 27.99, stock: 18 }],
    coverImage: '/placeholder-book.svg',
    images: [],
    isbn: '978-0-00-000000-6',
    publisher: 'Debate',
    pages: 496,
    language: 'Español',
    publishDate: '2018-08-30',
    rating: 4.6,
    reviewCount: 2156,
    stock: 18,
    isBestseller: false,
    isNew: true,
    tags: ['ensayo', 'contemporáneo'],
  },
  {
    id: '8',
    title: 'Crónica de una muerte anunciada',
    slug: 'cronica-muerte-anunciada',
    author: { id: 'a1', name: 'Gabriel García Márquez', slug: 'garcia-marquez', bio: '', bookCount: 12 },
    category: { id: 'c1', name: 'Ficción', slug: 'ficcion', description: '', icon: '', bookCount: 0 },
    description: 'Un crimen inevitable en un pueblo caribeño.',
    price: 19.99,
    formats: [{ type: 'paperback', price: 19.99, stock: 22 }],
    coverImage: '/placeholder-book.svg',
    images: [],
    isbn: '978-0-00-000000-7',
    publisher: 'Editorial Sudamericana',
    pages: 122,
    language: 'Español',
    publishDate: '1981-04-07',
    rating: 4.7,
    reviewCount: 1876,
    stock: 22,
    isBestseller: false,
    isNew: false,
    tags: ['novela corta', 'clásico'],
  },
  {
    id: '9',
    title: 'Norwegian Wood',
    slug: 'norwegian-wood',
    author: { id: 'a2', name: 'Haruki Murakami', slug: 'haruki-murakami', bio: '', bookCount: 15 },
    category: { id: 'c1', name: 'Ficción', slug: 'ficcion', description: '', icon: '', bookCount: 0 },
    description: 'Una historia de pérdida y madurez.',
    price: 24.99,
    formats: [{ type: 'paperback', price: 24.99, stock: 14 }],
    coverImage: '/placeholder-book.svg',
    images: [],
    isbn: '978-0-00-000000-8',
    publisher: 'Tusquets Editores',
    pages: 296,
    language: 'Español',
    publishDate: '1987-09-04',
    rating: 4.4,
    reviewCount: 987,
    stock: 14,
    isBestseller: false,
    isNew: false,
    tags: ['contemporáneo', 'japón'],
  },
]

export function RecommendedSection() {
  return (
    <section className="py-[var(--space-24)] bg-bg-muted">
      <div className="mx-auto max-w-[var(--container-max)] px-[var(--space-6)] md:px-[var(--space-10)] lg:px-[var(--space-16)]">
        <div className="flex items-end justify-between mb-[var(--space-8)]">
          <h2 className="text-2xl md:text-4xl font-display font-normal text-text-primary tracking-[var(--tracking-4xl)]">
            Recomendados para ti
          </h2>
          <Link
            href="/libros/recomendados"
            className="hidden sm:inline-flex text-sm font-semibold text-brand-primary hover:underline decoration-[1.5px] underline-offset-[3px]"
          >
            Ver más →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[var(--space-6)]">
          {MOCK_RECOMMENDED.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </div>
    </section>
  )
}
