'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Check, CreditCard, Truck, Lock, ChevronRight, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useCart, selectSubtotal } from '@/lib/store'
import { cn } from '@/lib/utils'
import { sanitizeInput } from '@/lib/sanitize'
import { formatArs, usdToArs } from '@/lib/format'
import type { CartItem as CartItemType, BookFormat } from '@/lib/types'

type Step = 'shipping' | 'payment' | 'confirmation'

const FORMAT_LABELS: Record<BookFormat['type'], string> = {
  hardcover: 'Tapa dura',
  paperback: 'Tapa blanda',
  ebook: 'Ebook',
  audiobook: 'Audiolibro',
}

const STEPS: { id: Step; label: string; icon: typeof Truck }[] = [
  { id: 'shipping', label: 'Envío', icon: Truck },
  { id: 'payment', label: 'Pago', icon: CreditCard },
  { id: 'confirmation', label: 'Confirmación', icon: Check },
]

const SHIPPING_METHODS = [
  { id: 'standard', label: 'Envío estándar', time: '3-5 días hábiles', price: usdToArs(5.99) },
  { id: 'express', label: 'Envío express', time: '24-48h', price: usdToArs(12.99) },
  { id: 'pickup', label: 'Retiro en tienda', time: 'Disponible hoy', price: 0 },
]

const PAYMENT_METHODS = [
  { id: 'card', label: 'Tarjeta de crédito/débito', icon: '💳' },
  { id: 'paypal', label: 'PayPal', icon: '🅿️' },
  { id: 'transfer', label: 'Transferencia bancaria', icon: '🏦' },
]

