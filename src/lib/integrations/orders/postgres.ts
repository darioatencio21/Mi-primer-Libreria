import 'server-only'
import { db } from '@/lib/db/client'
import { orderItems, orders } from '@/lib/db/schema'
import type { OrderStore } from '../ports'
import type { CreateOrderInput, CreateOrderResult } from '../types'

/**
 * Adaptador de pedidos LOCAL: persiste en Postgres (`orders` + `order_items`).
 * Es la implementación por defecto mientras no exista el ERP externo.
 */
export class PostgresOrderStore implements OrderStore {
  readonly id = 'postgres'

  async createOrder(input: CreateOrderInput): Promise<CreateOrderResult> {
    const orderNumber = generateOrderNumber()

    const [order] = await db
      .insert(orders)
      .values({
        userId: input.userId,
        subtotal: input.subtotal,
        shipping: input.shipping,
        tax: input.tax,
        total: input.total,
        status: 'pending',
        shippingAddress: input.shippingAddress,
      })
      .returning({ id: orders.id })

    if (!order) throw new Error('No se pudo crear el pedido')

    if (input.lines.length > 0) {
      await db.insert(orderItems).values(
        input.lines.map((line) => ({
          orderId: order.id,
          bookId: line.bookId,
          title: line.title,
          format: line.format,
          quantity: line.quantity,
          price: line.price,
        }))
      )
    }

    return { orderId: order.id, orderNumber }
  }
}

export function generateOrderNumber(): string {
  const n = Math.floor(Math.random() * 90000 + 10000)
  return `NB-${n}`
}