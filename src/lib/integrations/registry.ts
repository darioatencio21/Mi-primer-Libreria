import 'server-only'
import type { CatalogProvider, InventoryProvider, OrderStore, PaymentProvider } from './ports'
import { ManualPaymentProvider } from './payments/manual'
import { MerchantPaymentProvider } from './payments/merchant'
import { PostgresInventoryProvider } from './inventory/postgres'
import { ErpInventoryProvider } from './inventory/erp'
import { PostgresOrderStore } from './orders/postgres'
import { ErpOrderStore } from './orders/erp'
import { PostgresCatalogProvider } from './catalog/postgres'
import { SaaSCatalogProvider } from './catalog/saas'

/**
 * REGISTRO DE ADAPTADORES (factory).
 *
 * Decide qué implementación de cada puerto está activa según variables de
 * entorno. Así podés activar el SaaS externo sin cambiar código:
 *
 *   CATALOG_PROVIDER   = 'postgres' | 'saas'
 *   ORDERS_PROVIDER    = 'postgres' | 'erp'
 *   INVENTORY_PROVIDER = 'postgres' | 'erp'
 *   PAYMENT_PROVIDER   = 'manual'   | 'merchant'
 *   CATALOG_API_URL    = endpoint GraphQL del SaaS (libros/catálogo)
 *   ERP_API_URL        = base del SaaS de ustedes (ERP/logística/pedidos)
 *   MERCHANT_API_URL   = base de la pasarela de pagos
 *
 * Cuando el SaaS esté listo, se define el/los provider correspondiente y toda
 * la tienda/orquestación pasa a hablar con el servicio externo.
 */

function enabled(name: string, fallback: string): string {
  return process.env[name] || fallback
}

export function getCatalogProvider(): CatalogProvider {
  switch (enabled('CATALOG_PROVIDER', 'postgres')) {
    case 'saas':
      return new SaaSCatalogProvider(process.env.CATALOG_API_URL)
    case 'postgres':
    default:
      return new PostgresCatalogProvider()
  }
}

export function getPaymentProvider(): PaymentProvider {
  switch (enabled('PAYMENT_PROVIDER', 'manual')) {
    case 'merchant':
      return new MerchantPaymentProvider(process.env.MERCHANT_API_URL)
    case 'manual':
    default:
      return new ManualPaymentProvider()
  }
}

export function getInventoryProvider(): InventoryProvider {
  switch (enabled('INVENTORY_PROVIDER', 'postgres')) {
    case 'erp':
      return new ErpInventoryProvider(process.env.ERP_API_URL)
    case 'postgres':
    default:
      return new PostgresInventoryProvider()
  }
}

export function getOrderStore(): OrderStore {
  switch (enabled('ORDERS_PROVIDER', 'postgres')) {
    case 'erp':
      return new ErpOrderStore(process.env.ERP_API_URL)
    case 'postgres':
    default:
      return new PostgresOrderStore()
  }
}

export function getActiveProviders() {
  return {
    catalog: { provider: enabled('CATALOG_PROVIDER', 'postgres') },
    payment: { provider: enabled('PAYMENT_PROVIDER', 'manual') },
    inventory: { provider: enabled('INVENTORY_PROVIDER', 'postgres') },
    orders: { provider: enabled('ORDERS_PROVIDER', 'postgres') },
  }
}