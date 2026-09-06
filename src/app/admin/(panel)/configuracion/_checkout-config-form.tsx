'use client'

import { useState, useTransition } from 'react'
import { Save, CheckCircle2, AlertTriangle } from 'lucide-react'
import { guardarConfiguracionCheckout } from '../../actions'
import type { CheckoutConfig } from '@/lib/checkout-config'

const inputCls =
  'h-11 rounded-md border border-slate-300 bg-white px-3 text-sm focus:border-orange-500 focus:outline-none focus:ring-4 focus:ring-orange-100 w-full'

export function CheckoutConfigForm({ config }: { config: CheckoutConfig }) {
  const [form, setForm] = useState<CheckoutConfig>(() => JSON.parse(JSON.stringify(config)))
  const [message, setMessage] = useState<{ type: 'ok' | 'error'; text: string } | null>(null)
  const [pending, startTransition] = useTransition()

  const updateShipping = (
    id: string,
    field: 'label' | 'time' | 'price',
    value: string | number
  ) => {
    setForm((prev) => ({
      ...prev,
      shippingMethods: prev.shippingMethods.map((m) =>
        m.id === id ? { ...m, [field]: value } : m
      ),
    }))
  }

  const updatePayment = (
    id: string,
    field: 'label' | 'icon' | 'enabled',
    value: string | boolean
  ) => {
    setForm((prev) => ({
      ...prev,
      paymentMethods: prev.paymentMethods.map((m) =>
        m.id === id ? { ...m, [field]: value } : m
      ),
    }))
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setMessage(null)
    const fd = new FormData(e.currentTarget)
    startTransition(async () => {
      const result = await guardarConfiguracionCheckout(null, fd)
      if (!result?.ok) {
        setMessage({
          type: 'error',
          text: result?.message ?? 'Ocurrió un error al guardar.',
        })
        return
      }
      setMessage({ type: 'ok', text: 'Configuración guardada correctamente.' })
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 max-w-3xl">
      <section className="bg-white rounded-xl border border-slate-200 p-4 sm:p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-1">Métodos de envío</h2>
        <p className="text-sm text-slate-500 mb-5">
          Precios en USD. Usá 0 para ofrecer ese envío gratis.
        </p>
        <div className="flex flex-col gap-4">
          {form.shippingMethods.map((method) => (
            <div
              key={method.id}
              className="rounded-lg border border-slate-200 bg-slate-50 p-4 grid grid-cols-1 md:grid-cols-[1.2fr_1fr_140px] gap-3"
            >
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-slate-700" htmlFor={`ship-label-${method.id}`}>
                  Nombre
                </label>
                <input
                  id={`ship-label-${method.id}`}
                  name={`shipping_${method.id}_label`}
                  className={inputCls}
                  maxLength={40}
                  value={method.label}
                  onChange={(e) => updateShipping(method.id, 'label', e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-slate-700" htmlFor={`ship-time-${method.id}`}>
                  Tiempo de entrega
                </label>
                <input
                  id={`ship-time-${method.id}`}
                  name={`shipping_${method.id}_time`}
                  className={inputCls}
                  maxLength={40}
                  value={method.time}
                  onChange={(e) => updateShipping(method.id, 'time', e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-slate-700" htmlFor={`ship-price-${method.id}`}>
                  Precio (USD)
                </label>
                <input
                  id={`ship-price-${method.id}`}
                  name={`shipping_${method.id}_price`}
                  type="number"
                  min="0"
                  step="0.01"
                  className={inputCls}
                  value={method.price}
                  onChange={(e) => updateShipping(method.id, 'price', Number(e.target.value))}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white rounded-xl border border-slate-200 p-4 sm:p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-1">Métodos de pago</h2>
        <p className="text-sm text-slate-500 mb-5">
          Activá o desactivá cada medio de pago. El ícono puede ser un emoji.
        </p>
        <div className="flex flex-col gap-4">
          {form.paymentMethods.map((method) => (
            <div
              key={method.id}
              className="rounded-lg border border-slate-200 bg-slate-50 p-4 grid grid-cols-1 md:grid-cols-[auto_1fr_120px] gap-3 items-end"
            >
              <label className="flex items-center gap-2 pb-2 cursor-pointer">
                <input
                  type="checkbox"
                  name={`payment_${method.id}_enabled`}
                  className="w-4 h-4 accent-orange-600"
                  checked={method.enabled}
                  onChange={(e) => updatePayment(method.id, 'enabled', e.target.checked)}
                />
                <span className="text-sm font-medium text-slate-700">Activo</span>
              </label>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-slate-700" htmlFor={`pay-label-${method.id}`}>
                  Nombre
                </label>
                <input
                  id={`pay-label-${method.id}`}
                  name={`payment_${method.id}_label`}
                  className={inputCls}
                  maxLength={40}
                  value={method.label}
                  onChange={(e) => updatePayment(method.id, 'label', e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-slate-700" htmlFor={`pay-icon-${method.id}`}>
                  Ícono
                </label>
                <input
                  id={`pay-icon-${method.id}`}
                  name={`payment_${method.id}_icon`}
                  className={inputCls}
                  maxLength={8}
                  value={method.icon}
                  onChange={(e) => updatePayment(method.id, 'icon', e.target.value)}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white rounded-xl border border-slate-200 p-4 sm:p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-1">Envío gratis</h2>
        <p className="text-sm text-slate-500 mb-5">
          Pedidos que superen este total en pesos (ARS) obtienen envío gratis.
        </p>
        <div className="flex flex-col gap-1 max-w-[240px]">
          <label className="text-sm font-medium text-slate-700" htmlFor="free-shipping">
            Umbral en pesos (ARS)
          </label>
          <input
            id="free-shipping"
            name="free_shipping_threshold"
            type="number"
            min="0"
            step="1"
            className={inputCls}
            value={form.freeShippingThreshold}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                freeShippingThreshold: Number(e.target.value),
              }))
            }
          />
        </div>
      </section>

      {message && (
        <div
          className={`flex items-center gap-2 rounded-lg border px-4 py-3 text-sm ${
            message.type === 'ok'
              ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
              : 'border-red-200 bg-red-50 text-red-700'
          }`}
        >
          {message.type === 'ok' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          ) : (
            <AlertTriangle className="w-4 h-4 shrink-0" />
          )}
          {message.text}
        </div>
      )}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center gap-2 h-11 px-5 rounded-lg bg-orange-600 text-white text-sm font-semibold hover:bg-orange-500 transition-colors disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          Guardar cambios
        </button>
        {pending && <span className="text-sm text-slate-500">Guardando...</span>}
      </div>
    </form>
  )
}