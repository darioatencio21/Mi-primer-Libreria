import 'server-only'
import type { InventoryProvider } from '../ports'
import type { InventoryReservation } from '../types'
import { externalRequest } from '../http'

/**
 * Adaptador de inventario hacia un ERP / sistema de logística SaaS EXTERNO
 * (el que desarrollaron ustedes). Delega la consulta/reserva de stock al
 * servicio remoto en lugar de a Supabase.
 *
 * Contrato HTTP esperado:
 *
 *   POST {baseUrl}/api/v1/inventory/reserve
 *   body: { lines: [{ bookId: string, quantity: number }] }
 *   resp: {
 *     success: boolean
 *     reservationRef?: string
 *     lines: [{ bookId, available, requested, remaining }]
 *     errors?: string[]
 *   }
 *
 *   POST {baseUrl}/api/v1/inventory/release
 *   body: { reservationRef: string }
 */
export class ErpInventoryProvider implements InventoryProvider {
  readonly id = 'erp'
  private readonly baseUrl: string

  constructor(baseUrl?: string) {
    if (!baseUrl) {
      throw new Error('ErpInventoryProvider necesita ERP_API_URL (y ERP_API_TOKEN si aplica)')
    }
    this.baseUrl = baseUrl.replace(/\/+$/, '')
  }

  async reserve(lines: { bookId: string; quantity: number }[]): Promise<InventoryReservation> {
    const token = process.env.ERP_API_TOKEN

    return externalRequest<InventoryReservation>('/api/v1/inventory/reserve', {
      baseUrl: this.baseUrl,
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: { lines },
    })
  }

  async release(reservationRef: string): Promise<void> {
    const token = process.env.ERP_API_TOKEN
    await externalRequest('/api/v1/inventory/release', {
      baseUrl: this.baseUrl,
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: { reservationRef },
    })
  }
}
