'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useCart, selectItemCount, useUi } from '@/lib/store'
import {
  Search,
  Heart,
  User,
  ShoppingBag,
  Menu,
  X,
  ChevronRight,
  ChevronDown,
  Home,
  Newspaper,
  BookOpen,
  Headphones,
  Star,
  Tag,
  HelpCircle,
  Mail,
  Info,
  PenLine,
  type LucideIcon,
} from 'lucide-react'
import { NAV_ITEMS, CATEGORIES, SITE_NAME } from '@/lib/constants'
import { MegaMenu } from './MegaMenu'
import { SearchPanel } from '@/components/search/SearchPanel'
import { cn } from '@/lib/utils'

interface MobileLink {
  label: string
  href: string
  icon: LucideIcon
  highlight?: boolean
}

const MOBILE_SECTIONS: {
  id: string
  label: string
  icon: LucideIcon
  type: 'list' | 'grid'
  links?: MobileLink[]
}[] = [
  {
    id: 'comprar',
    label: 'Comprar',
    icon: ShoppingBag,
    type: 'list',
    links: [
      { label: 'Inicio', href: '/', icon: Home },
      { label: 'Revistas', href: '/libros/revistas', icon: Newspaper },
      { label: 'Libros de Texto', href: '/libros/academico', icon: BookOpen },
      { label: 'Audiolibros', href: '/libros/audiolibros', icon: Headphones },
      { label: 'Recomendados', href: '/libros/recomendados', icon: Star },
      { label: 'Ofertas', href: '/libros/ofertas', icon: Tag, highlight: true },
    ],
  },
  { id: 'categorias', label: 'Categorías', icon: BookOpen, type: 'grid' },
  {
    id: 'ayuda',
    label: 'Ayuda',
    icon: HelpCircle,
    type: 'list',
    links: [
      { label: 'Preguntas frecuentes', href: '/ayuda/faq', icon: HelpCircle },
      { label: 'Contacto', href: '/ayuda/contacto', icon: Mail },
    ],
  },
  {
    id: 'empresa',
    label: 'Empresa',
    icon: Info,
    type: 'list',
    links: [
      { label: 'Sobre nosotros', href: '/empresa/sobre-nosotros', icon: Info },
      { label: 'Blog', href: '/blog', icon: PenLine },
    ],
  },
]

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [openSection, setOpenSection] = useState<string | null>('comprar')
  const [searchOpen, setSearchOpen] = useState(false)
  const mobileMenuRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  const openCart = useUi((state) => state.openCart)
  const itemCount = useCart((state) => selectItemCount(state.items))

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
    if (!mobileMenuOpen) return

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false)
        return
      }
      if (e.key !== 'Tab' || !mobileMenuRef.current) return
      const focusable = mobileMenuRef.current.querySelectorAll<HTMLElement>(
        'a[href], button, input, [tabindex]:not([tabindex="-1"])'
      )
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last?.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first?.focus()
      }
    }

    const timer = setTimeout(() => {
      mobileMenuRef.current
        ?.querySelector<HTMLButtonElement>('button[data-close-menu]')
        ?.focus()
    }, 50)

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      clearTimeout(timer)
    }
  }, [mobileMenuOpen])

  const [prevPathname, setPrevPathname] = useState(pathname)
  if (prevPathname !== pathname) {
    setPrevPathname(pathname)
    setMobileMenuOpen(false)
  }

  return (
    <header
      className={cn(
        'sticky top-0 z-40 w-full bg-bg-header transition-[box-shadow,border-color] duration-200',
        scrolled && 'shadow-[var(--shadow-sm)] border-b border-border-subtle'
      )}
    >
      <div className="w-full flex items-center h-[var(--height-header)]">
        <div className="mx-auto max-w-[var(--container-max)] w-full h-full flex items-center justify-between px-[var(--space-4)] md:px-[var(--space-10)] lg:px-[var(--space-16)]">
          <div className="flex items-center gap-[var(--space-2)] md:gap-[var(--space-4)]">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2.5 -ml-[var(--space-2)] text-text-primary hover:text-brand-primary transition-colors duration-[var(--duration-micro)]"
              aria-label="Abrir menú"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
            >
              <Menu className="w-6 h-6" />
            </button>

            <Link
              href="/"
              onClick={() => {
                if (pathname === '/') {
                  window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
                }
              }}
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
        </div>

          <div className="flex items-center gap-[var(--space-1)] ml-auto pr-[var(--space-1)] md:pr-[var(--space-10)] lg:pr-[var(--space-16)]">
            <button
              onClick={() => setSearchOpen(true)}
              className="md:hidden p-2.5 text-text-primary hover:text-brand-primary hover:scale-105 transition-all duration-[var(--duration-micro)]"
              aria-label="Buscar"
            >
              <Search className="w-6 h-6" />
            </button>
            <Link
              href="/wishlist"
              className="relative p-2.5 text-text-primary hover:text-brand-primary hover:scale-105 transition-all duration-[var(--duration-micro)]"
              aria-label="Lista de deseos"
            >
              <Heart className="w-6 h-6" strokeWidth={1.5} />
            </Link>
            <Link
              href="/cuenta"
              className="hidden sm:flex p-2.5 text-text-primary hover:text-brand-primary hover:scale-105 transition-all duration-[var(--duration-micro)]"
              aria-label="Mi cuenta"
            >
              <User className="w-6 h-6" strokeWidth={1.5} />
            </Link>
            <button
              onClick={openCart}
              className="relative p-2.5 text-text-primary hover:text-brand-primary hover:scale-105 transition-all duration-[var(--duration-micro)]"
              aria-label={`Abrir carrito de compras${itemCount > 0 ? `, ${itemCount} artículos` : ''}`}
            >
              <ShoppingBag className="w-6 h-6" strokeWidth={1.5} />
              {itemCount > 0 && (
                <span className="absolute top-[2px] right-[2px] min-w-[18px] h-[18px] px-[5px] rounded-[var(--radius-full)] bg-brand-primary text-text-on-brand text-[11px] font-semibold flex items-center justify-center">
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </button>
          </div>
      </div>

      <nav
        className="hidden lg:flex items-center justify-center gap-[var(--space-8)] h-12 px-[var(--space-4)] border-t border-border-subtle bg-bg-header w-full"
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

      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-bg-base/40 backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        >
          <aside
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menú de navegación"
            ref={mobileMenuRef}
            onClick={(e) => e.stopPropagation()}
            className="absolute left-0 top-0 h-full w-[min(90vw,380px)] bg-bg-surface shadow-[var(--shadow-xl)] flex flex-col animate-[menuSlideIn_220ms_ease-out]"
          >
            <div className="flex items-center justify-between px-[var(--space-2)] pl-[var(--space-6)] pr-[var(--space-6)] py-[var(--space-3)] border-b border-border-subtle shrink-0">
              <span className="text-base font-semibold text-text-primary">Menú</span>
              <button
                data-close-menu
                onClick={() => setMobileMenuOpen(false)}
                className="w-11 h-11 flex items-center justify-center text-text-primary hover:text-brand-primary hover:bg-bg-muted rounded-[var(--radius-md)] transition-colors duration-[var(--duration-micro)]"
                aria-label="Cerrar menú"
              >
                <X className="w-6 h-6" aria-hidden="true" />
              </button>
            </div>

            <div className="px-[var(--space-6)] pt-[var(--space-4)] shrink-0">
              <button
                onClick={() => {
                  setMobileMenuOpen(false)
                  setSearchOpen(true)
                }}
                className="w-full h-10 flex items-center gap-[var(--space-2)] px-[var(--space-3)] bg-bg-muted rounded-[var(--radius-md)] text-text-tertiary text-sm"
                aria-label="Buscar libros"
              >
                <Search className="w-4 h-4" aria-hidden="true" />
                <span>Buscar libros...</span>
              </button>
            </div>

            <nav className="overflow-y-auto flex-1 px-[var(--space-3)] pt-[var(--space-3)]" aria-label="Navegación principal móvil">
              {MOBILE_SECTIONS.map((section) => {
                const active = openSection === section.id
                return (
                  <div key={section.id}>
                    <button
                      type="button"
                      onClick={() => setOpenSection(active ? null : section.id)}
                      aria-expanded={active}
                      aria-controls={`mobile-section-${section.id}`}
                      className="w-full flex items-center justify-between px-[var(--space-3)] py-[var(--space-4)] min-h-[44px]"
                    >
                      <span className="flex items-center gap-[var(--space-2)] text-xs font-semibold uppercase tracking-[var(--tracking-xs)] text-text-tertiary">
                        <section.icon className="w-4 h-4" aria-hidden="true" />
                        {section.label}
                      </span>
                      <ChevronDown
                        className={cn(
                          'w-4 h-4 text-text-tertiary transition-transform duration-200',
                          active && 'rotate-180'
                        )}
                        aria-hidden="true"
                      />
                    </button>
                    <div
                      id={`mobile-section-${section.id}`}
                      className={cn(
                        'grid transition-[grid-template-rows] duration-300 ease-out',
                        active ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                      )}
                    >
                      <div className="overflow-hidden">
                        {section.type === 'grid' ? (
                          <div className="grid grid-cols-2 gap-[var(--space-2)] px-[var(--space-2)] pb-[var(--space-3)]">
                            {CATEGORIES.map((cat) => (
                              <Link
                                key={cat.slug}
                                href={`/libros/${cat.slug}`}
                                onClick={() => setMobileMenuOpen(false)}
                                className="text-sm text-text-secondary hover:text-brand-primary hover:bg-bg-muted rounded-[var(--radius-sm)] px-[var(--space-3)] py-[var(--space-2)] min-h-[44px] flex items-center gap-[var(--space-3)] transition-colors duration-[var(--duration-micro)]"
                              >
                                <span className="relative w-10 h-10 rounded-lg overflow-hidden bg-bg-muted shrink-0">
                                  <Image
                                    src={`/categories/${cat.slug}.webp`}
                                    alt=""
                                    fill
                                    sizes="40px"
                                    className="object-cover"
                                  />
                                </span>
                                {cat.name}
                              </Link>
                            ))}
                          </div>
                        ) : (
                          <ul className="flex flex-col pb-[var(--space-3)]">
                            {section.links?.map((link) => {
                              const isActive = pathname === link.href
                              return (
                                <li key={link.label}>
                                  <Link
                                    href={link.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    aria-current={isActive ? 'page' : undefined}
                                    className={cn(
                                      'flex items-center gap-[var(--space-3)] min-h-[44px] px-[var(--space-3)] py-[var(--space-2)] text-[15px] rounded-[var(--radius-sm)] transition-colors duration-[var(--duration-micro)]',
                                      link.highlight
                                        ? 'font-semibold text-accent-terracotta'
                                        : isActive
                                          ? 'font-semibold text-brand-primary bg-brand-primary-light/40'
                                          : 'font-medium text-text-primary hover:text-brand-primary hover:bg-bg-muted'
                                    )}
                                  >
                                    <link.icon className="w-4 h-4" aria-hidden="true" />
                                    {link.label}
                                    <ChevronRight
                                      className={cn(
                                        'w-4 h-4 ml-auto',
                                        link.highlight ? 'text-accent-terracotta' : 'text-text-tertiary'
                                      )}
                                      aria-hidden="true"
                                    />
                                  </Link>
                                </li>
                              )
                            })}
                          </ul>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </nav>

            <div className="px-[var(--space-4)] pt-[var(--space-3)] pb-[calc(var(--space-4)+env(safe-area-inset-bottom))] border-t border-border-subtle shrink-0">
              <Link
                href="/cuenta"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-[var(--space-3)] px-[var(--space-2)] py-[var(--space-3)] min-h-[44px] text-sm font-medium text-text-primary hover:text-brand-primary"
              >
                <User className="w-5 h-5" /> Mi cuenta
                <ChevronRight className="w-4 h-4 text-text-tertiary ml-auto" aria-hidden="true" />
              </Link>
              <div className="flex items-center justify-center gap-[var(--space-3)] mt-[var(--space-4)]">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram de Tus Libros Ya"
                  className="w-10 h-10 flex items-center justify-center rounded-[var(--radius-full)] border border-border-subtle text-text-secondary hover:text-brand-primary hover:border-brand-primary transition-colors duration-150"
                >
                  <InstagramGlyph className="w-5 h-5" />
                </a>
                <a
                  href="https://x.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="X de Tus Libros Ya"
                  className="w-10 h-10 flex items-center justify-center rounded-[var(--radius-full)] border border-border-subtle text-text-secondary hover:text-brand-primary hover:border-brand-primary transition-colors duration-150"
                >
                  <XGlyph className="w-5 h-5" />
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook de Tus Libros Ya"
                  className="w-10 h-10 flex items-center justify-center rounded-[var(--radius-full)] border border-border-subtle text-text-secondary hover:text-brand-primary hover:border-brand-primary transition-colors duration-150"
                >
                  <FacebookGlyph className="w-5 h-5" />
                </a>
              </div>
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
