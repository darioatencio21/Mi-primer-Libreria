import { listPedidos } from '@/lib/admin/data'
import { formatArs } from '@/lib/format'
import { PageHeader, Table, StatusBadge } from '../_components'
import { PedidoStatusSelect } from './_status-select'

export default async function AdminPedidosPage() {
  const pedidos = await listPedidos()

  return (
    <div>
      <PageHeader title="Pedidos" description="Consulta y actualiza el estado de los pedidos" />

      <Table>
        <table className="w-full text-sm">
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
                <td className="px-4 py-3 text-slate-500">
                  {new Date(p.created_at).toLocaleDateString('es-AR', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })}
                </td>
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
  )
}
