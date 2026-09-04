import type { Address, BookFormat } from '@/lib/types'

/**
 * Datos mínimos necesarios para colocar un pedido a través de los puertos
 * de integración. Son agnósticos del proveedor (local o SaaS externo).
 */
export interface OrderLine {
  /** ID interno del libro en nuestra base (uuid de `libros`). */
  bookId: string
  title: string
  format: BookFormat['type']
  quantity: number
  /** Precio unitario en ARS. */
  price: number
}

export interface CreateOrderInput {
  /** ID del usuario autenticado (uuid de `profiles`). */
  userId: string
  /** Email del comprador, útil para notificaciones/externos. */
  email?: string
  lines: OrderLine[]
  subtotal: number
  shipping: number
  tax: number
  total: number
  shippingAddress: Address
  shippingMethodId?: string
}

export interface CreateOrderResult {
  /** ID del pedido en nuestro almacenamiento (uuid de `pedidos`). */
  orderId: string
  /** Número público/legible del pedido (ej: NB-12345). */
  orderNumber: string
  /** Referencias devueltas por proveedores externos (ej: id de pago o ERP). */
  references?: Record<string, string>
}

export type PaymentStatus =
  | 'approved'
  | 'pending'
  | 'rejected'
  | 'error'

export interface PaymentRequest {
  amount: number
  currency: 'ARS' | 'USD'
  method: 'card' | 'paypal' | 'transfer'
  /** Datos crudos del cliente capturados en el formulario (card, etc.). */
  raw?: Record<string, unknown>
  orderNumber: string
  email?: string
}

export interface PaymentResult {
  status: PaymentStatus
  /** ID de transacción del proveedor de pagos. */
  transactionId?: string
  message?: string
}

export type OrderStatus =
  | 'pending'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'

export interface InventoryReservation {
  /** Resultado por línea para reportar faltantes con claridad. */
  lines: { bookId: string; available: boolean; requested: number; remaining: number }[]
  success: boolean
  /** Referencia opcional para liberar/revertir la reserva (rollback). */
  reservationRef?: string
  /** Detalle por línea cuando algo sale mal. */
  errors?: string[]
}

export interface ProviderConfig {
  payment: { provider: string; baseUrl?: string }
  inventory: { provider: string; baseUrl?: string }
  orders: { provider: string; baseUrl?: string }
}
