import 'server-only'

/**
 * Queries GraphQL que la tienda le hace al SaaS externo.
 * Reflejan el contrato documentado en docs/saas-catalog-graphql.md
 */

export const BOOK_FRAGMENT = `
  fragment BookFields on Book {
    id
    title
    slug
    summary
    isbn
    publisher
    pages
    language
    releaseDate
    dimensions
    basePriceUSD
    promoPriceUSD
    rating
    ratingCount
    stock
    isBestseller
    isNew
    coverImage
    galleryImages
    tags
    author { id name slug bio photoUrl bookCount }
    category { id name slug description icon }
    formats { type priceUSD stock }
  }
`

export const GET_BOOK_BY_SLUG = `
  query BookBySlug($slug: String!) {
    book(slug: $slug) { ...BookFields }
  }
  ${BOOK_FRAGMENT}
`

export const GET_BOOKS_BY_IDS = `
  query BooksByIds($ids: [ID!]!) {
    booksByIds(ids: $ids) { ...BookFields }
  }
  ${BOOK_FRAGMENT}
`

export const GET_BESTSELLERS = `
  query Bestsellers($limit: Int) {
    bestsellers(limit: $limit) { ...BookFields }
  }
  ${BOOK_FRAGMENT}
`

export const GET_NEW_RELEASES = `
  query NewReleases($limit: Int) {
    newReleases(limit: $limit) { ...BookFields }
  }
  ${BOOK_FRAGMENT}
`

export const GET_CATALOG = `
  query Catalog($slug: String!) {
    catalog(slug: $slug) { title description books { ...BookFields } }
  }
  ${BOOK_FRAGMENT}
`

export const GET_CATALOG_SLUGS = `
  query CatalogSlugs {
    catalogSlugs
  }
`

export const GET_BOOK_PARAMS = `
  query BookParams {
    bookParams { categoria slug }
  }
`

export const SEARCH_BOOKS = `
  query Search($query: String!, $limit: Int) {
    searchBooks(query: $query, limit: $limit) { ...BookFields }
  }
  ${BOOK_FRAGMENT}
`

export const GET_RELATED = `
  query Related($bookId: ID!, $categoryId: ID!, $limit: Int) {
    relatedBooks(bookId: $bookId, categoryId: $categoryId, limit: $limit) { ...BookFields }
  }
  ${BOOK_FRAGMENT}
`

export const GET_BOOKS_BY_AUTHOR = `
  query BooksByAuthor($authorSlug: String!) {
    booksByAuthor(authorSlug: $authorSlug) { ...BookFields }
  }
  ${BOOK_FRAGMENT}
`

export const GET_CATEGORIES = `
  query Categories {
    categories { id name slug description icon bookCount }
  }
`

export const GET_FEATURED_AUTHORS = `
  query FeaturedAuthors($limit: Int) {
    featuredAuthors(limit: $limit) { id name slug bio photoUrl bookCount }
  }
`

export const GET_ALL_AUTHORS = `
  query AllAuthors {
    allAuthors { id name slug bio photoUrl bookCount }
  }
`

export const GET_AUTHOR_BY_SLUG = `
  query AuthorBySlug($slug: String!) {
    authorBySlug(slug: $slug) { id name slug bio photoUrl bookCount }
  }
`

export const GET_REVIEWS_BY_BOOK = `
  query ReviewsByBook($bookId: ID!) {
    reviewsByBook(bookId: $bookId) {
      id bookId userName rating title content createdAt
    }
  }
`
