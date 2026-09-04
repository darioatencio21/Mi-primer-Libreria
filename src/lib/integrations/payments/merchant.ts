import 'server-only'
import type { PaymentProvider } from '../ports'
import type { PaymentRequest, PaymentResult } from '../types'
import { externalRequest } from '../http'

/**
 * Adaptador de pago hacia una pasarela SaaS externa de pagos.
 *
 * La URL base se lee en runtime desde MERCHANT_API_URL. El contrato HTTP
 * esperado por nuestro SaaS es:
 *
 *   POST {baseUrl}/api/v1/payments
 *   body: {
 *     amount: number
 *     currency: 'ARS' | 'USD'
 *     method: 'card' | 'paypal' | 'transfer'
 *     orderNumber: string
 *     email?: string
 *     customer?: Record<string, unknown>   // datos crudos de tarjeta, etc.
 *   }
 *   resp: { status: 'approved'|'pending'|'rejected', transactionId: string, message?: string }
 */
export class MerchantPaymentProvider implements PaymentProvider {
  readonly id = 'merchant'
  private readonly baseUrl: string

  constructor(baseUrl?: string) {
    if (!baseUrl) {
      throw new Error(
        'MerchantPaymentProvider necesita MERCHANT_API_URL (y MERCHANT_API_TOKEN si aplica)'
      )
    }
    this.baseUrl = baseUrl.replace(/\/+$/, '')
  }

  async charge(req: PaymentRequest): Promise<PaymentResult> {
    const token = process.env.MERCHANT_API_TOKEN

    const result = await externalRequest<{
      status: 'approved' | 'pending' | 'rejected'
      transactionId: string
      message?: string
    }>('/api/v1/payments', {
      baseUrl: this.baseUrl,
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: {
        amount: req.amount,
        currency: req.currency,
        method: req.method,
        orderNumber: req.orderNumber,
        email: req.email,
        customer: req.raw,
      },
    })

    return {
      status: result.status,
      transactionId: result.transactionId,
      message: result.message,
    }
  }
}
