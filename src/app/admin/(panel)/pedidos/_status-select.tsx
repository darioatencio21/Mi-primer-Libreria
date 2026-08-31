'use client'

import { useTransition } from 'react'
import { actualizarEstadoPedido } from '../../actions'

const STATUSES = [
  'pending',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
] as const

export function PedidoStatusSelect({ id, status }: { id: string; status: string }) {
  const [pending, startTransition] = useTransition()

  return (
    <select
      value={status}
      disabled={pending}
      onChange={(e) => {
        startTransition(async () => {
          await actualizarEstadoPedido(id, e.target.value)
        })
      }}
      className="h-9 rounded-md border border-slate-300 bg-white px-2.5 text-sm disabled:opacity-50 focus:border-orange-500 focus:outline-none"
    >
      {STATUSES.map((s) => (
        <option key={s} value={s}>
          {s === 'pending' ? 'Pendiente'
            : s === 'processing' ? 'Procesando'
            : s === 'shipped' ? 'Enviado'
            : s === 'delivered' ? 'Entregado'
            : 'Cancelado'}
        </option>
      ))}
    </select>
  )
}
