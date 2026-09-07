# Contrato REST del catálogo — Camaleón SaaS

Este documento define **qué endpoints REST/JSON debe exponer Camaleón** para que
librosTuc sirva el catálogo de libros desde él. El adaptador que consume este
contrato es `src/lib/integrations/catalog/rest.ts` y el mapeo a los tipos de
dominio vive en `src/lib/integrations/catalog/mappers.ts` (**el único lugar**
que conoce este formato).

Camaleón es un POS argentino: **todos los precios vienen en pesos (ARS)**, listos
para mostrar, sin conversión. El tenant se resuelve por `businessId` del JWT
(`Authorization: Bearer <token>`) y opcionalmente `X-Tenant-Slug`.

---

## Configuración

```
CATALOG_API_URL         = base REST (sin barra final), ej: https://camaleon.example.com/api
CATALOG_API_TOKEN       = Bearer (JWT de negocio) — opcional
CATALOG_API_TENANT_SLUG = header X-Tenant-Slug — opcional
```

Todas las respuestas se devuelven como `application/json`. Ante errores se
espera un `4xx/5xx` con detalle en el body.

---

## Forma de un libro

```jsonc
{
  "id": "uuid-o-sku",
  "title": "Cien años de soledad",
  "slug": "cien-anos-de-soledad",
  "summary": "Descripción breve",
  "isbn": "978-3-16-148410-0",
  "publisher": "Sudamericana",
  "pages": 471,
  "language": "Español",
  "releaseDate": "2024-01-15",
  "dimensions": "14 x 21 cm",
  "basePriceARS": 34990,          // precio en pesos
  "promoPriceARS": 27990,         // opcional (precio oferta, en pesos)
  "rating": 4.8,
  "ratingCount": 124,
  "stock": 12,
  "isBestseller": true,
  "isNew": false,
  "coverImage": "https://...",
  "author": { "id": "a1", "name": "Gabriel García Márquez", "slug": "gabriel-garcia-marquez", "bio": "...", "photoUrl": "https://...", "bookCount": 5 },
  "category": { "id": "c1", "name": "Ficción", "slug": "ficcion", "description": "...", "icon": "book-open" },
  "formats": [
    { "type": "hardcover", "priceARS": 42990, "stock": 3 },   // hardcover | paperback | ebook | audiobook
    { "type": "ebook", "priceARS": 18000, "stock": 99 }
  ],
  "galleryImages": ["https://..."],
  "tags": ["novela", "realismo-magico"]
}
```

---

## Endpoints

Base: `{CATALOG_API_URL}` (todas las rutas bajo `/catalog`).

| Método + Ruta | Query | Respuesta |
|---|---|---|
| `GET /catalog/books/:slug` | — | `{ book: Libro \| null }` |
| `GET /catalog/bestsellers` | `limit` (default 8) | `{ books: Libro[] }` |
| `GET /catalog/new-releases` | `limit` (default 8) | `{ books: Libro[] }` |
| `GET /catalog/books/:id/related` | `categoryId`, `limit` | `{ books: Libro[] }` |
| `GET /catalog/authors/:slug/books` | — | `{ books: Libro[] }` |
| `GET /catalog/books` | `ids` (CSV, máx 100) | `{ books: Libro[] }` |
| `GET /catalog/search` | `q`, `limit` (default 24) | `{ books: Libro[] }` |
| `GET /catalog/:slug` | — | `{ catalog: { title, description, books: Libro[] } \| null }` |
| `GET /catalog/slugs` | — | `{ slugs: string[] }` |
| `GET /catalog/book-params` | — | `{ bookParams: [{ categoria, slug }] }` |
| `GET /catalog/categories` | — | `{ categories: Categoria[] }` |
| `GET /catalog/authors/featured` | `limit` (default 8) | `{ authors: Autor[] }` |
| `GET /catalog/authors` | — | `{ authors: Autor[] }` |
| `GET /catalog/authors/:slug` | — | `{ author: Autor \| null }` |
| `GET /catalog/books/:id/reviews` | — | `{ reviews: Resena[] }` |

Formas auxiliares:

```jsonc
// Categoría
{ "id": "c1", "name": "Ficción", "slug": "ficcion", "description": "...", "icon": "book-open", "bookCount": 42 }

// Autor
{ "id": "a1", "name": "Gabriel García Márquez", "slug": "gabriel-garcia-marquez", "bio": "...", "photoUrl": "https://...", "bookCount": 5 }

// Reseña
{ "id": "r1", "bookId": "b1", "userName": "Ana", "rating": 5, "title": "Imperdible", "content": "...", "createdAt": "2024-05-01T10:00:00Z" }
```

---

## Notas

- `bookParams` alimenta `generateStaticParams` de las rutas de libros; si
  Camaleón no lo expone, se puede servir vacío (las páginas se generarán on
  demand).
- `stock` se muestra pero **la venta real valida/reserva** stock contra el ERP
  (`InventoryProvider`, ver `docs/saas-integration.md`).
- Si Camaleón nombra campos distinto, ajustar solo `mappers.ts` / `rest.ts`,
  sin tocar el resto de la app.