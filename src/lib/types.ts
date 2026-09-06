export interface Book {
  id: string
  title: string
  slug: string
  author: Author
  category: Category
  description: string
  price: number
  discountPrice?: number
  discountPercentage?: number
  formats: BookFormat[]
  coverImage: string
  images: string[]
  isbn: string
  publisher: string
  pages: number
  language: string
  publishDate: string
  dimensions?: string
  rating: number
  reviewCount: number
  stock: number
  isBestseller: boolean
  isNew: boolean
  tags: string[]
}

export interface Author {
  id: string
  name: string
  slug: string
  bio: string
  photo?: string
  bookCount: number
}

export interface Category {
  id: string
  name: string
  slug: string
  description: string
  icon: string
  bookCount: number
}

export interface BookFormat {
  type: 'hardcover' | 'paperback' | 'ebook' | 'audiobook'
  price: number
  stock: number
}

export interface Review {
  id: string
  bookId: string
  userId: string
  userName: string
  userAvatar?: string
  rating: number
  title: string
  content: string
  createdAt: string
  helpfulCount: number
}

export interface ReviewPreview {
  content: string
  userName: string
  rating: number
  bookTitle?: string
}

export interface CartItem {
  book: Book
  format: BookFormat['type']
  quantity: number
}

export interface Order {
  id: string
  userId: string
  items: OrderItem[]
  subtotal: number
  shipping: number
  tax: number
  total: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  shippingAddress: Address
  createdAt: string
}

export interface OrderItem {
  bookId: string
  title: string
  format: BookFormat['type']
  quantity: number
  price: number
}

export interface Address {
  fullName: string
  street: string
  city: string
  postalCode: string
  country: string
  phone: string
}

export interface SearchFilters {
  query?: string
  category?: string
  author?: string
  publisher?: string
  language?: string[]
  format?: BookFormat['type'][]
  priceMin?: number
  priceMax?: number
  inStockOnly?: boolean
  sortBy?: 'relevance' | 'price_asc' | 'price_desc' | 'rating' | 'newest'
}
