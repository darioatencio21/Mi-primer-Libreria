import 'server-only'
import type { OrderStore } from '../ports'
import type { CreateOrderInput, CreateOrderResult } from '../types'
import { externalRequest } from '../http'

/**
 * Adaptador de pedidos hacia un ERP / backend SaaS EXTERNO que centraliza
 * los pedidos (emisión, seguimiento, facturación/logística).
 *
 * Contrato HTTP esperado:
 *
 *   POST {baseUrl}/api/v1/orders
 *   body: {
 *     userId, email,
 *     lines: [{ bookId, title, format, quantity, price }],
 *     subtotal, shipping, tax, total,
 *     shippingAddress,
 *     shippingMethodId?
 *   }
 *   resp: { orderId: string, orderNumber: string, references?: Record<string,string> }
 */
export class ErpOrderStore implements OrderStore {
  readonly id = 'erp'
  private readonly baseUrl: string

  constructor(baseUrl?: string) {
    if (!baseUrl) {
      throw new Error('ErpOrderStore necesita ERP_API_URL (y ERP_API_TOKEN si aplica)')
    }
    this.baseUrl = baseUrl.replace(/\/+$/, '')
  }

  async createOrder(input: CreateOrderInput): Promise<CreateOrderResult> {
    const token = process.env.ERP_API_TOKEN

    return externalRequest<CreateOrderResult>('/api/v1/orders', {
      baseUrl: this.baseUrl,
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: input,
    })
  }
}
