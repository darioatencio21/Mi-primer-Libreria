import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { AdminLoginForm } from './AdminLoginForm'

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-[#f6f5f2] flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
        <div className="mb-6 text-center">
          <p className="text-xs uppercase tracking-widest text-orange-600 font-semibold mb-1">
            Tus Libros Ya
          </p>
          <h1 className="text-2xl font-display font-medium text-slate-900">Panel de Administración</h1>
        </div>
        <AdminLoginForm />
      </div>
      <Link
        href="/"
        className="mt-6 text-sm text-slate-500 hover:text-slate-800 inline-flex items-center gap-1.5"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver a la tienda
      </Link>
    </div>
  )
}
