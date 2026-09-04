import Link from 'next/link'
import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { getCurrentUser } from '@/lib/auth/session'
import { LoginForm } from './LoginForm'

export const metadata: Metadata = {
  title: 'Ingresar',
  description: 'Ingresá a tu cuenta de tuslibrosya.',
}

export default async function LoginPage() {
  const user = await getCurrentUser()
  if (user) redirect('/cuenta')

  return (
    <main className="mx-auto max-w-md px-[var(--space-4)] py-[var(--space-12)] md:py-[var(--space-20)]">
      <div className="bg-bg-surface border border-border-subtle rounded-[var(--radius-xl)] p-[var(--space-8)] shadow-[var(--shadow-sm)]">
        <div className="mb-[var(--space-6)] text-center">
          <h1 className="text-2xl md:text-3xl font-display font-medium text-text-primary mb-[var(--space-2)]">
            Ingresar
          </h1>
          <p className="text-sm text-text-secondary">
            Entrá con tu cuenta para ver tus pedidos.
          </p>
        </div>
        <LoginForm />
        <p className="mt-[var(--space-6)] text-center text-sm text-text-secondary">
          ¿No tenés cuenta?{' '}
          <Link href="/registro" className="font-semibold text-brand-primary hover:text-brand-primary-hover">
            Crear cuenta
          </Link>
        </p>
      </div>
      <Link
        href="/"
        className="mt-[var(--space-6)] inline-flex items-center gap-[var(--space-2)] text-sm text-text-tertiary hover:text-text-primary transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver a la tienda
      </Link>
    </main>
  )
}