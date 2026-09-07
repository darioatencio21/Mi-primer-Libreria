import Link from 'next/link'
import Image from 'next/image'
import { SITE_NAME } from '@/lib/constants'

const FOOTER_LINKS = {
  comprar: [
    { label: 'Novedades', href: '/libros/novedades' },
    { label: 'Bestsellers', href: '/libros/bestsellers' },
    { label: 'Ofertas', href: '/libros/ofertas' },
  ],
  ayuda: [
    { label: 'Preguntas frecuentes', href: '/ayuda/faq' },
    { label: 'Contacto', href: '/ayuda/contacto' },
  ],
  empresa: [
    { label: 'Sobre nosotros', href: '/empresa/sobre-nosotros' },
    { label: 'Blog', href: '/blog' },
  ],
}

function LinkColumn({
  title,
  links,
}: {
  title: string
  links: { label: string; href: string }[]
}) {
  return (
    <nav aria-label={title}>
      <h3 className="text-xs font-semibold uppercase tracking-[var(--tracking-xs)] text-text-on-brand/70 mb-[var(--space-3)]">
        {title}
      </h3>
      <ul className="flex flex-col gap-[var(--space-3)]">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="text-sm text-footer-text hover:text-accent-gold transition-colors duration-[var(--duration-micro)]"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export function Footer() {
  return (
    <footer className="bg-bg-footer text-footer-text mt-auto">
      <div className="mx-auto max-w-[var(--container-max)] px-[var(--space-6)] md:px-[var(--space-10)] lg:px-[var(--space-16)] py-[var(--space-10)] md:py-[var(--space-16)]">
        <div className="grid grid-cols-2 gap-x-[var(--space-8)] gap-y-[var(--space-10)] lg:grid-cols-5 lg:gap-[var(--space-8)]">
          <div className="col-span-2 lg:col-span-2">
            <Link href="/" className="flex items-center mb-[var(--space-4)]">
              <Image
                src="/logo.png"
                alt={SITE_NAME}
                width={1254}
                height={1254}
                className="h-10 md:h-12 w-auto object-contain"
              />
            </Link>
            <p className="text-sm text-footer-text max-w-[320px] mb-[var(--space-6)]">
              Librería online premium. Libros físicos, ebooks y audiolibros curados para lectores exigentes.
            </p>
            <div className="flex items-center gap-[var(--space-3)]">
              <a
                href="https://instagram.com"
                className="w-10 h-10 md:w-11 md:h-11 rounded-full border border-footer-text/30 flex items-center justify-center text-footer-text hover:bg-accent-gold hover:border-accent-gold hover:text-bg-footer transition-all duration-[var(--duration-micro)]"
                aria-label="Instagram de Tus Libros Ya"
                rel="noopener noreferrer"
                target="_blank"
              >
                <InstagramGlyph className="w-5 h-5" />
              </a>
              <a
                href="https://x.com"
                className="w-10 h-10 md:w-11 md:h-11 rounded-full border border-footer-text/30 flex items-center justify-center text-footer-text hover:bg-accent-gold hover:border-accent-gold hover:text-bg-footer transition-all duration-[var(--duration-micro)]"
                aria-label="X de Tus Libros Ya"
                rel="noopener noreferrer"
                target="_blank"
              >
                <XGlyph className="w-5 h-5" />
              </a>
              <a
                href="https://facebook.com"
                className="w-10 h-10 md:w-11 md:h-11 rounded-full border border-footer-text/30 flex items-center justify-center text-footer-text hover:bg-accent-gold hover:border-accent-gold hover:text-bg-footer transition-all duration-[var(--duration-micro)]"
                aria-label="Facebook de Tus Libros Ya"
                rel="noopener noreferrer"
                target="_blank"
              >
                <FacebookGlyph className="w-5 h-5" />
              </a>
            </div>
          </div>

          <LinkColumn title="Comprar" links={FOOTER_LINKS.comprar} />

          <div className="flex flex-col gap-y-[var(--space-10)] lg:contents">
            <div className="lg:col-span-1">
              <LinkColumn title="Ayuda" links={FOOTER_LINKS.ayuda} />
            </div>
            <div className="lg:col-span-1">
              <LinkColumn title="Empresa" links={FOOTER_LINKS.empresa} />
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-footer-divider">
        <div className="mx-auto max-w-[var(--container-max)] px-[var(--space-6)] md:px-[var(--space-10)] lg:px-[var(--space-16)] pt-[var(--space-5)] pb-[calc(var(--space-5)+env(safe-area-inset-bottom))] sm:pb-[var(--space-5)]">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-[var(--space-3)]">
            <p className="text-xs text-footer-legal">
              © 2026 Estudio Camaleón. Todos los derechos reservados.
            </p>
            <div className="flex items-center gap-[var(--space-6)]">
              <Link href="/legal/terminos" className="text-xs text-footer-legal hover:text-text-on-brand transition-colors duration-[var(--duration-micro)]">
                Términos
              </Link>
              <Link href="/legal/privacidad" className="text-xs text-footer-legal hover:text-text-on-brand transition-colors duration-[var(--duration-micro)]">
                Privacidad
              </Link>
              <Link href="/legal/cookies" className="text-xs text-footer-legal hover:text-text-on-brand transition-colors duration-[var(--duration-micro)]">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

function InstagramGlyph({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  )
}

function XGlyph({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.9 2.06h3.68l-8.04 9.19L24 21.94h-7.41l-5.8-7.58-6.64 7.58H.47l8.6-9.83L0 2.06h7.6l5.24 6.93zM17.61 19.93h2.04L6.49 3.99H4.3z" />
    </svg>
  )
}

function FacebookGlyph({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M22 12.06C22 6.49 17.52 2 12 2S2 6.49 2 12.06c0 5.02 3.66 9.19 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.52 1.49-3.91 3.78-3.91 1.09 0 2.24.2 2.24.2v2.47H15.2c-1.24 0-1.63.78-1.63 1.57v1.88h2.78l-.45 2.9h-2.33V22c4.78-.75 8.44-4.92 8.44-9.94Z" />
    </svg>
  )
}
