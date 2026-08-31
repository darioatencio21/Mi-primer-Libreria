import Link from 'next/link'
import { redirect } from 'next/navigation'
import {
  LayoutDashboard,
  BookOpen,
  PenLine,
  Tags,
  Package,
  LogOut,
  ExternalLink,
} from 'lucide-react'
import { isAdminSessionActive } from '@/lib/admin/auth'
import { logoutAdmin } from '@/app/admin/actions'

const NAV = [
  { href: '/admin', label: 'Panel', icon: LayoutDashboard },
  { href: '/admin/libros', label: 'Libros', icon: BookOpen },
  { href: '/admin/autores', label: 'Autores', icon: PenLine },
  { href: '/admin/categorias', label: 'Categorías', icon: Tags },
  { href: '/admin/pedidos', label: 'Pedidos', icon: Package },
]

export default async function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  const active = await isAdminSessionActive()
  if (!active) {
    redirect('/admin/login')
  }

  return (
    <div className="min-h-screen bg-[#f6f5f2] text-slate-800">
      <aside className="fixed inset-y-0 left-0 w-64 bg-white border-r border-slate-200 flex flex-col">
        <div className="px-6 h-16 flex items-center border-b border-slate-200">
          <span className="font-display text-lg font-medium text-slate-900">Tus Libros Ya</span>
          <span className="ml-2 text-[10px] uppercase tracking-widest bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded font-semibold">
            Admin
          </span>
        </div>

        <nav className="flex-1 py-4 px-3 flex flex-col gap-1">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-orange-50 hover:text-orange-700 transition-colors"
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          ))}
          <div className="my-2 border-t border-slate-100" />
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            Ver tienda
          </Link>
        </nav>

        <div className="p-3 border-t border-slate-200">
          <form action={logoutAdmin}>
            <button
              type="submit"
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Cerrar sesión
            </button>
          </form>
        </div>
      </aside>

      <div className="pl-64">
        <main className="px-8 py-8">{children}</main>
      </div>
    </div>
  )
}
