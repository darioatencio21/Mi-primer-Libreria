import Link from 'next/link'
import { SITE_NAME } from '@/lib/constants'

const FOOTER_LINKS = {
  comprar: [
    { label: 'Novedades', href: '/libros/novedades' },
    { label: 'Bestsellers', href: '/libros/bestsellers' },
    { label: 'Ofertas', href: '/libros/ofertas' },
    { label: 'Tarjetas de regalo', href: '/tarjetas-regalo' },
  ],
  ayuda: [
    { label: 'Preguntas frecuentes', href: '/ayuda/faq' },
    { label: 'Envíos', href: '/ayuda/envios' },
    { label: 'Devoluciones', href: '/ayuda/devoluciones' },
    { label: 'Contacto', href: '/ayuda/contacto' },
  ],
  empresa: [
    { label: 'Sobre nosotros', href: '/empresa/sobre-nosotros' },
    { label: 'Blog', href: '/blog' },
    { label: 'Trabaja con nosotros', href: '/empresa/empleo' },
    { label: 'Sostenibilidad', href: '/empresa/sostenibilidad' },
  ],
}

export function Footer() {
  return (
    <footer className="bg-bg-footer text-footer-text mt-auto">
      <div className="mx-auto max-w-[var(--container-max)] px-[var(--space-6)] md:px-[var(--space-10)] lg:px-[var(--space-16)] py-[var(--space-16)]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-[var(--space-10)] lg:gap-[var(--space-8)]">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-[var(--space-2)] mb-[var(--space-4)]">
              <svg
                className="w-6 h-6 text-text-on-brand"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
                <path d="M8 7h6" />
                <path d="M8 11h8" />
              </svg>
              <span className="text-[22px] font-display font-medium text-text-on-brand">
                {SITE_NAME}
              </span>
            </Link>
            <p className="text-sm text-footer-text max-w-[320px] mb-[var(--space-6)]">
              Librería online premium. Libros físicos, ebooks y audiolibros curados para lectores exigentes.
            </p>
            <div className="flex items-center gap-[var(--space-3)]">
              {['Instagram', 'Twitter', 'Facebook'].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="w-9 h-9 rounded-full border border-footer-text/30 flex items-center justify-center text-footer-text hover:bg-accent-gold hover:border-accent-gold hover:text-bg-footer transition-all duration-[var(--duration-micro)]"
                  aria-label={social}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <span className="text-xs font-bold">{social[0]}</span>
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-text-on-brand mb-[var(--space-4)]">
              Comprar
            </h3>
            <ul className="flex flex-col gap-[var(--space-3)]">
              {FOOTER_LINKS.comprar.map((link) => (
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
          </div>

          <div>
            <h3 className="text-sm font-semibold text-text-on-brand mb-[var(--space-4)]">
              Ayuda
            </h3>
            <ul className="flex flex-col gap-[var(--space-3)]">
              {FOOTER_LINKS.ayuda.map((link) => (
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
          </div>

          <div>
            <h3 className="text-sm font-semibold text-text-on-brand mb-[var(--space-4)]">
              Empresa
            </h3>
            <ul className="flex flex-col gap-[var(--space-3)]">
              {FOOTER_LINKS.empresa.map((link) => (
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
          </div>
        </div>
      </div>

      <div className="border-t border-footer-divider">
        <div className="mx-auto max-w-[var(--container-max)] px-[var(--space-6)] md:px-[var(--space-10)] lg:px-[var(--space-16)] py-[var(--space-6)]">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-[var(--space-4)]">
            <p className="text-xs text-footer-legal">
              © 2026 {SITE_NAME}. Todos los derechos reservados.
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
