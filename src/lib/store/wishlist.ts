import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface WishlistState {
  ids: string[]
  toggle: (bookId: string) => void
  isWishlisted: (bookId: string) => boolean
  clear: () => void
}

export const useWishlist = create<WishlistState>()(
  persist(
    (set, get) => ({
      ids: [],
      toggle: (bookId) =>
        set((state) => ({
          ids: state.ids.includes(bookId)
            ? state.ids.filter((id) => id !== bookId)
            : [...state.ids, bookId],
        })),
      isWishlisted: (bookId) => get().ids.includes(bookId),
      clear: () => set({ ids: [] }),
    }),
    {
      name: 'nova-wishlist',
      storage: createJSONStorage(() => localStorage),
    }
  )
)