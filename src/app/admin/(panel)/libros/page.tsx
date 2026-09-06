import Image from 'next/image'
import Link from 'next/link'
import { Pencil } from 'lucide-react'
import { listLibros } from '@/lib/admin/data'
import { formatArs } from '@/lib/format'
import { PageHeader, Table } from '../_components'
import { DeleteButton } from '../_delete-button'
import { eliminarLibro } from '../../actions'

export default async function AdminLibrosPage() {
  const libros = await listLibros()

  return (
    <div>
      <PageHeader
        title="Libros"
        description="Gestiona el catálogo de tu librería"
        action={{ href: '/admin/libros/nuevo', label: 'Nuevo libro' }}
      />

      <div className="hidden sm:block">
        <Table>
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Portada</th>
                <th className="px-4 py-3">Título</th>
                <th className="px-4 py-3">Autor</th>
                <th className="px-4 py-3">Categoría</th>
                <th className="px-4 py-3">Precio</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {libros.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center text-slate-500">
                    No hay libros todavía. Crea el primero.
                  </td>
                </tr>
              )}
              {libros.map((libro) => (
                <tr key={libro.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60">
                  <td className="px-4 py-3">
                    <div className="w-9 h-12 rounded bg-slate-100 overflow-hidden relative">
                      <Image
                        src={libro.cover_image || '/placeholder-book.svg'}
                        alt=""
                        fill
                        sizes="36px"
                        className="object-contain p-0.5"
                      />
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Link href={`/admin/libros/${libro.id}`} className="font-medium text-slate-800 hover:text-orange-600">
                      {libro.title}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{libro.autorName}</td>
                  <td className="px-4 py-3 text-slate-600">{libro.categoriaName}</td>
                  <td className="px-4 py-3 text-slate-800">
                    {formatArs(Number(libro.price))}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        libro.stock > 0
                          ? 'text-emerald-600 font-medium'
                          : 'text-red-500 font-medium'
                      }
                    >
                      {libro.stock}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${
                        libro.active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {libro.active ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/admin/libros/${libro.id}`}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 px-2 py-1.5 rounded-md transition-colors"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                        Editar
                      </Link>
                      <DeleteButton id={libro.id} action={eliminarLibro} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Table>
      </div>

      <div className="flex flex-col gap-3 sm:hidden">
        {libros.length === 0 && (
          <div className="rounded-xl border border-slate-200 bg-white px-4 py-10 text-center text-sm text-slate-500">
            No hay libros todavía. Crea el primero.
          </div>
        )}
        {libros.map((libro) => (
          <div key={libro.id} className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex gap-3">
              <div className="w-11 h-14 shrink-0 rounded bg-slate-100 overflow-hidden relative">
                <Image
                  src={libro.cover_image || '/placeholder-book.svg'}
                  alt=""
                  fill
                  sizes="44px"
                  className="object-contain p-0.5"
                />
              </div>
              <div className="min-w-0 flex-1">
                <Link
                  href={`/admin/libros/${libro.id}`}
                  className="line-clamp-1 font-medium text-slate-800 hover:text-orange-600"
                >
                  {libro.title}
                </Link>
                <p className="line-clamp-1 text-sm text-slate-600">
                  {libro.autorName} · {libro.categoriaName}
                </p>
                <div className="mt-1.5 flex flex-wrap items-center gap-2">
                  <span className="text-sm font-semibold text-slate-800">
                    {formatArs(Number(libro.price))}
                  </span>
                  <span
                    className={
                      libro.stock > 0
                        ? 'text-sm font-medium text-emerald-600'
                        : 'text-sm font-medium text-red-500'
                    }
                  >
                    Stock: {libro.stock}
                  </span>
                  <span
                    className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                      libro.active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {libro.active ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-end gap-1 border-t border-slate-100 pt-3">
              <Link
                href={`/admin/libros/${libro.id}`}
                className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 px-2 py-1.5 rounded-md transition-colors"
              >
                <Pencil className="w-3.5 h-3.5" />
                Editar
              </Link>
              <DeleteButton id={libro.id} action={eliminarLibro} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}