export default function CheckoutPage() {
  const items = useCart((state) => state.items)
  const clearCart = useCart((state) => state.clearCart)

  const [currentStep, setCurrentStep] = useState<Step>('shipping')
  const [shippingMethod, setShippingMethod] = useState('standard')
  const [paymentMethod, setPaymentMethod] = useState('card')
  const [sameBillingAddress, setSameBillingAddress] = useState(true)

  const [shippingData, setShippingData] = useState({
    email: '',
    fullName: '',
    street: '',
    city: '',
    postalCode: '',
    country: 'Argentina',
    phone: '',
  })

  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiry: '',
    cvv: '',
    cardName: '',
  })

  const subtotal = selectSubtotal(items)
  const shippingCost = SHIPPING_METHODS.find((m) => m.id === shippingMethod)?.price || 0
  const tax = subtotal * 0.21
  const total = subtotal + shippingCost + tax

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentStep('payment')
  }

  const [placedItems, setPlacedItems] = useState<CartItemType[]>([])

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setPlacedItems(items)
    clearCart()
    setCurrentStep('confirmation')
  }

  const currentStepIndex = STEPS.findIndex((s) => s.id === currentStep)
  const [orderNumber] = useState(() => Math.floor(Math.random() * 90000 + 10000))

  const formatPrice = (item: CartItemType) =>
    item.book.formats.find((f) => f.type === item.format)?.price ?? item.book.price

  if (items.length === 0 && currentStep !== 'confirmation') {
    return (
      <div className="min-h-screen bg-bg-base">
        <header className="border-b border-border-subtle bg-bg-header">
          <div className="mx-auto max-w-[var(--container-max)] px-[var(--space-6)] md:px-[var(--space-10)] lg:px-[var(--space-16)] h-[var(--height-header)] flex items-center justify-center">
            <Link href="/" className="flex items-center gap-[var(--space-2)]">
              <svg
                className="w-6 h-6 text-brand-primary"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
                <path d="M8 7h6" />
                <path d="M8 11h8" />
              </svg>
              <span className="text-[22px] font-display font-medium text-brand-primary tracking-tight">
                Nova Books
              </span>
            </Link>
          </div>
        </header>
        <div className="mx-auto max-w-[var(--container-max)] px-[var(--space-6)] md:px-[var(--space-10)] lg:px-[var(--space-16)] py-[var(--space-24)] text-center">
          <h1 className="text-2xl md:text-4xl font-display font-medium text-text-primary tracking-[var(--tracking-4xl)] mb-[var(--space-3)]">
            Tu carrito está vacío
          </h1>
          <p className="text-sm text-text-secondary mb-[var(--space-8)]">
            Agregá algunos libros antes de continuar con la compra.
          </p>
          <Link href="/">
            <Button size="lg">Explorar el catálogo</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg-base">
      <header className="border-b border-border-subtle bg-bg-header">
        <div className="mx-auto max-w-[var(--container-max)] px-[var(--space-6)] md:px-[var(--space-10)] lg:px-[var(--space-16)] h-[var(--height-header)] flex items-center justify-center">
          <Link href="/" className="flex items-center gap-[var(--space-2)]">
            <svg
              className="w-6 h-6 text-brand-primary"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
              <path d="M8 7h6" />
              <path d="M8 11h8" />
            </svg>
            <span className="text-[22px] font-display font-medium text-brand-primary tracking-tight">
              Nova Books
            </span>
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-[var(--container-max)] px-[var(--space-6)] md:px-[var(--space-10)] lg:px-[var(--space-16)] py-[var(--space-10)]">
        <nav className="flex items-center justify-center gap-[var(--space-4)] md:gap-[var(--space-8)] mb-[var(--space-12)]" aria-label="Progreso del checkout">
          {STEPS.map((step, index) => {
            const isCompleted = index < currentStepIndex
            const isCurrent = index === currentStepIndex

            return (
              <div key={step.id} className="flex items-center gap-[var(--space-4)] md:gap-[var(--space-8)]">
                <div className="flex items-center gap-[var(--space-3)]">
                  <div
                    className={cn(
                      'w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors duration-200',
                      isCompleted
                        ? 'bg-brand-primary text-text-on-brand'
                        : isCurrent
                        ? 'bg-brand-primary text-text-on-brand'
                        : 'bg-bg-muted text-text-tertiary'
                    )}
                  >
                    {isCompleted ? <Check className="w-4 h-4" /> : index + 1}
                  </div>
                  <span
                    className={cn(
                      'text-sm font-medium hidden sm:block',
                      isCurrent ? 'text-text-primary' : 'text-text-tertiary'
                    )}
                  >
                    {step.label}
                  </span>
                </div>
                {index < STEPS.length - 1 && (
                  <div
                    className={cn(
                      'w-12 md:w-24 h-[2px]',
                      index < currentStepIndex ? 'bg-brand-primary' : 'bg-border-subtle'
                    )}
                    aria-hidden="true"
                  />
                )}
              </div>
            )
          })}
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-[60%_40%] gap-[var(--space-12)]">
          <div>
            {currentStep !== 'confirmation' && (
              <details className="lg:hidden mb-[var(--space-8)] rounded-[var(--radius-md)] border border-border-subtle bg-bg-surface">
                <summary className="list-none flex items-center justify-between gap-[var(--space-3)] px-[var(--space-5)] py-[var(--space-4)] cursor-pointer">
                  <span className="text-sm font-semibold text-text-primary">
                    Resumen del pedido ({items.length})
                  </span>
                  <span className="flex items-center gap-[var(--space-2)] text-sm font-bold text-text-primary">
                    {formatArs(total)}
                    <ChevronDown className="w-4 h-4 text-text-tertiary transition-transform duration-200" aria-hidden="true" />
                  </span>
                </summary>
                <div className="px-[var(--space-5)] pb-[var(--space-5)] border-t border-border-subtle">
                  <div className="flex flex-col gap-[var(--space-3)] py-[var(--space-4)]">
                    {items.map((item) => {
                      const price = formatPrice(item)
                      return (
                        <div key={`${item.book.id}-${item.format}`} className="flex items-center gap-[var(--space-3)]">
                          <div className="w-12 h-16 rounded-[var(--radius-sm)] bg-bg-muted overflow-hidden relative shrink-0">
                            <Image src={item.book.coverImage} alt="" fill sizes="48px" className="object-contain p-1" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-text-primary truncate">{item.book.title}</p>
                            <p className="text-xs text-text-tertiary">{FORMAT_LABELS[item.format]} × {item.quantity}</p>
                          </div>
                          <span className="text-sm font-semibold text-text-primary shrink-0">
                            {formatArs(price * item.quantity)}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                  <div className="space-y-[var(--space-2)]">
                    <div className="flex justify-between text-sm">
                      <span className="text-text-secondary">Subtotal</span>
                      <span className="text-text-primary">{formatArs(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-text-secondary">Envío</span>
                      <span className="text-text-primary">{shippingCost === 0 ? 'Gratis' : formatArs(shippingCost)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-text-secondary">Impuestos (21%)</span>
                      <span className="text-text-primary">{formatArs(tax)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold pt-[var(--space-3)] border-t border-border-subtle">
                      <span className="text-text-primary">Total</span>
                      <span className="text-text-primary">{formatArs(total)}</span>
                    </div>
                  </div>
                </div>
              </details>
            )}

            {currentStep === 'shipping' && (
              <form onSubmit={handleShippingSubmit} className="space-y-[var(--space-6)]">
                <h2 className="text-2xl font-display font-medium text-text-primary">
                  Información de envío
                </h2>

                <Input
                  label="Email"
                  type="email"
                  value={shippingData.email}
                  onChange={(e) => setShippingData({ ...shippingData, email: sanitizeInput(e.target.value) })}
                  placeholder="tu@email.com"
                  required
                  autoComplete="email"
                />

                <Input
                  label="Nombre completo"
                  value={shippingData.fullName}
                  onChange={(e) => setShippingData({ ...shippingData, fullName: sanitizeInput(e.target.value) })}
                  placeholder="Nombre y apellido"
                  required
                  autoComplete="name"
                />

                <Input
                  label="Dirección"
                  value={shippingData.street}
                  onChange={(e) => setShippingData({ ...shippingData, street: sanitizeInput(e.target.value) })}
                  placeholder="Calle y número"
                  required
                  autoComplete="street-address"
                />

                <div className="grid grid-cols-2 gap-[var(--space-4)]">
                  <Input
                    label="Ciudad"
                    value={shippingData.city}
                    onChange={(e) => setShippingData({ ...shippingData, city: sanitizeInput(e.target.value) })}
                    placeholder="Ciudad"
                    required
                    autoComplete="address-level2"
                  />
                  <Input
                    label="Código postal"
                    value={shippingData.postalCode}
                    onChange={(e) => setShippingData({ ...shippingData, postalCode: sanitizeInput(e.target.value) })}
                    placeholder="1234"
                    required
                    autoComplete="postal-code"
                  />
                </div>

                <Input
                  label="Teléfono"
                  type="tel"
                  value={shippingData.phone}
                  onChange={(e) => setShippingData({ ...shippingData, phone: sanitizeInput(e.target.value) })}
                  placeholder="+54 11 1234-5678"
                  required
                  autoComplete="tel"
                />

                <div>
                  <p className="text-sm font-medium text-text-primary mb-[var(--space-3)]">
                    Método de envío
                  </p>
                  <div className="flex flex-col gap-[var(--space-3)]">
                    {SHIPPING_METHODS.map((method) => (
                      <label
                        key={method.id}
                        className={cn(
                          'flex items-center justify-between p-[var(--space-4)] rounded-[var(--radius-md)] border cursor-pointer transition-all duration-[var(--duration-micro)]',
                          shippingMethod === method.id
                            ? 'border-brand-primary bg-brand-primary-light'
                            : 'border-border-subtle hover:border-border-hover'
                        )}
                      >
                        <div className="flex items-center gap-[var(--space-3)]">
                          <input
                            type="radio"
                            name="shipping"
                            value={method.id}
                            checked={shippingMethod === method.id}
                            onChange={(e) => setShippingMethod(e.target.value)}
                            className="accent-brand-primary"
                          />
                          <div>
                            <p className="text-sm font-medium text-text-primary">{method.label}</p>
                            <p className="text-xs text-text-tertiary">{method.time}</p>
                          </div>
                        </div>
                        <span className="text-sm font-semibold text-text-primary">
                          {method.price === 0 ? 'Gratis' : formatArs(method.price)}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <Button type="submit" size="lg" className="w-full">
                  Continuar al pago
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </form>
            )}

            {currentStep === 'payment' && (
              <form onSubmit={handlePaymentSubmit} className="space-y-[var(--space-6)]">
                <h2 className="text-2xl font-display font-medium text-text-primary">
                  Método de pago
                </h2>

                <div className="flex flex-col gap-[var(--space-3)]">
                  {PAYMENT_METHODS.map((method) => (
                    <label
                      key={method.id}
                      className={cn(
                        'flex items-center gap-[var(--space-3)] p-[var(--space-4)] rounded-[var(--radius-md)] border cursor-pointer transition-all duration-[var(--duration-micro)]',
                        paymentMethod === method.id
                          ? 'border-brand-primary bg-brand-primary-light'
                          : 'border-border-subtle hover:border-border-hover'
                      )}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={method.id}
                        checked={paymentMethod === method.id}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="accent-brand-primary"
                      />
                      <span className="text-lg" aria-hidden="true">{method.icon}</span>
                      <span className="text-sm font-medium text-text-primary">{method.label}</span>
                    </label>
                  ))}
                </div>

                {paymentMethod === 'card' && (
                  <div className="space-y-[var(--space-4)]">
                    <Input
                      label="Número de tarjeta"
                      value={paymentData.cardNumber}
                      onChange={(e) => setPaymentData({ ...paymentData, cardNumber: e.target.value.replace(/\D/g, '').slice(0, 16) })}
                      placeholder="1234 5678 9012 3456"
                      required
                      autoComplete="cc-number"
                    />

                    <div className="grid grid-cols-2 gap-[var(--space-4)]">
                      <Input
                        label="Vencimiento"
                        value={paymentData.expiry}
                        onChange={(e) => {
                          let val = e.target.value.replace(/\D/g, '')
                          if (val.length >= 2) val = val.slice(0, 2) + '/' + val.slice(2, 4)
                          setPaymentData({ ...paymentData, expiry: val })
                        }}
                        placeholder="MM/AA"
                        required
                        autoComplete="cc-exp"
                      />
                      <Input
                        label="CVV"
                        value={paymentData.cvv}
                        onChange={(e) => setPaymentData({ ...paymentData, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) })}
                        placeholder="123"
                        required
                        autoComplete="cc-csc"
                        helperText="3 o 4 dígitos en el reverso"
                      />
                    </div>

                    <Input
                      label="Nombre del titular"
                      value={paymentData.cardName}
                      onChange={(e) => setPaymentData({ ...paymentData, cardName: sanitizeInput(e.target.value) })}
                      placeholder="Como aparece en la tarjeta"
                      required
                      autoComplete="cc-name"
                    />
                  </div>
                )}

                <label className="flex items-center gap-[var(--space-3)] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={sameBillingAddress}
                    onChange={(e) => setSameBillingAddress(e.target.checked)}
                    className="w-4 h-4 accent-brand-primary"
                  />
                  <span className="text-sm text-text-secondary">
                    Usar la misma dirección de envío como dirección de facturación
                  </span>
                </label>

                <div className="flex gap-[var(--space-3)]">
                  <Button
                    type="button"
                    variant="secondary"
                    size="lg"
                    onClick={() => setCurrentStep('shipping')}
                  >
                    Volver
                  </Button>
                  <Button type="submit" size="lg" className="flex-1">
                    Confirmar pedido
                  </Button>
                </div>
              </form>
            )}

            {currentStep === 'confirmation' && (
              <div className="text-center py-[var(--space-12)]">
                <div className="w-20 h-20 rounded-full bg-success-bg flex items-center justify-center mx-auto mb-[var(--space-6)]">
                  <svg
                    className="w-10 h-10 text-success"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path
                      d="M20 6L9 17l-5-5"
                      className="animate-[check-draw_500ms_ease-out_forwards]"
                      style={{ strokeDasharray: 100, strokeDashoffset: 100 }}
                    />
                  </svg>
                </div>

                <h2 className="text-3xl font-display font-medium text-text-primary mb-[var(--space-3)]">
                  ¡Gracias por tu pedido, {shippingData.fullName.split(' ')[0] || 'lector'}!
                </h2>
                <p className="text-base text-text-secondary mb-[var(--space-2)]">
                  Pedido #NB-{orderNumber}
                </p>
                <p className="text-sm text-text-tertiary mb-[var(--space-8)]">
                  Te enviamos los detalles a tu correo ({shippingData.email || 'tu email'}).
                </p>

                <div className="bg-bg-muted rounded-[var(--radius-md)] p-[var(--space-6)] max-w-[480px] mx-auto mb-[var(--space-8)]">
                  <div className="flex flex-col gap-[var(--space-3)]">
                    {placedItems.map((item) => {
                      const price = formatPrice(item)
                      return (
                        <div key={`${item.book.id}-${item.format}`} className="flex items-center gap-[var(--space-3)]">
                          <div className="w-12 h-16 rounded-[var(--radius-sm)] bg-bg-surface overflow-hidden relative shrink-0">
                            <Image src={item.book.coverImage} alt="" fill sizes="48px" className="object-contain p-1" />
                          </div>
                          <div className="flex-1 text-left">
                            <p className="text-sm font-medium text-text-primary truncate">{item.book.title}</p>
                            <p className="text-xs text-text-tertiary">{FORMAT_LABELS[item.format]} × {item.quantity}</p>
                          </div>
                          <span className="text-sm font-semibold text-text-primary">
                            {formatArs(price * item.quantity)}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                  <div className="border-t border-border-subtle mt-[var(--space-4)] pt-[var(--space-4)]">
                    <p className="text-sm text-text-secondary">
                      Tiempo estimado de entrega:{' '}
                      <strong className="text-text-primary">
                        {SHIPPING_METHODS.find((m) => m.id === shippingMethod)?.time}
                      </strong>
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-[var(--space-3)]">
                  <Link href="/cuenta/pedidos">
                    <Button size="lg">Ver estado del pedido</Button>
                  </Link>
                  <Link href="/">
                    <Button variant="ghost" size="lg">Seguir comprando</Button>
                  </Link>
                </div>
              </div>
            )}
          </div>

          {currentStep !== 'confirmation' && (
            <aside className="hidden lg:block sticky top-[calc(var(--height-header)+var(--space-4))] self-start">
              <div className="bg-bg-surface border border-border-subtle rounded-[var(--radius-lg)] p-[var(--space-6)]">
                <h3 className="text-base font-semibold text-text-primary mb-[var(--space-4)]">
                  Resumen del pedido
                </h3>

                <div className="flex flex-col gap-[var(--space-3)] mb-[var(--space-6)]">
                  {items.map((item) => {
                    const price = formatPrice(item)
                    return (
                      <div key={`${item.book.id}-${item.format}`} className="flex items-center gap-[var(--space-3)]">
                        <div className="w-12 h-16 rounded-[var(--radius-sm)] bg-bg-muted overflow-hidden relative shrink-0">
                          <Image src={item.book.coverImage} alt="" fill sizes="48px" className="object-contain p-1" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-text-primary truncate">{item.book.title}</p>
                          <p className="text-xs text-text-tertiary">{FORMAT_LABELS[item.format]} × {item.quantity}</p>
                        </div>
                        <span className="text-sm font-semibold text-text-primary shrink-0">
                          {formatArs(price * item.quantity)}
                        </span>
                      </div>
                    )
                  })}
                </div>

                <div className="border-t border-border-subtle pt-[var(--space-4)] space-y-[var(--space-2)]">
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">Subtotal</span>
                    <span className="text-text-primary">{formatArs(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">Envío</span>
                    <span className="text-text-primary">
                      {shippingCost === 0 ? 'Gratis' : formatArs(shippingCost)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">Impuestos (21%)</span>
                    <span className="text-text-primary">{formatArs(tax)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-[var(--space-3)] border-t border-border-subtle bg-bg-muted -mx-[var(--space-6)] px-[var(--space-6)] py-[var(--space-3)] rounded-[var(--radius-md)]">
                    <span className="text-text-primary">Total</span>
                    <span className="text-text-primary">{formatArs(total)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-[var(--space-2)] mt-[var(--space-4)] pt-[var(--space-4)] border-t border-border-subtle">
                  <Lock className="w-4 h-4 text-success" aria-hidden="true" />
                  <span className="text-xs text-text-tertiary">Pago seguro con encriptación SSL</span>
                </div>
              </div>
            </aside>
          )}
        </div>
      </div>
    </div>
  )
}
