'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-bg-muted rounded-[var(--radius-xl)] mx-[var(--space-6)] md:mx-[var(--space-10)] lg:mx-[var(--space-16)] my-[var(--space-8)]">
      <div className="grid grid-cols-1 lg:grid-cols-[55%_45%] min-h-[520px] md:min-h-[560px] lg:min-h-[640px]">
        <div className="flex flex-col justify-center p-[var(--space-8)] md:p-[var(--space-12)] lg:p-[var(--space-16)]">
          <p className="text-sm font-semibold text-accent-terracotta uppercase tracking-wider mb-[var(--space-4)] animate-[fadeInUp_500ms_ease-out]">
            COLECCIÓN OTOÑO 2026
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-medium text-text-primary tracking-[var(--tracking-6xl)] mb-[var(--space-6)] animate-[fadeInUp_500ms_ease-out_80ms]">
            Historias que se quedan contigo
          </h1>
          <p className="text-lg text-text-secondary max-w-[480px] mb-[var(--space-8)] animate-[fadeInUp_500ms_ease-out_160ms]">
            Descubre una selección curada de libros que transformarán tu perspectiva, alimentarán tu curiosidad y te acompañarán mucho después de la última página.
          </p>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-[var(--space-4)] animate-[fadeInUp_500ms_ease-out_240ms]">
            <Link href="/libros/colecciones/otono">
              <Button size="lg" icon={<ArrowRight className="w-5 h-5" />} iconPosition="right">
                Explorar colección
              </Button>
            </Link>
            <Link
              href="/libros/ofertas"
              className="text-sm font-medium text-brand-primary hover:underline decoration-[1.5px] underline-offset-[3px]"
            >
              Ver ofertas
            </Link>
          </div>
        </div>

        <div className="relative hidden lg:block animate-[scaleIn_700ms_ease-out]">
          <div className="absolute inset-0 bg-gradient-to-r from-bg-muted via-bg-muted/60 to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-0 flex items-center justify-center p-[var(--space-8)]">
            <div className="relative w-full max-w-[560px] aspect-[1490/1056]">
              <Image
                src="/foto-libros-chatgpt.webp"
                alt="Pila de libros de la colección"
                fill
                sizes="560px"
                priority
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
