# Contrato GraphQL del catálogo (SaaS externo)

Este es el **contrato de datos** que la tienda espera de tu SaaS para leer el
catálogo (libros, categorías, autores, reseñas) de forma "viva" sin tocar
Supabase. Es un **GraphQL schema** de referencia: tu backend debe exponer estos
tipos y queries. Los nombres de campo son los que la tienda envía en las
queries (`src/lib/integrations/catalog/queries.ts`).

Para activar el SaaS como fuente del catálogo:

```ini
CATALOG_PROVIDER=saas
CATALOG_API_URL=https://tu-saas.com/graphql
CATALOG_API_TOKEN=tu-token
```

> Nota: si tu esquema usa otros nombres de campo, edita
> `src/lib/integrations/catalog/mappers.ts` (y `queries.ts` si cambian los
> argumentos). Es el ÚNICO lugar que conoce el formato del SaaS.

---

## Types

```graphql
type Book {
  id: ID!
  title: String!
  slug: String!
  summary: String!
  isbn: String
  publisher: String
  pages: Int
  language: String!
  releaseDate: String            # ISO date
  dimensions: String
  basePriceUSD: Float!           # precio base en USD
  promoPriceUSD: Float             # precio promocional (si hay)
  rating: Float!
  ratingCount: Int!
  stock: Int!
  isBestseller: Boolean!
  isNew: Boolean!
  coverImage: String!
  galleryImages: [String!]!
  tags: [String!]!
  author: Author!
  category: Category!
  formats: [BookFormat!]!
}

type BookFormat {
  type: BookFormatType!          # emun
  priceUSD: Float!
  stock: Int!
}

enum BookFormatType {
  HARDCOVER
  PAPERBACK
  EBOOK
  AUDIOBOOK
}

type Category {
  id: ID!
  name: String!
  slug: String!
  description: String
  icon: String
  bookCount: Int!
}

type Author {
  id: ID!
  name: String!
  slug: String!
  bio: String
  photoUrl: String
  bookCount: Int!
}

type Review {
  id: ID!
  bookId: ID!
  userName: String!
  rating: Int!
  title: String
  content: String!
  createdAt: String!
}

type Catalog {
  title: String!
  description: String!
  books: [Book!]!
}

type BookParams {
  categoria: String!
  slug: String!
}
```

---

## Queries

```graphql
type Query {
  book(slug: String!): Book
  booksByIds(ids: [ID!]!): [Book!]!
  bestsellers(limit: Int): [Book!]!
  newReleases(limit: Int): [Book!]!
  relatedBooks(bookId: ID!, categoryId: ID!, limit: Int): [Book!]!
  booksByAuthor(authorSlug: String!): [Book!]!
  searchBooks(query: String!, limit: Int): [Book!]!
  catalog(slug: String!): Catalog
  catalogSlugs: [String!]!
  bookParams: [BookParams!]!
  categories: [Category!]!
  featuredAuthors(limit: Int): [Author!]!
  allAuthors: [Author!]!
  authorBySlug(slug: String!): Author
  reviewsByBook(bookId: ID!): [Review!]!
}
```

### Sobre `catalog(slug:)`

El slug puede referir a una **categoría** (ej: `ficcion`) o a una **colección
curada** (ej: `bestsellers`, `novedades`, `ofertas`, `otono`, `audiolibros`).
El SaaS decide tanto el `title`/`description` como los libros de cada uno,
reemplazando la lógica de `COLLECTIONS` que hoy vive en `src/lib/data/books.ts`.

---

## Conversión de precios

El SaaS devuelve precios en **USD** (`basePriceUSD`, `promoPriceUSD`). La tienda
los convierte a ARS usando `AR_USD_RATE` en `src/lib/integrations/catalog/mappers.ts`
(reutiliza `usdToArs` de `@/lib/format`). Para precios ya en ARS, se ajusta solo
en el mapper.

## Autenticación

Opcional: si definís `CATALOG_API_TOKEN`, cada request envía
`Authorization: Bearer <token>`.
