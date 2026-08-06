import Link from 'next/link'
import { Search } from 'lucide-react'

export default function NotFound() {
  return (
    <main className="flex flex-col items-center justify-center min-h-[70vh] px-[var(--space-6)] text-center">
      <div className="w-24 h-24 rounded-[var(--radius-full)] bg-bg-muted flex items-center justify-center mb-[var(--space-8)]">
        <svg
          className="w-12 h-12 text-text-tertiary"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
          <path d="M8 10h8" />
          <path d="M8 14h4" />
        </svg>
      </div>
      <h1 className="text-4xl md:text-5xl font-display font-medium text-text-primary mb-[var(--space-4)]">
        404
      </h1>
      <p className="text-lg text-text-secondary mb-[var(--space-2)]">
        Esta página se extravió entre las estanterías.
      </p>
      <p className="text-sm text-text-tertiary mb-[var(--space-8)]">
        Puede que el enlace sea incorrecto o que la página ya no exista.
      </p>
      <div className="flex flex-col sm:flex-row items-center gap-[var(--space-3)]">
        <Link
          href="/"
          className="inline-flex items-center justify-center h-[var(--height-btn-md)] px-[var(--space-6)] rounded-[var(--radius-md)] bg-brand-primary text-text-on-brand font-semibold text-sm hover:bg-brand-primary-hover transition-colors duration-[var(--duration-micro)]"
        >
          Volver al inicio
        </Link>
        <Link
          href="/libros"
          className="inline-flex items-center gap-[var(--space-2)] text-sm text-brand-primary font-medium hover:underline decoration-[1.5px] underline-offset-[3px]"
        >
          <Search className="w-4 h-4" />
          Explorar catálogo
        </Link>
      </div>
    </main>
  )
}
