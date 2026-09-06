'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Sparkles, Truck, Users, Leaf, type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Value {
  icon: LucideIcon
  title: string
  description: string
}

const VALUES: Value[] = [
  {
    icon: Sparkles,
    title: 'Curaduría experta',
    description: 'Cada libro es seleccionado por nuestro equipo de libreros con décadas de experiencia.',
  },
  {
    icon: Truck,
    title: 'Envío cuidado',
    description: 'Empaquetamos cada libro con materiales sostenibles para que llegue perfecto.',
  },
  {
    icon: Users,
    title: 'Comunidad lectora',
    description: 'Más de 50,000 lectores confían en nosotros para descubrir su próxima lectura.',
  },
  {
    icon: Leaf,
    title: 'Compromiso sostenible',
    description: 'Plantamos un árbol por cada 100 libros vendidos. Ya hemos plantado más de 2,000.',
  },
]

export function WhyUsSection() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [activeDot, setActiveDot] = useState(0)
  const [visible, setVisible] = useState<number[]>(() =>
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ? VALUES.map((_, i) => i)
      : []
  )

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const cards = el.querySelectorAll<HTMLElement>('[data-index]')
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Number((entry.target as HTMLElement).dataset.index)
            setVisible((prev) => (prev.includes(idx) ? prev : [...prev, idx]))
            obs.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.15 }
    )
    cards.forEach((card) => obs.observe(card))
    return () => obs.disconnect()
  }, [])

  const handleScroll = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    const children = Array.from(el.children)
    const containerLeft = el.getBoundingClientRect().left
    let idx = 0
    for (let i = 0; i < children.length; i++) {
      const left = (children[i] as HTMLElement).getBoundingClientRect().left
      if (left >= containerLeft - 4) {
        idx = i
        break
      }
      idx = i
    }
    setActiveDot(idx)
  }, [])

  const scrollToDot = (index: number) => {
    const el = scrollRef.current
    if (!el) return
    const child = el.children[index] as HTMLElement | undefined
    child?.scrollIntoView({ behavior: 'smooth', inline: 'start' })
    setActiveDot(index)
  }

  return (
    <section className="py-[var(--space-24)] bg-bg-muted">
      <div className="mx-auto max-w-[var(--container-max)] px-[var(--space-6)] md:px-[var(--space-10)] lg:px-[var(--space-16)]">
        <div className="text-center mb-[var(--space-10)] md:mb-[var(--space-12)]">
          <h2 className="text-2xl md:text-4xl font-display font-normal text-text-primary tracking-[var(--tracking-4xl)] mb-[var(--space-4)]">
            Por qué Tus Libros Ya
          </h2>
          <p className="text-base text-text-secondary max-w-[var(--container-text)] mx-auto">
            No somos solo una librería online. Somos un espacio curado para lectores que valoran tanto el contenido como la experiencia.
          </p>
        </div>

        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide gap-[var(--space-4)] scroll-smooth sm:grid sm:grid-cols-2 sm:gap-[var(--space-6)] sm:overflow-visible sm:snap-none lg:grid-cols-4"
        >
          {VALUES.map((value, index) => {
            const Icon = value.icon
            const shown = visible.includes(index)
            return (
              <article
                key={value.title}
                data-index={index}
                className={cn(
                  'snap-start shrink-0 w-[78%] max-w-[340px] text-left bg-bg-surface border border-border-subtle rounded-[var(--radius-lg)] p-[var(--space-5)] sm:w-auto sm:max-w-none',
                  'transition-all duration-500 ease-out',
                  shown ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                )}
              >
                <div className="w-12 h-12 rounded-full bg-brand-primary/10 flex items-center justify-center mb-[var(--space-4)]">
                  <Icon className="w-6 h-6 text-brand-primary" strokeWidth={1.5} aria-hidden="true" />
                </div>
                <h3 className="text-[15px] font-semibold text-text-primary mb-[var(--space-2)]">
                  {value.title}
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed">{value.description}</p>
              </article>
            )
          })}
        </div>

        <div className="flex items-center justify-center gap-[var(--space-2)] mt-[var(--space-6)] sm:hidden">
          {VALUES.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => scrollToDot(index)}
              className={cn(
                'h-2 rounded-[var(--radius-full)] transition-all duration-300',
                activeDot === index
                  ? 'w-5 bg-brand-primary'
                  : 'w-2 bg-text-tertiary/40 hover:bg-text-tertiary/70'
              )}
              aria-label={`Ir al valor ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}