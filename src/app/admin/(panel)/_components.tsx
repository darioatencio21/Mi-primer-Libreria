import Link from 'next/link'
import type { ReactNode } from 'react'
import { Plus } from 'lucide-react'

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string
  description?: string
  action?: { href: string; label: string }
}) {
  return (
    <div className="flex items-center justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-display font-medium text-slate-900">{title}</h1>
        {description && <p className="text-sm text-slate-500 mt-0.5">{description}</p>}
      </div>
      {action && (
        <Link
          href={action.href}
          className="inline-flex items-center gap-2 h-10 px-4 rounded-lg bg-slate-900 text-white text-sm font-semibold hover:bg-slate-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          {action.label}
        </Link>
      )}
    </div>
  )
}

export function StatCard({
  label,
  value,
  icon,
  hint,
}: {
  label: string
  value: ReactNode
  icon?: ReactNode
  hint?: string
}) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 flex items-start justify-between">
      <div>
        <p className="text-sm text-slate-500">{label}</p>
        <p className="mt-1 text-2xl font-display font-medium text-slate-900">{value}</p>
        {hint && <p className="mt-1 text-xs text-slate-400">{hint}</p>}
      </div>
      {icon && <div className="text-orange-500">{icon}</div>}
    </div>
  )
}

export const StatusBadge = ({ status }: { status: string }) => {
  const map: Record<string, string> = {
    pending: 'bg-amber-100 text-amber-700',
    processing: 'bg-blue-100 text-blue-700',
    shipped: 'bg-violet-100 text-violet-700',
    delivered: 'bg-emerald-100 text-emerald-700',
    cancelled: 'bg-red-100 text-red-700',
  }
  const labels: Record<string, string> = {
    pending: 'Pendiente',
    processing: 'Procesando',
    shipped: 'Enviado',
    delivered: 'Entregado',
    cancelled: 'Cancelado',
  }
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${map[status] ?? 'bg-slate-100 text-slate-600'}`}>
      {labels[status] ?? status}
    </span>
  )
}

export function Table({ children }: { children: ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      {children}
    </div>
  )
}
