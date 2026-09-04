import Link from 'next/link'
import type { Metadata } from 'next'
import { Package, ShoppingBag } from 'lucide-react'
import { desc, eq, inArray } from 'drizzle-orm'
import { db } from '@/lib/db/client'
import { orderItems, orders } from '@/lib/db/schema'
import { getCurrentUser } from '@/lib/auth/session'
import { formatArs } from '@/lib/format'

export const metadata: Metadata = {
  title: 'Mis pedidos',
  description: 'Historial de tus pedidos en tuslibrosya.',
}

const STATUS_LABELS: Record<string, string> = {
  pending: 'Pendiente',
  processing: 'En preparación',
  shipped: 'Enviado',
  delivered: 'Entregado',
  cancelled: 'Cancelado',
}

export default async function MisPedidosPage() {
  const user = await getCurrentUser()

  if (!user) {
    return (
      <main className="flex flex-col items-center justify-center min-h-[60vh] px-[var(--space-6)] text-center">
        <div className="w-20 h-20 rounded-[var(--radius-full)] bg-bg-muted flex items-center justify-center mb-[var(--space-6)]">
          <Package className="w-9 h-9 text-text-tertiary" strokeWidth={1.5} aria-hidden="true" />
        </div>
        <h1 className="text-2xl md:text-3xl font-display font-medium text-text-primary mb-[var(--space-3)]">
          Tus pedidos te esperan
        </h1>
        <p className="text-sm text-text-secondary max-w-[var(--container-text)] mb-[var(--space-8)]">
          Para ver el historial de tus pedidos es necesario iniciar sesión.
        </p>
        <Link
          href="/login"
          className="inline-flex items-center justify-center h-[var(--height-btn-md)] px-[var(--space-6)] rounded-[var(--radius-md)] bg-brand-primary text-text-on-brand font-semibold text-sm hover:bg-brand-primary-hover transition-colors duration-[var(--duration-micro)]"
        >
          Ingresar
        </Link>
      </main>
    )
  }

  const orderRows = await db
    .select()
    .from(orders)
    .where(eq(orders.userId, user.id))
    .orderBy(desc(orders.createdAt))

  let items: (typeof orderItems.$inferSelect)[] = []
  if (orderRows.length > 0) {
    items = await db
      .select()
      .from(orderItems)
      .where(inArray(orderItems.orderId, orderRows.map((o) => o.id)))
  }

  if (orderRows.length === 0) {
    return (
      <main className="flex flex-col items-center justify-center min-h-[60vh] px-[var(--space-6)] text-center">
        <div className="w-20 h-20 rounded-[var(--radius-full)] bg-bg-muted flex items-center justify-center mb-[var(--space-6)]">
          <ShoppingBag className="w-9 h-9 text-text-tertiary" strokeWidth={1.5} aria-hidden="true" />
        </div>
        <h1 className="text-2xl md:text-3xl font-display font-medium text-text-primary mb-[var(--space-3)]">
          Todavía no hiciste ningún pedido
        </h1>
        <p className="text-sm text-text-secondary max-w-[var(--container-text)] mb-[var(--space-8)]">
          Cuando realices tu primera compra, vas a poder seguirla acá.
        </p>
        <Link
          href="/libros"
          className="inline-flex items-center justify-center h-[var(--height-btn-md)] px-[var(--space-6)] rounded-[var(--radius-md)] bg-brand-primary text-text-on-brand font-semibold text-sm hover:bg-brand-primary-hover transition-colors duration-[var(--duration-micro)]"
        >
          Explorar catálogo
        </Link>
      </main>
    )
  }

  return (
    <div className="mx-auto max-w-[var(--container-max)] px-[var(--space-4)] md:px-[var(--space-10)] lg:px-[var(--space-16)] py-[var(--space-10)] md:py-[var(--space-16)]">
      <h1 className="text-2xl md:text-4xl font-display font-normal text-text-primary tracking-[var(--tracking-4xl)] mb-[var(--space-2)]">
        Mis pedidos
      </h1>
      <p className="text-sm text-text-secondary mb-[var(--space-8)] md:mb-[var(--space-12)]">
        {orderRows.length} {orderRows.length === 1 ? 'pedido' : 'pedidos'} en total
      </p>

      <div className="flex flex-col gap-[var(--space-6)]">
        {orderRows.map((order) => {
          const orderDetailItems = items.filter((item) => item.orderId === order.id)
          return (
            <article
              key={order.id}
              className="bg-bg-surface border border-border-subtle rounded-[var(--radius-lg)] overflow-hidden"
            >
              <header className="flex flex-wrap items-center justify-between gap-[var(--space-3)] px-[var(--space-6)] py-[var(--space-4)] border-b border-border-subtle bg-bg-muted/50">
                <div>
                  <p className="text-base font-semibold text-text-primary">{order.id.slice(0, 8)}</p>
                  <p className="text-xs text-text-tertiary">
                    {new Date(order.createdAt).toLocaleDateString('es-AR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                </div>
                <span className="inline-flex items-center h-6 px-[10px] rounded-[var(--radius-sm)] text-xs font-semibold bg-badge-bestseller-bg text-badge-bestseller-text">
                  {STATUS_LABELS[order.status] ?? order.status}
                </span>
              </header>

              <div className="px-[var(--space-6)] py-[var(--space-4)]">
                <ul className="flex flex-col gap-[var(--space-2)] mb-[var(--space-4)]">
                  {orderDetailItems.map((item) => (
                    <li key={item.id} className="flex justify-between text-sm">
                      <span className="text-text-secondary">
                        {item.title} <span className="text-text-tertiary">× {item.quantity}</span>
                      </span>
                      <span className="font-medium text-text-primary">
                        {formatArs(item.price * item.quantity)}
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="flex justify-between items-center pt-[var(--space-3)] border-t border-border-subtle">
                  <span className="text-sm text-text-secondary">Total</span>
                  <span className="text-lg font-bold text-text-primary">{formatArs(order.total)}</span>
                </div>
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}