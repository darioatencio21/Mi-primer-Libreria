import { create } from 'zustand'

interface UiState {
  isCartOpen: boolean
  openCart: () => void
  closeCart: () => void
}

export const useUi = create<UiState>((set) => ({
  isCartOpen: false,
  openCart: () => set({ isCartOpen: true }),
  closeCart: () => set({ isCartOpen: false }),
}))