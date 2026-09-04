import type {
  CreateOrderInput,
  CreateOrderResult,
  InventoryReservation,
  PaymentRequest,
  PaymentResult,
} from './types'

export type { CatalogProvider } from './catalog/ports'

/**
 * PUERTOS (puertos de una arquitectura hexagonal).
 *
 * Estos contratos definen QUÉ necesita el negocio, sin importar CÓMO lo
 * provea cada adaptador. El código de checkout/orquestación depende de estas
 * interfaces y NO de implementaciones concretas. Así podés en el futuro
 * conectar un SaaS externo (pasarela de pagos, ERP/logística) escribiendo un
 * nuevo adaptador y cambiando la config de entorno, sin tocar el resto.
 */

/**
 * Procesa el cobro de un pedido.
 * Adaptadores: manual (simulado), pasarela externa (SaaS de pagos).
 */
export interface PaymentProvider {
  readonly id: string
  charge(req: PaymentRequest): Promise<PaymentResult>
}

/**
 * Consulta y reserva stock / inventario.
 * Adaptadores: postgres (local), ERP externo (SaaS de inventario/logística).
 */
export interface InventoryProvider {
  readonly id: string
  /**
   * Reserva stock de forma atómica para las líneas del pedido.
   * Debe fallar (success=false) si hay algún faltante, indicando cuál.
   * Devuelve un `reservationRef` para poder liberarla si luego falla el pago.
   */
  reserve(lines: { bookId: string; quantity: number }[]): Promise<InventoryReservation>
  /** Libera/revierte una reserva previa identificada por `reservationRef`. */
  release(reservationRef: string): Promise<void>
}

/**
 * Persiste y expone pedidos.
 * Adaptadores: postgres (local), ERP externo (SaaS que centraliza pedidos).
 */
export interface OrderStore {
  readonly id: string
  createOrder(input: CreateOrderInput): Promise<CreateOrderResult>
}
