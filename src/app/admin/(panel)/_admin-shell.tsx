'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  BookOpen,
  PenLine,
  Tags,
  Package,
  Settings,
  PlugZap,
  LogOut,
  ExternalLink,
  Menu,
  X,
} from 'lucide-react'
import { logoutAdmin } from '@/app/admin/actions'

const NAV = [
  { href: '/admin', label: 'Panel', icon: LayoutDashboard },
  { href: '/admin/libros', label: 'Libros', icon: BookOpen },
  { href: '/admin/autores', label: 'Autores', icon: PenLine },
  { href: '/admin/categorias', label: 'Categorías', icon: Tags },
  { href: '/admin/pedidos', label: 'Pedidos', icon: Package },
  { href: '/admin/configuracion', label: 'Configuración', icon: Settings },
  { href: '/admin/saas', label: 'Conectar SaaS', icon: PlugZap },
]

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const [prevPathname, setPrevPathname] = useState(pathname)

  if (prevPathname !== pathname) {
    setPrevPathname(pathname)
    setOpen(false)
  }

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const isActive = (href: string) =>
    href === '/admin'
      ? pathname === '/admin'
      : pathname === href || pathname.startsWith(`${href}/`)

  return (
    <div className="min-h-screen bg-[#f6f5f2] text-slate-800">
      <header className="lg:hidden sticky top-0 z-40 flex h-14 items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur">
        <button
          type="button"
          aria-label="Abrir menú"
          onClick={() => setOpen(true)}
          className="grid h-10 w-10 place-items-center rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-1.5">
          <span className="font-display text-base font-medium text-slate-900">Tus Libros Ya</span>
          <span className="text-[10px] uppercase tracking-widest bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded font-semibold">
            Admin
          </span>
        </div>
        <span className="w-10" />
      </header>

      {open && (
        <div
          aria-hidden
          onClick={() => setOpen(false)}
          className="lg:hidden fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-[2px]"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-slate-200 bg-white transition-transform duration-200 ease-out lg:w-64 lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-slate-200 px-6">
          <div className="flex items-center">
            <span className="font-display text-lg font-medium text-slate-900">Tus Libros Ya</span>
            <span className="ml-2 text-[10px] uppercase tracking-widest bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded font-semibold">
              Admin
            </span>
          </div>
          <button
            type="button"
            aria-label="Cerrar menú"
            onClick={() => setOpen(false)}
            className="grid h-9 w-9 place-items-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900 lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-4">
          {NAV.map((item) => {
            const active = isActive(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  active
                    ? 'bg-orange-50 text-orange-700'
                    : 'text-slate-600 hover:bg-orange-50 hover:text-orange-700'
                }`}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                {item.label}
              </Link>
            )
          })}
          <div className="my-2 border-t border-slate-100" />
          <Link
            href="/"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-colors"
          >
            <ExternalLink className="h-4 w-4 shrink-0" />
            Ver tienda
          </Link>
        </nav>

        <div className="border-t border-slate-200 p-3">
          <form action={logoutAdmin}>
            <button
              type="submit"
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="h-4 w-4 shrink-0" />
              Cerrar sesión
            </button>
          </form>
        </div>
      </aside>

      <div className="lg:pl-64">
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  )
}