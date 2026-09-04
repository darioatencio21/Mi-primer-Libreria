import type { PaymentProvider } from '../ports'
import type { PaymentRequest, PaymentResult } from '../types'

/**
 * Adaptador de pago por defecto / demo. NO cobra de verdad: simula una
 * aprobación, replicando el comportamiento actual del checkout (que solo
 * limpiaba el carrito). Sirve para que la tienda funcione end-to-end sin
 * pasarela real, y como referencia para escribir el adaptador real.
 */
export class ManualPaymentProvider implements PaymentProvider {
  readonly id = 'manual'

  async charge(req: PaymentRequest): Promise<PaymentResult> {
    console.info(
      `[payment:manual] Pedido ${req.orderNumber} — ${req.amount} ${req.currency} ` +
        `(${req.method}). Pago simulado, sin cobro real.`
    )
    return {
      status: 'approved',
      // Sin pasarela real no hay transacción; generamos un id local para trazabilidad.
      transactionId: `manual-${req.orderNumber}`,
      message: 'Pago simulado aprobado (sin cobro real).',
    }
  }
}
