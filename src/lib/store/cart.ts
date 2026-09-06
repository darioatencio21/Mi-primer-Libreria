import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { Book, BookFormat, CartItem as CartItemType } from '@/lib/types'
import { usdToArs } from '@/lib/format'

export const FREE_SHIPPING_THRESHOLD = 50000
export const SHIPPING_FEE = usdToArs(5.99)
export const COUPON_DISCOUNT = 0.1
const VALID_COUPONS = ['NOVA10'] as const

interface CartState {
  items: CartItemType[]
  coupon: string | null
  addItem: (book: Book, format: BookFormat['type'], quantity?: number) => void
  updateQuantity: (bookId: string, quantity: number) => void
  removeItem: (bookId: string) => void
  setCoupon: (code: string) => boolean
  removeCoupon: () => void
  clearCart: () => void
}

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      coupon: null,
      addItem: (book, format, quantity = 1) => {
        set((state) => {
          const existing = state.items.find(
            (item) => item.book.id === book.id && item.format === format
          )
          if (existing) {
            return {
              items: state.items.map((item) =>
                item.book.id === book.id && item.format === format
                  ? { ...item, quantity: Math.min(10, item.quantity + quantity) }
                  : item
              ),
            }
          }
          return { items: [...state.items, { book, format, quantity }] }
        })
      },
      updateQuantity: (bookId, quantity) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.book.id === bookId ? { ...item, quantity: Math.max(1, quantity) } : item
          ),
        })),
      removeItem: (bookId) =>
        set((state) => ({
          items: state.items.filter((item) => item.book.id !== bookId),
        })),
      setCoupon: (code) => {
        const normalized = code.trim().toUpperCase()
        const valid = (VALID_COUPONS as readonly string[]).includes(normalized)
        if (valid) {
          set({ coupon: normalized })
        }
        return valid
      },
      removeCoupon: () => set({ coupon: null }),
      clearCart: () => set({ items: [], coupon: null }),
    }),
    {
      name: 'nova-cart',
      storage: createJSONStorage(() => localStorage),
    }
  )
)

export function selectItemCount(items: CartItemType[]): number {
  return items.reduce((sum, item) => sum + item.quantity, 0)
}

export function selectSubtotal(items: CartItemType[]): number {
  return items.reduce((sum, item) => {
    const price =
      item.book.formats.find((format) => format.type === item.format)?.price ??
      item.book.price
    return sum + price * item.quantity
  }, 0)
}

export function selectTotals(items: CartItemType[], coupon: string | null) {
  const subtotal = selectSubtotal(items)
  const discount = coupon ? subtotal * COUPON_DISCOUNT : 0
  const shipping = subtotal - discount >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE
  const total = subtotal - discount + shipping
  return { subtotal, discount, shipping, total }
}