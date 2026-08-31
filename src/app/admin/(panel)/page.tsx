import Link from 'next/link'
import { BookOpen, PenLine, Tags, Boxes, Star, Sparkles } from 'lucide-react'
import { getStats } from '@/lib/admin/data'
import { formatArs } from '@/lib/format'
import { PageHeader, StatCard, StatusBadge } from './_components'

export default async function AdminDashboardPage() {
  const stats = await getStats()

  return (
    <div>
      <PageHeader title="Panel de administración" description="Resumen general de tu tienda" />

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <StatCard label="Libros" value={stats.totalLibros} icon={<BookOpen className="w-5 h-5" />} />
        <StatCard label="Autores" value={stats.totalAutores} icon={<PenLine className="w-5 h-5" />} />
        <StatCard label="Categorías" value={stats.totalCategorias} icon={<Tags className="w-5 h-5" />} />
        <StatCard label="Stock total" value={stats.stockTotal} icon={<Boxes className="w-5 h-5" />} />
        <StatCard label="Bestsellers" value={stats.bestsellers} icon={<Star className="w-5 h-5" />} />
        <StatCard label="Novedades" value={stats.nuevos} icon={<Sparkles className="w-5 h-5" />} />
      </div>

      <h2 className="text-lg font-semibold text-slate-900 mb-3">Pedidos recientes</h2>
      {stats.pedidosRecientes.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-sm text-slate-500">
          Todavía no hay pedidos.
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Pedido</th>
                <th className="px-4 py-3">Cliente</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Estado</th>
              </tr>
            </thead>
            <tbody>
              {stats.pedidosRecientes.map((p) => (
                <tr key={p.id} className="border-b border-slate-100 last:border-0">
                  <td className="px-4 py-3 font-medium text-slate-800">{p.numero}</td>
                  <td className="px-4 py-3 text-slate-600">{p.cliente}</td>
                  <td className="px-4 py-3 text-slate-800">{formatArs(Number(p.total))}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={String(p.status)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-8 flex gap-3">
        <Link
          href="/admin/libros/nuevo"
          className="inline-flex items-center gap-2 h-10 px-4 rounded-lg bg-orange-600 text-white text-sm font-semibold hover:bg-orange-500 transition-colors"
        >
          + Nuevo libro
        </Link>
        <Link
          href="/admin/pedidos"
          className="inline-flex items-center gap-2 h-10 px-4 rounded-lg bg-slate-900 text-white text-sm font-semibold hover:bg-slate-700 transition-colors"
        >
          Ver pedidos
        </Link>
      </div>
    </div>
  )
}
