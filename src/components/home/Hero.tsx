'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Leaf, Sparkles } from 'lucide-react'

const BADGES = [
  { label: 'Bestseller', className: 'top-[12%] left-[4%]' },
  { label: 'Novedad', className: 'bottom-[16%] right-[2%]' },
]

const LEAVES = [
  { className: 'top-[18%] left-[8%] w-6 h-6', delay: '0s', opacity: 0.4 },
  { className: 'top-[46%] left-[2%] w-4 h-4', delay: '1.2s', opacity: 0.3 },
  { className: 'bottom-[22%] left-[14%] w-5 h-5', delay: '2.4s', opacity: 0.35 },
  { className: 'top-[30%] right-[10%] w-5 h-5', delay: '0.8s', opacity: 0.25 },
]

export function Hero() {
  return (
    <section className="relative overflow-hidden rounded-[var(--radius-xl)] mx-[var(--space-6)] md:mx-[var(--space-10)] lg:mx-[var(--space-16)] my-[var(--space-8)]">
      {/* Fondo: gradiente otoñal sutil + textura de papel */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-[#F7EBDB] via-bg-muted to-[#EFDDBF]" />
        <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_85%_-10%,rgba(201,162,75,0.18),transparent_55%)]" />
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: "url('/paper-texture.svg')",
            backgroundSize: '240px 240px',
            mixBlendMode: 'multiply',
          }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[55%_45%] min-h-[520px] md:min-h-[560px] lg:min-h-[640px]">
        {/* Columna izquierda: contenido */}
        <div className="flex flex-col justify-center p-[var(--space-8)] md:p-[var(--space-12)] lg:p-[var(--space-16)]">
          <div className="flex items-center gap-[var(--space-3)] mb-[var(--space-4)] animate-[fadeInUp_500ms_ease-out]">
            <span className="inline-flex items-center gap-1.5 px-3 h-7 rounded-full bg-accent-forest text-accent-forest-light text-xs font-semibold tracking-wider uppercase">
              <Leaf className="w-3.5 h-3.5" aria-hidden="true" />
              Colección otoño
            </span>
            <span className="text-sm font-semibold text-accent-forest-dark uppercase tracking-wider">
              2026
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-medium text-text-primary tracking-[var(--tracking-6xl)] mb-[var(--space-6)] animate-[fadeInUp_500ms_ease-out_80ms]">
            Historias que se quedan contigo
          </h1>
          <p className="text-lg text-text-secondary max-w-[480px] mb-[var(--space-8)] animate-[fadeInUp_500ms_ease-out_160ms]">
            Descubre una selección curada de libros que transformarán tu perspectiva, alimentarán tu curiosidad y te acompañarán mucho después de la última página.
          </p>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-[var(--space-4)] animate-[fadeInUp_500ms_ease-out_240ms]">
            <Link
              href="/libros/otono"
              className="group inline-flex items-center justify-center font-semibold tracking-[0.01em] rounded-[var(--radius-md)] h-[var(--height-btn-lg)] px-[var(--space-6)] text-sm gap-[var(--space-2)] bg-brand-primary text-text-on-brand shadow-[var(--shadow-sm)] transition-all duration-[var(--duration-card)] ease-out hover:-translate-y-[2px] hover:bg-brand-primary-hover hover:shadow-[var(--shadow-md)] active:translate-y-0 active:scale-[0.98]"
            >
              Explorar colección
              <ArrowRight
                className="w-5 h-5 transition-transform duration-[var(--duration-card)] group-hover:translate-x-1"
                aria-hidden="true"
              />
            </Link>
            <Link
              href="/libros/ofertas"
              className="text-sm font-medium text-brand-primary hover:underline decoration-[1.5px] underline-offset-[3px] transition-colors duration-[var(--duration-card)]"
            >
              Ver ofertas
            </Link>
          </div>
        </div>

        {/* Columna derecha: pila de libros */}
        <div className="relative hidden lg:block animate-[scaleIn_700ms_ease-out]">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-bg-muted/10 to-transparent z-10 pointer-events-none" />

          {/* Hojas otoñales flotando */}
          {LEAVES.map((leaf, i) => (
            <Leaf
              key={i}
              className={`absolute text-accent-forest ${leaf.className} animate-[leaf-drift_9s_ease-in-out_infinite]`}
              style={{ animationDelay: leaf.delay, ['--leaf-opacity' as string]: leaf.opacity }}
              aria-hidden="true"
            />
          ))}

          {/* Pila de libros */}
          <div className="absolute inset-0 flex items-end justify-center p-[var(--space-8)] pb-[var(--space-12)]">
            <div className="group relative w-full max-w-[560px]">
              {/* Sombra realista en el piso */}
              <div className="absolute -bottom-[6px] left-1/2 -translate-x-1/2 w-[104%] h-16 -z-10" aria-hidden="true">
                <div className="absolute inset-0 bg-[#241E18]/[0.22] blur-2xl rounded-[50%]" />
                <div className="absolute inset-x-[8%] bottom-0 h-2 bg-[#241E18]/[0.25] blur-[6px] rounded-[50%]" />
                <div className="absolute inset-x-0 -bottom-2 h-[14px] bg-[#241E18]/[0.12] blur-xl rounded-[50%]" />
              </div>

              <div className="relative aspect-[1490/1056] transition-transform duration-[var(--duration-layout)] ease-out group-hover:scale-[1.03] group-hover:-rotate-1 will-change-transform">
                <Image
                  src="/foto-libros-chatgpt.webp"
                  alt="Pila de libros de la colección"
                  fill
                  sizes="560px"
                  priority
                  className="object-cover"
                />
              </div>

              {/* Badges sobre los libros */}
              {BADGES.map((badge) => (
                <span
                  key={badge.label}
                  className={`absolute ${badge.className} inline-flex items-center gap-1 px-3 h-7 rounded-full bg-text-on-brand text-accent-forest-dark text-xs font-semibold shadow-[var(--shadow-md)] border border-border-subtle transition-transform duration-[var(--duration-card)] group-hover:-translate-y-1`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-accent-gold" aria-hidden="true" />
                  {badge.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
