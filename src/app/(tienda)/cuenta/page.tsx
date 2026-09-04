import Link from 'next/link'
import type { Metadata } from 'next'
import { LogOut, Package, User } from 'lucide-react'
import { desc, eq } from 'drizzle-orm'
import { db } from '@/lib/db/client'
import { orders } from '@/lib/db/schema'
import { getCurrentUser } from '@/lib/auth/session'
import { logout } from '@/lib/auth/actions'
import { formatArs } from '@/lib/format'

export const metadata: Metadata = {
  title: 'Mi cuenta',
  description: 'Accedé a tu cuenta de tuslibrosya.',
}

export default async function CuentaPage() {
  const user = await getCurrentUser()

  if (!user) {
    return (
      <main className="flex flex-col items-center justify-center min-h-[70vh] px-[var(--space-6)] text-center">
        <div className="w-20 h-20 rounded-[var(--radius-full)] bg-bg-muted flex items-center justify-center mb-[var(--space-6)]">
          <User className="w-9 h-9 text-text-tertiary" strokeWidth={1.5} aria-hidden="true" />
        </div>
        <h1 className="text-2xl md:text-3xl font-display font-medium text-text-primary mb-[var(--space-3)]">
          Mi cuenta
        </h1>
        <p className="text-sm text-text-secondary max-w-[var(--container-text)] mb-[var(--space-8)]">
          Ingresá con tu cuenta para ver tus pedidos y datos personales.
        </p>
        <div className="flex flex-col sm:flex-row gap-[var(--space-3)]">
          <Link
            href="/login"
            className="inline-flex items-center justify-center h-[var(--height-btn-md)] px-[var(--space-6)] rounded-[var(--radius-md)] bg-brand-primary text-text-on-brand font-semibold text-sm hover:bg-brand-primary-hover transition-colors duration-[var(--duration-micro)]"
          >
            Ingresar
          </Link>
          <Link
            href="/registro"
            className="inline-flex items-center justify-center h-[var(--height-btn-md)] px-[var(--space-6)] rounded-[var(--radius-md)] bg-transparent border-[1.5px] border-brand-primary text-brand-primary font-semibold text-sm hover:bg-brand-primary-light transition-colors duration-[var(--duration-micro)]"
          >
            Crear cuenta
          </Link>
        </div>
      </main>
    )
  }

  const orderRows = await db
    .select()
    .from(orders)
    .where(eq(orders.userId, user.id))
    .orderBy(desc(orders.createdAt))

  const totalSpent = orderRows.reduce((sum, order) => sum + (order.total ?? 0), 0)

  return (
    <main className="mx-auto max-w-[var(--container-max)] px-[var(--space-4)] md:px-[var(--space-10)] lg:px-[var(--space-16)] py-[var(--space-10)] md:py-[var(--space-16)]">
      <h1 className="text-2xl md:text-4xl font-display font-normal text-text-primary tracking-[var(--tracking-4xl)] mb-[var(--space-8)]">
        Mi cuenta
      </h1>

      <div className="grid gap-[var(--space-6)] lg:grid-cols-3">
        <section className="bg-bg-surface border border-border-subtle rounded-[var(--radius-lg)] p-[var(--space-6)]">
          <h2 className="text-lg font-semibold text-text-primary mb-[var(--space-2)]">
            {user.name || 'Hola'}
          </h2>
          <p className="text-sm text-text-secondary mb-[var(--space-6)]">{user.email}</p>
          <form action={logout}>
            <button
              type="submit"
              className="inline-flex items-center gap-[var(--space-2)] text-sm font-medium text-error hover:text-error/80 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Cerrar sesión
            </button>
          </form>
        </section>

        <section className="bg-bg-surface border border-border-subtle rounded-[var(--radius-lg)] p-[var(--space-6)]">
          <h2 className="text-lg font-semibold text-text-primary mb-[var(--space-2)]">Mis pedidos</h2>
          <p className="text-sm text-text-secondary mb-[var(--space-4)]">
            {orderRows.length} {orderRows.length === 1 ? 'pedido realizado' : 'pedidos realizados'} ·
            total {formatArs(totalSpent)}
          </p>
          <Link
            href="/cuenta/pedidos"
            className="inline-flex items-center gap-[var(--space-2)] text-sm font-semibold text-brand-primary hover:text-brand-primary-hover"
          >
            <Package className="w-4 h-4" />
            Ver historial
          </Link>
        </section>
      </div>
    </main>
  )
}