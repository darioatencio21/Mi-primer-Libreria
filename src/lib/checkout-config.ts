export interface ShippingMethodConfig {
  id: string
  label: string
  time: string
  price: number
}

export interface PaymentMethodConfig {
  id: string
  label: string
  icon: string
  enabled: boolean
}

export interface CheckoutConfig {
  shippingMethods: ShippingMethodConfig[]
  paymentMethods: PaymentMethodConfig[]
  freeShippingThreshold: number
}

export const DEFAULT_CHECKOUT_CONFIG: CheckoutConfig = {
  shippingMethods: [
    { id: 'standard', label: 'Envío estándar', time: '3-5 días hábiles', price: 5.99 },
    { id: 'express', label: 'Envío express', time: '24-48h', price: 12.99 },
    { id: 'pickup', label: 'Retiro en tienda', time: 'Disponible hoy', price: 0 },
  ],
  paymentMethods: [
    { id: 'card', label: 'Tarjeta de crédito/débito', icon: '💳', enabled: true },
    { id: 'paypal', label: 'PayPal', icon: '🅿️', enabled: true },
    { id: 'transfer', label: 'Transferencia bancaria', icon: '🏦', enabled: true },
  ],
  freeShippingThreshold: 50000,
}

export const CHECKOUT_SETTINGS_KEY = 'checkout'

export function normalizeCheckoutConfig(value: unknown): CheckoutConfig {
  const raw = (value ?? {}) as Partial<CheckoutConfig>
  const shipping = Array.isArray(raw.shippingMethods)
    ? (raw.shippingMethods as ShippingMethodConfig[])
        .filter((m) => m && typeof m.id === 'string')
        .map((m) => ({
          id: String(m.id),
          label: String(m.label ?? m.id),
          time: String(m.time ?? ''),
          price: Number(m.price) || 0,
        }))
    : DEFAULT_CHECKOUT_CONFIG.shippingMethods

  const payment = Array.isArray(raw.paymentMethods)
    ? (raw.paymentMethods as PaymentMethodConfig[])
        .filter((m) => m && typeof m.id === 'string')
        .map((m) => ({
          id: String(m.id),
          label: String(m.label ?? m.id),
          icon: String(m.icon ?? '🛒'),
          enabled: m.enabled !== false,
        }))
    : DEFAULT_CHECKOUT_CONFIG.paymentMethods

  return {
    shippingMethods: shipping,
    paymentMethods: payment,
    freeShippingThreshold:
      typeof raw.freeShippingThreshold === 'number' && raw.freeShippingThreshold >= 0
        ? raw.freeShippingThreshold
        : DEFAULT_CHECKOUT_CONFIG.freeShippingThreshold,
  }
}