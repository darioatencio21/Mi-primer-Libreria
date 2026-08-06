'use client'

import Link from 'next/link'
import { AlertCircle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export default function Error({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <main className="flex flex-col items-center justify-center min-h-[70vh] px-[var(--space-6)] text-center">
      <div className="w-24 h-24 rounded-[var(--radius-full)] bg-error-bg flex items-center justify-center mb-[var(--space-8)]">
        <AlertCircle className="w-12 h-12 text-error" strokeWidth={1.5} aria-hidden="true" />
      </div>
      <h1 className="text-4xl md:text-5xl font-display font-medium text-text-primary mb-[var(--space-4)]">
        Algo salió mal
      </h1>
      <p className="text-lg text-text-secondary mb-[var(--space-2)]">
        Algo salió mal de nuestro lado.
      </p>
      <p className="text-sm text-text-tertiary mb-[var(--space-8)] max-w-[var(--container-text)]">
        Estamos trabajando para resolverlo. Intenta de nuevo en unos momentos.
      </p>
      <div className="flex flex-col sm:flex-row items-center gap-[var(--space-3)]">
        <Button onClick={reset} icon={<RefreshCw className="w-5 h-5" />}>
          Reintentar
        </Button>
        <Link href="/">
          <Button variant="ghost">Volver al inicio</Button>
        </Link>
      </div>
    </main>
  )
}
