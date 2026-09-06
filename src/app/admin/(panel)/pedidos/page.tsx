import { listPedidos } from '@/lib/admin/data'
import { formatArs } from '@/lib/format'
import { PageHeader, Table, StatusBadge } from '../_components'
import { PedidoStatusSelect } from './_status-select'

export default async function AdminPedidosPage() {
  const pedidos = await listPedidos()

  const fecha = (iso: string) =>
    new Date(iso).toLocaleDateString('es-AR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })

  return (
    <div>
      <PageHeader title="Pedidos" description="Consulta y actualiza el estado de los pedidos" />

      <div className="hidden sm:block">
        <Table>
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Pedido</th>
                <th className="px-4 py-3">Cliente</th>
                <th className="px-4 py-3">Artículos</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Fecha</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3">Actualizar</th>
              </tr>
            </thead>
            <tbody>
              {pedidos.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-slate-500">
                    Todavía no hay pedidos.
                  </td>
                </tr>
              )}
              {pedidos.map((p) => (
                <tr key={p.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60">
                  <td className="px-4 py-3 font-medium text-slate-800">{p.numero}</td>
                  <td className="px-4 py-3 text-slate-600">{p.cliente}</td>
                  <td className="px-4 py-3 text-slate-600">{p.itemsCount}</td>
                  <td className="px-4 py-3 text-slate-800">{formatArs(Number(p.total))}</td>
                  <td className="px-4 py-3 text-slate-500">{fecha(p.created_at)}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={p.status} />
                  </td>
                  <td className="px-4 py-3">
                    <PedidoStatusSelect id={p.id} status={p.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Table>
      </div>

      <div className="flex flex-col gap-3 sm:hidden">
        {pedidos.length === 0 && (
          <div className="rounded-xl border border-slate-200 bg-white px-4 py-10 text-center text-sm text-slate-500">
            Todavía no hay pedidos.
          </div>
        )}
        {pedidos.map((p) => (
          <div key={p.id} className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex items-center justify-between gap-2">
              <span className="font-semibold text-slate-800">{p.numero}</span>
              <StatusBadge status={p.status} />
            </div>
            <p className="mt-1 text-sm text-slate-600">{p.cliente}</p>
            <div className="mt-2 flex items-center justify-between gap-2">
              <div>
                <p className="text-xs text-slate-400">
                  {p.itemsCount} artículo{p.itemsCount === 1 ? '' : 's'} · {fecha(p.created_at)}
                </p>
                <p className="mt-0.5 font-semibold text-slate-800">{formatArs(Number(p.total))}</p>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between gap-2 border-t border-slate-100 pt-3">
              <span className="text-xs font-medium text-slate-400">Cambiar estado</span>
              <PedidoStatusSelect id={p.id} status={p.status} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}