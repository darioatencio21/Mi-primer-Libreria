import type { Book, BookFormat } from '@/lib/types'

/**
 * Formato por defecto de un libro: paperback si existe (como en la página de
 * producto), si no el primero disponible.
 */
export function getDefaultFormatType(book: Book): BookFormat['type'] | undefined {
  if (book.formats.some((f) => f.type === 'paperback')) return 'paperback'
  return book.formats[0]?.type
}

/** El descuento aplica solo al formato por defecto (paperback). */
export function hasBookDiscount(book: Book): boolean {
  return book.discountPrice != null && getDefaultFormatType(book) === 'paperback'
}

/**
 * Precio de exhibición de un libro: match con `ProductBuyBox`.
 * Si el formato por defecto es paperback y hay descuento, el descuento.
 * Si no, el precio del formato por defecto (o `price` como respaldo).
 */
export function getBookDisplayPrice(book: Book): number {
  if (hasBookDiscount(book)) return book.discountPrice!
  const format = book.formats.find((f) => f.type === getDefaultFormatType(book))
  return format?.price ?? book.price
}