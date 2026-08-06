import Link from 'next/link'

export function EditorialBanner() {
  return (
    <section className="py-[var(--space-16)]">
      <div className="mx-auto max-w-[var(--container-max)] px-[var(--space-6)] md:px-[var(--space-10)] lg:px-[var(--space-16)]">
        <div className="relative overflow-hidden rounded-[var(--radius-xl)] bg-gradient-to-br from-brand-primary to-brand-primary-hover min-h-[320px] md:min-h-[400px] flex items-center">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40" />
          
          <div className="relative z-10 px-[var(--space-8)] md:px-[var(--space-16)] py-[var(--space-12)] max-w-[640px]">
            <p className="text-sm font-semibold text-accent-gold uppercase tracking-wider mb-[var(--space-4)]">
              COLECCIÓN EDITORIAL
            </p>
            <h2 className="text-3xl md:text-5xl font-display font-medium text-text-on-brand tracking-[var(--tracking-5xl)] mb-[var(--space-6)]">
              Las voces que definen nuestra época
            </h2>
            <p className="text-base md:text-lg text-text-on-brand/80 mb-[var(--space-8)] max-w-[480px]">
              Una selección de obras que capturan el espíritu de nuestro tiempo. Ensayos, novelas y memorias que invitan a la reflexión.
            </p>
            <Link
              href="/libros/colecciones/voces-contemporaneas"
              className="inline-flex items-center justify-center h-[var(--height-btn-md)] px-[var(--space-6)] bg-bg-surface text-brand-primary font-semibold text-sm rounded-[var(--radius-md)] hover:bg-accent-terracotta hover:text-text-on-brand transition-all duration-[var(--duration-micro)]"
            >
              Descubrir colección
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
