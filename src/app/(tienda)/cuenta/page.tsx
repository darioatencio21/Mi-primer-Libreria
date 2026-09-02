import Link from 'next/link'
import type { Metadata } from 'next'
import { User } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Mi cuenta',
  description: 'Accedé a tu cuenta de Nova Books.',
}

export default function CuentaPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-[70vh] px-[var(--space-6)] text-center">
      <div className="w-20 h-20 rounded-[var(--radius-full)] bg-bg-muted flex items-center justify-center mb-[var(--space-6)]">
        <User className="w-9 h-9 text-text-tertiary" strokeWidth={1.5} aria-hidden="true" />
      </div>
      <h1 className="text-2xl md:text-3xl font-display font-medium text-text-primary mb-[var(--space-3)]">
        Mi cuenta
      </h1>
      <p className="text-sm text-text-secondary max-w-[var(--container-text)] mb-[var(--space-8)]">
        La gestión de cuenta está en camino. Muy pronto vas a poder ver tus pedidos, direcciones y preferencias en un solo lugar.
      </p>
      <Link
        href="/"
        className="inline-flex items-center justify-center h-[var(--height-btn-md)] px-[var(--space-6)] rounded-[var(--radius-md)] bg-brand-primary text-text-on-brand font-semibold text-sm hover:bg-brand-primary-hover transition-colors duration-[var(--duration-micro)]"
      >
        Volver al inicio
      </Link>
    </main>
  )
}