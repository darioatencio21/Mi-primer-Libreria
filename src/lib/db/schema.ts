import {
  boolean,
  date,
  index,
  integer,
  jsonb,
  numeric,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core'
import { sql } from 'drizzle-orm'

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  fullName: text('full_name'),
  phone: text('phone'),
  defaultAddress: jsonb('default_address'),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' }).notNull().defaultNow(),
})

export const sessions = pgTable(
  'sessions',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    tokenHash: text('token_hash').notNull().unique(),
    expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'string' }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).notNull().defaultNow(),
  },
  (t) => [
    index('sessions_user_id_idx').on(t.userId),
    uniqueIndex('sessions_token_hash_idx').on(t.tokenHash),
  ]
)

export const authors = pgTable('authors', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  bio: text('bio').notNull().default(''),
  photoUrl: text('photo_url'),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' }).notNull().defaultNow(),
})

export const categories = pgTable('categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description').notNull().default(''),
  icon: text('icon').notNull().default(''),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' }).notNull().defaultNow(),
})

export const books = pgTable(
  'books',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    title: text('title').notNull(),
    slug: text('slug').notNull().unique(),
    description: text('description').notNull().default(''),
    isbn: text('isbn').notNull().unique(),
    publisher: text('publisher'),
    pages: integer('pages'),
    language: text('language').notNull().default('Español'),
    publishDate: date('publish_date', { mode: 'string' }),
    dimensions: text('dimensions'),
    price: numeric('price', { precision: 10, scale: 2, mode: 'number' }).notNull(),
    discountPrice: numeric('discount_price', { precision: 10, scale: 2, mode: 'number' }),
    discountPercentage: integer('discount_percentage'),
    rating: numeric('rating', { precision: 3, scale: 2, mode: 'number' }).notNull().default(0),
    reviewCount: integer('review_count').notNull().default(0),
    stock: integer('stock').notNull().default(0),
    isBestseller: boolean('is_bestseller').notNull().default(false),
    isNew: boolean('is_new').notNull().default(false),
    coverImageUrl: text('cover_image_url').notNull(),
    authorId: uuid('author_id')
      .notNull()
      .references(() => authors.id),
    categoryId: uuid('category_id')
      .notNull()
      .references(() => categories.id),
    searchVector: text('search_vector'),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' }).notNull().defaultNow(),
  },
  (t) => [
    index('books_author_id_idx').on(t.authorId),
    index('books_category_id_idx').on(t.categoryId),
    index('books_title_trgm_idx').using('gin', sql`${t.title} gin_trgm_ops`),
    index('books_publisher_trgm_idx').using('gin', sql`${t.publisher} gin_trgm_ops`),
    index('books_isbn_trgm_idx').using('gin', sql`${t.isbn} gin_trgm_ops`),
  ]
)

export const bookFormats = pgTable(
  'book_formats',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    bookId: uuid('book_id')
      .notNull()
      .references(() => books.id, { onDelete: 'cascade' }),
    type: text('type', { enum: ['hardcover', 'paperback', 'ebook', 'audiobook'] }).notNull(),
    price: numeric('price', { precision: 10, scale: 2, mode: 'number' }).notNull(),
    stock: integer('stock').notNull().default(0),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' }).notNull().defaultNow(),
  },
  (t) => [
    index('book_formats_book_id_idx').on(t.bookId),
    uniqueIndex('book_formats_book_id_type_unique').on(t.bookId, t.type),
  ]
)

export const bookImages = pgTable(
  'book_images',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    bookId: uuid('book_id')
      .notNull()
      .references(() => books.id, { onDelete: 'cascade' }),
    url: text('url').notNull(),
    position: integer('position').notNull().default(0),
  },
  (t) => [index('book_images_book_id_idx').on(t.bookId)]
)

export const bookTags = pgTable(
  'book_tags',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    bookId: uuid('book_id')
      .notNull()
      .references(() => books.id, { onDelete: 'cascade' }),
    tag: text('tag').notNull(),
  },
  (t) => [index('book_tags_book_id_idx').on(t.bookId), uniqueIndex('book_tags_book_id_tag_unique').on(t.bookId, t.tag)]
)

export const settings = pgTable('settings', {
  key: text('key').primaryKey(),
  value: jsonb('value').notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' }).notNull().defaultNow(),
})

export const profiles = pgTable('profiles', {
  id: uuid('id')
    .primaryKey()
    .references(() => users.id, { onDelete: 'cascade' }),
  fullName: text('full_name'),
  phone: text('phone'),
  defaultAddress: jsonb('default_address'),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' }).notNull().defaultNow(),
})

export const reviews = pgTable(
  'reviews',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    bookId: uuid('book_id').references(() => books.id, { onDelete: 'set null' }),
    userId: uuid('user_id'),
    userName: text('user_name').notNull(),
    rating: integer('rating').notNull(),
    title: text('title'),
    content: text('content').notNull().default(''),
    helpfulCount: integer('helpful_count').notNull().default(0),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' }).notNull().defaultNow(),
  },
  (t) => [index('reviews_book_id_idx').on(t.bookId)]
)

export const cartItems = pgTable(
  'cart_items',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    bookId: uuid('book_id')
      .notNull()
      .references(() => books.id, { onDelete: 'cascade' }),
    format: text('format', { enum: ['hardcover', 'paperback', 'ebook', 'audiobook'] }).notNull(),
    quantity: integer('quantity').notNull().default(1),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' }).notNull().defaultNow(),
  },
  (t) => [
    index('cart_items_user_id_idx').on(t.userId),
    uniqueIndex('cart_items_user_book_format_unique').on(t.userId, t.bookId, t.format),
  ]
)

export const wishlistItems = pgTable(
  'wishlist_items',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    bookId: uuid('book_id')
      .notNull()
      .references(() => books.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).notNull().defaultNow(),
  },
  (t) => [
    index('wishlist_items_user_id_idx').on(t.userId),
    uniqueIndex('wishlist_items_user_book_unique').on(t.userId, t.bookId),
  ]
)

export const orders = pgTable(
  'orders',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    status: text('status', {
      enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    })
      .notNull()
      .default('pending'),
    subtotal: numeric('subtotal', { precision: 10, scale: 2, mode: 'number' }).notNull().default(0),
    shipping: numeric('shipping', { precision: 10, scale: 2, mode: 'number' }).notNull().default(0),
    tax: numeric('tax', { precision: 10, scale: 2, mode: 'number' }).notNull().default(0),
    total: numeric('total', { precision: 10, scale: 2, mode: 'number' }).notNull().default(0),
    shippingAddress: jsonb('shipping_address').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' }).notNull().defaultNow(),
  },
  (t) => [index('orders_user_id_idx').on(t.userId)]
)

export const orderItems = pgTable(
  'order_items',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    orderId: uuid('order_id')
      .notNull()
      .references(() => orders.id, { onDelete: 'cascade' }),
    bookId: uuid('book_id').references(() => books.id, { onDelete: 'set null' }),
    title: text('title').notNull(),
    format: text('format'),
    quantity: integer('quantity').notNull(),
    price: numeric('price', { precision: 10, scale: 2, mode: 'number' }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).notNull().defaultNow(),
  },
  (t) => [index('order_items_order_id_idx').on(t.orderId)]
)