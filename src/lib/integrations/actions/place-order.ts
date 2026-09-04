'use server'

import { revalidatePath } from 'next/cache'
import {
  getInventoryProvider,
  getOrderStore,
  getPaymentProvider,
} from '../registry'
import type { CreateOrderInput } from '../types'

export interface PlaceOrderResult {
  ok: boolean
  orderId?: string
  orderNumber?: string
  references?: Record<string, string>
  message?: string
  /** Líneas sin stock, para poder mostrarlas en el checkout. */
  outOfStock?: { bookId: string; requested: number; remaining: number }[]
}

/**
 * Orquesta un pedido de extremo a extremo a través de los PUERTOS de
 * integración, en este orden seguro:
 *
 *   1. Cobrar (pagador)
 *   2. Reservar stock (inventario)
 *   3. Crear el pedido (pedidos/ERP)
 *   4. Si algo falla después de un paso, revertir lo ya hecho.
 *
 * El código NO conoce el proveedor concreto: depende de las interfaces y de
 * la config de entorno (registry.ts). Al activar el SaaS externo, este mismo
 * flujo hablará con el servicio remoto sin que haya que tocarlo.
 */
export async function placeOrder(input: CreateOrderInput): Promise<PlaceOrderResult> {
  const payment = getPaymentProvider()
  const inventory = getInventoryProvider()
  const orders = getOrderStore()

  // ---- 1. Cobro ----
  const charge = await payment.charge({
    amount: input.total,
    currency: 'ARS',
    method: 'card',
    orderNumber: `pending-${Date.now()}`,
    email: input.email,
  })

  if (charge.status !== 'approved') {
    return {
      ok: false,
      message: charge.message ?? 'No se pudo procesar el pago.',
    }
  }

  // ---- 2. Reservar stock ----
  const reservation = await inventory.reserve(
    input.lines.map((l) => ({ bookId: l.bookId, quantity: l.quantity }))
  )

  if (!reservation.success) {
    if (reservation.reservationRef) {
      await inventory.release(reservation.reservationRef).catch(() => {})
    }
    return {
      ok: false,
      message: 'No hay stock suficiente para algunos títulos.',
      outOfStock: reservation.lines
        .filter((l) => !l.available)
        .map((l) => ({ bookId: l.bookId, requested: l.requested, remaining: l.remaining })),
    }
  }

  // ---- 3. Crear pedido ----
  try {
    const order = await orders.createOrder(input)
    revalidatePath('/admin/pedidos')
    return {
      ok: true,
      orderId: order.orderId,
      orderNumber: order.orderNumber,
      references: order.references,
    }
  } catch (err) {
    // Revertimos la reserva que sí se confirmó.
    if (reservation.reservationRef) {
      await inventory.release(reservation.reservationRef).catch(() => {})
    }
    return {
      ok: false,
      message: err instanceof Error ? err.message : 'No se pudo confirmar el pedido.',
    }
  }
}
