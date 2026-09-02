'use client'

import { CartDrawer } from '@/components/cart/CartDrawer'
import { useUi } from '@/lib/store/ui'

export function CartProvider() {
  const isOpen = useUi((state) => state.isCartOpen)
  const closeCart = useUi((state) => state.closeCart)

  return <CartDrawer isOpen={isOpen} onClose={closeCart} />
}