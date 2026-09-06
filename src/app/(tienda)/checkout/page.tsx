'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Check, CreditCard, Truck, Lock, ChevronRight, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useCart, selectSubtotal } from '@/lib/store'
import { cn } from '@/lib/utils'
import { TrustBadges } from '@/components/ui/TrustBadges'
import { sanitizeInput } from '@/lib/sanitize'
import { formatArs, usdToArs } from '@/lib/format'
import { DEFAULT_CHECKOUT_CONFIG, type CheckoutConfig } from '@/lib/checkout-config'
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

const MAX_LENGTHS: Record<'email' | 'fullName' | 'street' | 'city' | 'postalCode', number> = {
  email: 40,
  fullName: 30,
  street: 30,
  city: 25,
  postalCode: 10,
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function CheckoutPage() {
  const items = useCart((state) => state.items)
  const clearCart = useCart((state) => state.clearCart)

  const [config, setConfig] = useState<CheckoutConfig>(DEFAULT_CHECKOUT_CONFIG)
  const [currentStep, setCurrentStep] = useState<Step>('shipping')
  const [shippingMethod, setShippingMethod] = useState('standard')
  const [paymentMethod, setPaymentMethod] = useState('card')
  const [sameBillingAddress, setSameBillingAddress] = useState(true)

  useEffect(() => {
    let cancelled = false
    fetch('/api/config/checkout')
      .then((res) => (res.ok ? res.json() : null))
      .then((data: CheckoutConfig | null) => {
        if (cancelled || !data) return
        setConfig(data)
        if (!data.shippingMethods.some((m) => m.id === 'standard')) {
          setShippingMethod(data.shippingMethods[0]?.id ?? 'standard')
        }
        if (!data.paymentMethods.some((m) => m.enabled && m.id === 'card')) {
          const firstEnabled = data.paymentMethods.find((m) => m.enabled)
          setPaymentMethod(firstEnabled?.id ?? 'card')
        }
      })
    return () => {
      cancelled = true
    }
  }, [])

  const shippingMethods = config.shippingMethods.map((m) => ({
    ...m,
    price: usdToArs(m.price),
  }))

  const paymentMethods = config.paymentMethods.filter((m) => m.enabled)

  const [shippingData, setShippingData] = useState({
    email: '',
    fullName: '',
    street: '',
    city: '',
    postalCode: '',
    country: 'Argentina',
    phone: '',
  })

  const [shippingErrors, setShippingErrors] = useState<
    Partial<Record<keyof typeof shippingData, string>>
  >({})

  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiry: '',
    cvv: '',
    cardName: '',
  })

  const [paymentErrors, setPaymentErrors] = useState<
    Partial<Record<keyof typeof paymentData, string>>
  >({})

  const updateShipping = (field: keyof typeof shippingData, value: string) => {
    setShippingData((prev) => ({ ...prev, [field]: value }))
    setShippingErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev))
  }

  const updatePhone = (value: string) => {
    const digits = value.replace(/\D/g, '')
    if (digits.length > 13) return
    updateShipping('phone', sanitizeInput(value).replace(/[^\d+()\-\s.]/g, ''))
  }

  const updatePayment = (field: keyof typeof paymentData, value: string) => {
    setPaymentData((prev) => ({ ...prev, [field]: value }))
    setPaymentErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev))
  }

  const subtotal = selectSubtotal(items)
  const freeShippingEligible = subtotal >= config.freeShippingThreshold
  const baseShippingCost = shippingMethods.find((m) => m.id === shippingMethod)?.price || 0
  const shippingCost = freeShippingEligible && shippingMethod !== 'pickup' ? 0 : baseShippingCost
  const tax = subtotal * 0.21
  const total = subtotal + shippingCost + tax

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const errors: Partial<Record<keyof typeof shippingData, string>> = {}

    if (!shippingData.email.trim()) errors.email = 'El email es obligatorio.'
    else if (shippingData.email.length > MAX_LENGTHS.email)
      errors.email = `El email no puede superar los ${MAX_LENGTHS.email} caracteres.`
    else if (!EMAIL_RE.test(shippingData.email)) errors.email = 'Ingresá un email válido.'

    if (!shippingData.fullName.trim()) errors.fullName = 'El nombre es obligatorio.'
    else if (shippingData.fullName.length > MAX_LENGTHS.fullName)
      errors.fullName = `El nombre no puede superar los ${MAX_LENGTHS.fullName} caracteres.`

    if (!shippingData.street.trim()) errors.street = 'La dirección es obligatoria.'
    else if (shippingData.street.length > MAX_LENGTHS.street)
      errors.street = `La dirección no puede superar los ${MAX_LENGTHS.street} caracteres.`

    if (!shippingData.city.trim()) errors.city = 'La ciudad es obligatoria.'
    else if (shippingData.city.length > MAX_LENGTHS.city)
      errors.city = `La ciudad no puede superar los ${MAX_LENGTHS.city} caracteres.`

    if (!shippingData.postalCode.trim()) errors.postalCode = 'El código postal es obligatorio.'
    else if (shippingData.postalCode.length > MAX_LENGTHS.postalCode)
      errors.postalCode = `El código postal no puede superar los ${MAX_LENGTHS.postalCode} caracteres.`

    const phoneDigits = shippingData.phone.replace(/\D/g, '')
    if (!shippingData.phone.trim()) errors.phone = 'El teléfono es obligatorio.'
    else if (phoneDigits.length < 6 || phoneDigits.length > 13)
      errors.phone = 'Ingresá un teléfono válido (entre 6 y 13 dígitos).'

    setShippingErrors(errors)
    if (Object.values(errors).some(Boolean)) return
    setCurrentStep('payment')
  }

  const [placedItems, setPlacedItems] = useState<CartItemType[]>([])

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const errors: Partial<Record<keyof typeof paymentData, string>> = {}

    if (paymentMethod === 'card' && paymentMethods.some((m) => m.id === 'card')) {
      if (paymentData.cardNumber.replace(/\D/g, '').length !== 16)
        errors.cardNumber = 'El número de tarjeta debe tener 16 dígitos.'

      const expMatch = /^(\d{2})\/(\d{2})$/.exec(paymentData.expiry.trim())
      if (!expMatch) errors.expiry = 'Usá el formato MM/AA.'
      else {
        const month = Number(expMatch[1])
        const year = 2000 + Number(expMatch[2])
        if (month < 1 || month > 12) errors.expiry = 'El mes no es válido.'
        else {
          const now = new Date()
          if (year < now.getFullYear() || (year === now.getFullYear() && month < now.getMonth() + 1))
            errors.expiry = 'La tarjeta está vencida.'
        }
      }

      const cvvDigits = paymentData.cvv.replace(/\D/g, '')
      if (cvvDigits.length < 3 || cvvDigits.length > 4) errors.cvv = 'El CVV tiene 3 o 4 dígitos.'

      if (!paymentData.cardName.trim()) errors.cardName = 'El nombre del titular es obligatorio.'
    }

    setPaymentErrors(errors)
    if (Object.values(errors).some(Boolean)) return

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
                Tus Libros Ya
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
              Tus Libros Ya
            </span>
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-[var(--container-max)] px-[var(--space-6)] md:px-[var(--space-10)] lg:px-[var(--space-16)] py-[var(--space-10)] pb-[calc(var(--space-10)+env(safe-area-inset-bottom))]">
        <nav className="flex items-center justify-center gap-[var(--space-4)] md:gap-[var(--space-8)] mb-[var(--space-12)]" aria-label="Progreso del checkout">
          {STEPS.map((step, index) => {
            const isCompleted = index < currentStepIndex
            const isCurrent = index === currentStepIndex

            return (
              <div key={step.id} className="flex items-center gap-[var(--space-3)] md:gap-[var(--space-8)]">
                <div className="flex items-center gap-[var(--space-2)] md:gap-[var(--space-3)]">
                  <div
                    className={cn(
                      'w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors duration-200',
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
                      'w-8 sm:w-12 md:w-24 h-[2px]',
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
              <form onSubmit={handleShippingSubmit} noValidate className="space-y-[var(--space-6)]">
                <h2 className="text-2xl font-display font-medium text-text-primary">
                  Información de envío
                </h2>

                <Input
                  label="Email"
                  type="email"
                  value={shippingData.email}
                  onChange={(e) => updateShipping('email', sanitizeInput(e.target.value))}
                  placeholder="tu@email.com"
                  maxLength={MAX_LENGTHS.email}
                  error={shippingErrors.email}
                  required
                  autoComplete="email"
                />

                <Input
                  label="Nombre completo"
                  value={shippingData.fullName}
                  onChange={(e) => updateShipping('fullName', sanitizeInput(e.target.value))}
                  placeholder="Nombre y apellido"
                  maxLength={MAX_LENGTHS.fullName}
                  error={shippingErrors.fullName}
                  required
                  autoComplete="name"
                />

                <Input
                  label="Dirección"
                  value={shippingData.street}
                  onChange={(e) => updateShipping('street', sanitizeInput(e.target.value))}
                  placeholder="Calle y número"
                  maxLength={MAX_LENGTHS.street}
                  error={shippingErrors.street}
                  required
                  autoComplete="street-address"
                />

                <div className="grid grid-cols-2 gap-[var(--space-4)]">
                  <Input
                    label="Ciudad"
                    value={shippingData.city}
                    onChange={(e) => updateShipping('city', sanitizeInput(e.target.value))}
                    placeholder="Ciudad"
                    maxLength={MAX_LENGTHS.city}
                    error={shippingErrors.city}
                    required
                    autoComplete="address-level2"
                  />
                  <Input
                    label="Código postal"
                    value={shippingData.postalCode}
                    onChange={(e) => updateShipping('postalCode', sanitizeInput(e.target.value))}
                    placeholder="1234"
                    maxLength={MAX_LENGTHS.postalCode}
                    error={shippingErrors.postalCode}
                    required
                    autoComplete="postal-code"
                  />
                </div>

                <Input
                  label="Teléfono"
                  type="tel"
                  value={shippingData.phone}
                  onChange={(e) => updatePhone(e.target.value)}
                  placeholder="+54 11 1234-5678"
                  error={shippingErrors.phone}
                  helperText="Máximo 13 dígitos"
                  required
                  autoComplete="tel"
                />

                <div>
                  <p className="text-sm font-medium text-text-primary mb-[var(--space-3)]">
                    Método de envío
                  </p>
                  {freeShippingEligible && (
                    <p className="text-xs font-medium text-success bg-success-bg rounded-[var(--radius-sm)] px-[var(--space-3)] py-[var(--space-2)] mb-[var(--space-3)]">
                      🚚 Tu pedido supera los {formatArs(config.freeShippingThreshold)}: tenés envío gratis.
                    </p>
                  )}
                  <div className="flex flex-col gap-[var(--space-3)]">
                    {shippingMethods.map((method) => (
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
                          {method.price === 0 || (freeShippingEligible && method.id !== 'pickup')
                            ? 'Gratis'
                            : formatArs(method.price)}
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
              <form onSubmit={handlePaymentSubmit} noValidate className="space-y-[var(--space-6)]">
                <h2 className="text-2xl font-display font-medium text-text-primary">
                  Método de pago
                </h2>

                <div className="flex flex-col gap-[var(--space-3)]">
                  {paymentMethods.map((method) => (
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
                      onChange={(e) =>
                        updatePayment('cardNumber', e.target.value.replace(/\D/g, '').slice(0, 16))
                      }
                      placeholder="1234 5678 9012 3456"
                      error={paymentErrors.cardNumber}
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
                          updatePayment('expiry', val)
                        }}
                        placeholder="MM/AA"
                        error={paymentErrors.expiry}
                        required
                        autoComplete="cc-exp"
                      />
                      <Input
                        label="CVV"
                        value={paymentData.cvv}
                        onChange={(e) =>
                          updatePayment('cvv', e.target.value.replace(/\D/g, '').slice(0, 4))
                        }
                        placeholder="123"
                        error={paymentErrors.cvv}
                        required
                        autoComplete="cc-csc"
                        helperText="3 o 4 dígitos en el reverso"
                      />
                    </div>

                    <Input
                      label="Nombre del titular"
                      value={paymentData.cardName}
                      onChange={(e) =>
                        updatePayment('cardName', sanitizeInput(e.target.value))
                      }
                      placeholder="Como aparece en la tarjeta"
                      error={paymentErrors.cardName}
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

                <div className="pt-[var(--space-2)]">
                  <TrustBadges compact />
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
                  Pedido #{orderNumber}
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
                        {shippingMethods.find((m) => m.id === shippingMethod)?.time}
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
