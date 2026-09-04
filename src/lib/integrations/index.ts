/**
 * Integraciones externas (puertos + adaptadores).
 *
 * Ver docs/saas-integration.md para el plan completo de conexión a un SaaS
 * externo (pasarela de pagos + ERP/inventario/logística).
 */
export {
  getActiveProviders,
  getCatalogProvider,
  getInventoryProvider,
  getOrderStore,
  getPaymentProvider,
} from './registry'

export { placeOrder } from './actions/place-order'

export type {
  CreateOrderInput,
  CreateOrderResult,
  InventoryReservation,
  OrderLine,
  PaymentRequest,
  PaymentResult,
  PaymentStatus,
  ProviderConfig,
} from './types'

export type {
  CatalogProvider,
  InventoryProvider,
  OrderStore,
  PaymentProvider,
} from './ports'
