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

      <div className="mb-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard label="Libros" value={stats.totalLibros} icon={<BookOpen className="w-5 h-5" />} />
        <StatCard label="Autores" value={stats.totalAutores} icon={<PenLine className="w-5 h-5" />} />
        <StatCard label="Categorías" value={stats.totalCategorias} icon={<Tags className="w-5 h-5" />} />
        <StatCard label="Stock total" value={stats.stockTotal} icon={<Boxes className="w-5 h-5" />} />
        <StatCard label="Bestsellers" value={stats.bestsellers} icon={<Star className="w-5 h-5" />} />
        <StatCard label="Novedades" value={stats.nuevos} icon={<Sparkles className="w-5 h-5" />} />
      </div>

      <h2 className="mb-3 text-lg font-semibold text-slate-900">Pedidos recientes</h2>
      {stats.pedidosRecientes.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-sm text-slate-500">
          Todavía no hay pedidos.
        </div>
      ) : (
        <>
          <div className="hidden sm:block overflow-hidden bg-white rounded-xl border border-slate-200">
            <table className="w-full min-w-[480px] text-sm">
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

          <div className="flex flex-col gap-3 sm:hidden">
            {stats.pedidosRecientes.map((p) => (
              <div key={p.id} className="rounded-xl border border-slate-200 bg-white p-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-slate-800">{p.numero}</span>
                  <StatusBadge status={String(p.status)} />
                </div>
                <div className="mt-1 flex items-center justify-between gap-2">
                  <p className="min-w-0 flex-1 truncate text-sm text-slate-600">{p.cliente}</p>
                  <p className="shrink-0 font-semibold text-slate-800">
                    {formatArs(Number(p.total))}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/admin/pedidos"
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 text-sm font-semibold text-white hover:bg-slate-700 transition-colors"
        >
          Ver pedidos
        </Link>
      </div>
    </div>
  )
}