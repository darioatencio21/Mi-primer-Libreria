'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Search,
  Heart,
  User,
  ShoppingBag,
  Menu,
  X,
} from 'lucide-react'
import { NAV_ITEMS, SITE_NAME } from '@/lib/constants'
import { MegaMenu } from './MegaMenu'
import { SearchPanel } from '@/components/search/SearchPanel'
import { cn } from '@/lib/utils'

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const pathname = usePathname()

  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 80)
  }, [])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  return (
    <header
      className={cn(
        'sticky top-0 z-40 w-full transition-all duration-200',
        scrolled
          ? 'bg-bg-header/85 backdrop-blur-xl shadow-[var(--shadow-sm)] border-b border-border-subtle'
          : 'bg-bg-header border-b border-transparent'
      )}
    >
      <div className="mx-auto max-w-[var(--container-max)] px-[var(--space-6)] md:px-[var(--space-10)] lg:px-[var(--space-16)]">
        <div className="flex items-center justify-between h-[var(--height-header)]">
          <div className="flex items-center gap-[var(--space-4)]">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-[var(--space-2)] text-text-primary hover:text-brand-primary transition-colors duration-[var(--duration-micro)]"
              aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <Link
              href="/"
              className="flex items-center gap-[var(--space-2)] shrink-0"
              aria-label={`${SITE_NAME} - Inicio`}
            >
              <svg
                className="w-6 h-6 text-brand-primary"
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
              <span className="text-[22px] font-display font-medium text-brand-primary tracking-tight">
                {SITE_NAME}
              </span>
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
          className={cn(
            'hidden lg:flex items-center justify-center gap-[var(--space-8)] h-12 border-t border-border-subtle transition-all duration-200',
            scrolled && 'h-0 opacity-0 overflow-hidden border-0'
          )}
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
        <div className="lg:hidden fixed inset-0 top-[var(--height-header)] bg-bg-base z-30 animate-[fadeIn_200ms_ease-out]">
          <nav className="flex flex-col p-[var(--space-6)] gap-[var(--space-1)]" aria-label="Menú móvil">
            {NAV_ITEMS.map((item) => {
              const isHighlight = 'highlight' in item && item.highlight
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={cn(
                    'flex items-center py-[var(--space-4)] text-base font-medium border-b border-border-subtle transition-colors duration-[var(--duration-micro)]',
                    isHighlight
                      ? 'text-accent-terracotta'
                      : pathname === item.href
                      ? 'text-brand-primary'
                      : 'text-text-primary hover:text-brand-primary'
                  )}
                >
                  {item.label}
                </Link>
              )
            })}
            <div className="flex flex-col gap-[var(--space-3)] mt-[var(--space-6)]">
              <Link
                href="/cuenta"
                className="flex items-center gap-[var(--space-3)] py-[var(--space-3)] text-sm text-text-secondary hover:text-brand-primary"
              >
                <User className="w-5 h-5" /> Mi cuenta
              </Link>
            </div>
          </nav>
        </div>
      )}

      {searchOpen && (
        <SearchPanel isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      )}
    </header>
  )
}
