'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import {
  Search,
  Heart,
  User,
  ShoppingBag,
  Menu,
  X,
  ChevronRight,
} from 'lucide-react'
import { NAV_ITEMS, CATEGORIES, SITE_NAME } from '@/lib/constants'
import { MegaMenu } from './MegaMenu'
import { SearchPanel } from '@/components/search/SearchPanel'
import { cn } from '@/lib/utils'

const MOBILE_LINKS = [
  { label: 'Inicio', href: '/' },
  { label: 'Revistas', href: '/libros/revistas' },
  { label: 'Libros de Texto', href: '/libros/academico' },
  { label: 'Audiolibros', href: '/libros/audiolibros' },
  { label: 'Recomendados', href: '/libros/recomendados' },
]

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const pathname = usePathname()

  const handleScroll = useCallback(() => {
    const y = window.scrollY
    setScrolled((prev) => {
      if (prev && y < 60) return false
      if (!prev && y > 100) return true
      return prev
    })
  }, [])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  useEffect(() => {
    if (mobileMenuOpen) {
      const original = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = original
      }
    }
  }, [mobileMenuOpen])

  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  return (
    <header
      className={cn(
        'sticky top-0 z-40 w-full bg-bg-header transition-[box-shadow,border-color] duration-200',
        scrolled && 'shadow-[var(--shadow-sm)] border-b border-border-subtle'
      )}
    >
      <div className="mx-auto max-w-[var(--container-max)] px-[var(--space-4)] md:px-[var(--space-10)] lg:px-[var(--space-16)]">
        <div className="flex items-center justify-between h-[var(--height-header)]">
          <div className="flex items-center gap-[var(--space-2)] md:gap-[var(--space-4)]">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-[var(--space-2)] -ml-[var(--space-2)] text-text-primary hover:text-brand-primary transition-colors duration-[var(--duration-micro)]"
              aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <Link
              href="/"
              className="flex items-center shrink-0"
              aria-label={`${SITE_NAME} - Inicio`}
            >
              <Image
                src="/logo.png"
                alt={SITE_NAME}
                width={1254}
                height={1254}
                priority
                className="h-9 md:h-10 w-auto object-contain"
              />
            </Link>
          </div>

          <div className="hidden md:flex flex-1 max-w-[560px] mx-[var(--space-8)]">
            <button
              onClick={() => setSearchOpen(true)}
              className="w-full h-[var(--height-search)] flex items-center gap-[var(--space-3)] px-[var(--space-4)] bg-bg-muted rounded-[var(--radius-md)] text-text-tertiary text-sm transition-all duration-[var(--duration-micro)] hover:bg-bg-muted/80"
              aria-label="Buscar libros"
            >
              <Search className="w-5 h-5 shrink-0" aria-hidden="true" />
              <span>Busca por título, autor, ISBN o editorial...</span>
            </button>
          </div>

          <div className="flex items-center gap-[var(--space-1)]">
            <button
              onClick={() => setSearchOpen(true)}
              className="md:hidden p-[var(--space-2)] text-text-primary hover:text-brand-primary hover:scale-105 transition-all duration-[var(--duration-micro)]"
              aria-label="Buscar"
            >
              <Search className="w-6 h-6" />
            </button>
            <Link
              href="/wishlist"
              className="relative p-[var(--space-2)] text-text-primary hover:text-brand-primary hover:scale-105 transition-all duration-[var(--duration-micro)]"
              aria-label="Lista de deseos"
            >
              <Heart className="w-6 h-6" strokeWidth={1.5} />
            </Link>
            <Link
              href="/cuenta"
              className="hidden sm:flex p-[var(--space-2)] text-text-primary hover:text-brand-primary hover:scale-105 transition-all duration-[var(--duration-micro)]"
              aria-label="Mi cuenta"
            >
              <User className="w-6 h-6" strokeWidth={1.5} />
            </Link>
            <Link
              href="/carrito"
              className="relative p-[var(--space-2)] text-text-primary hover:text-brand-primary hover:scale-105 transition-all duration-[var(--duration-micro)]"
              aria-label="Carrito de compras"
            >
              <ShoppingBag className="w-6 h-6" strokeWidth={1.5} />
            </Link>
          </div>
        </div>

        <nav
          className="hidden lg:flex items-center justify-center gap-[var(--space-8)] h-12 border-t border-border-subtle"
          aria-label="Navegación principal"
        >
              {NAV_ITEMS.map((item) => {
                const hasMegaMenu = 'hasMegaMenu' in item && item.hasMegaMenu
                const isHighlight = 'highlight' in item && item.highlight

                return hasMegaMenu ? (
                  <MegaMenu key={item.label} />
                ) : (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={cn(
                      'relative text-sm font-medium transition-colors duration-[var(--duration-micro)] py-[var(--space-3)]',
                      isHighlight
                        ? 'text-accent-terracotta hover:text-accent-terracotta/80'
                        : pathname === item.href
                        ? 'text-brand-primary'
                        : 'text-text-secondary hover:text-text-primary'
                    )}
                  >
                    {item.label}
                    {pathname === item.href && (
                      <span
                        className="absolute bottom-0 left-0 right-0 h-[2px] bg-brand-primary"
                        aria-hidden="true"
                      />
                    )}
                  </Link>
                )
              })}
            </nav>
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-[var(--height-header)] bg-bg-base/40 backdrop-blur-sm z-30 md:hidden" onClick={() => setMobileMenuOpen(false)}>
          <aside
            role="dialog"
            aria-modal="true"
            aria-label="Menú de navegación"
            onClick={(e) => e.stopPropagation()}
            className="absolute left-0 top-0 h-full w-[min(88vw,360px)] bg-bg-surface shadow-[var(--shadow-xl)] flex flex-col animate-[menuSlideIn_220ms_ease-out]"
          >
            <div className="px-[var(--space-6)] pt-[var(--space-5)]">
              <button
                onClick={() => setSearchOpen(true)}
                className="w-full h-10 flex items-center gap-[var(--space-2)] px-[var(--space-3)] bg-bg-muted rounded-[var(--radius-md)] text-text-tertiary text-sm"
                aria-label="Buscar libros"
              >
                <Search className="w-4 h-4" aria-hidden="true" />
                <span>Buscar libros...</span>
              </button>
            </div>

            <div className="overflow-y-auto flex-1 px-[var(--space-4)] py-[var(--space-4)]">
              <ul className="flex flex-col">
                {MOBILE_LINKS.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className={cn(
                        'flex items-center justify-between py-[var(--space-3)] text-base font-medium border-b border-border-subtle/70 transition-colors duration-[var(--duration-micro)]',
                        pathname === item.href
                          ? 'text-brand-primary'
                          : 'text-text-primary hover:text-brand-primary'
                      )}
                    >
                      {item.label}
                      <ChevronRight className="w-4 h-4 text-text-tertiary" aria-hidden="true" />
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    href="/libros/ofertas"
                    className="flex items-center justify-between py-[var(--space-3)] text-base font-semibold text-accent-terracotta border-b border-border-subtle/70"
                  >
                    Ofertas
                    <ChevronRight className="w-4 h-4" aria-hidden="true" />
                  </Link>
                </li>
              </ul>

              <div className="mt-[var(--space-6)]">
                <p className="text-xs font-semibold uppercase tracking-[var(--tracking-xs)] text-text-tertiary mb-[var(--space-3)] px-[var(--space-2)]">
                  Categorías
                </p>
                <div className="grid grid-cols-2 gap-[var(--space-2)]">
                  {CATEGORIES.map((cat) => (
                    <Link
                      key={cat.slug}
                      href={`/libros/${cat.slug}`}
                      className="text-sm text-text-secondary hover:text-brand-primary hover:bg-bg-muted rounded-[var(--radius-sm)] px-[var(--space-3)] py-[var(--space-2)] transition-colors duration-[var(--duration-micro)]"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <div className="px-[var(--space-4)] py-[var(--space-4)] border-t border-border-subtle">
              <Link
                href="/cuenta"
                className="flex items-center gap-[var(--space-3)] px-[var(--space-2)] py-[var(--space-2)] text-sm font-medium text-text-primary hover:text-brand-primary"
              >
                <User className="w-5 h-5" /> Mi cuenta
              </Link>
            </div>
          </aside>
        </div>
      )}

      {searchOpen && (
        <SearchPanel isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      )}
    </header>
  )
}
