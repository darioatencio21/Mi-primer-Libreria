'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  BookOpen,
  Newspaper,
  Baby,
  Heart,
  GraduationCap,
  Image as ImageIcon,
  Feather,
  Atom,
} from 'lucide-react'
import { CATEGORIES } from '@/lib/constants'
import type { Category } from '@/lib/types'
import { cn } from '@/lib/utils'

const iconMap = {
  'book-open': BookOpen,
  newspaper: Newspaper,
  baby: Baby,
  heart: Heart,
  'graduation-cap': GraduationCap,
  image: ImageIcon,
  feather: Feather,
  atom: Atom,
}

function CategoryImage({ category }: { category: Category }) {
  const [error, setError] = useState(false)
  const Icon = iconMap[category.icon as keyof typeof iconMap]

  if (error) {
    return (
      <>
        <span className="sr-only">Ir a {category.name}</span>
        <Icon className="w-7 h-7 text-brand-primary group-hover:text-text-on-brand transition-colors duration-200" strokeWidth={1.5} aria-hidden="true" />
      </>
    )
  }

  return (
    <Image
      src={`/categories/${category.slug}.webp`}
      alt=""
      fill
      sizes="(min-width: 768px) 100px, 88px"
      className="object-cover group-hover:scale-105 transition-transform duration-200"
      onError={() => setError(true)}
    />
  )
}

interface CategoriesSectionProps {
  categories?: Category[]
}

export function CategoriesSection({ categories = CATEGORIES as unknown as Category[] }: CategoriesSectionProps) {
  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set())
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute('data-index'))
            setVisibleItems((prev) => new Set([...prev, index]))
          }
        })
      },
      { threshold: 0.2 }
    )

    const items = sectionRef.current?.querySelectorAll('[data-index]')
    items?.forEach((item) => observer.observe(item))

    return () => observer.disconnect()
  }, [])

  return (
    <section className="pt-[var(--space-24)] pb-[var(--space-12)] md:pb-[var(--space-24)]">
      <div className="mx-auto max-w-[var(--container-max)] px-[var(--space-6)] md:px-[var(--space-10)] lg:px-[var(--space-16)]">
        <div className="flex items-end justify-between mb-[var(--space-8)]">
          <h2 className="text-2xl md:text-4xl font-display font-normal text-text-primary tracking-[var(--tracking-4xl)]">
            Explora por categoría
          </h2>
          <Link
            href="/libros"
            className="hidden sm:inline-flex items-center gap-[var(--space-1)] text-sm font-semibold text-brand-primary hover:underline decoration-[1.5px] underline-offset-[3px] transition-transform duration-[var(--duration-micro)] hover:translate-x-0.5"
          >
            Ver todas →
          </Link>
        </div>

        <div
          ref={sectionRef}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-[var(--space-6)]"
        >
          {categories.map((category, index) => {
            return (
              <Link
                key={category.slug}
                href={`/libros/${category.slug}`}
                data-index={index}
                className={cn(
                  'flex flex-col items-center gap-[var(--space-3)] group transition-all duration-500',
                  visibleItems.has(index)
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-3'
                )}
                style={{ transitionDelay: `${index * 60}ms` }}
              >
                <div className="relative w-[88px] h-[88px] md:w-[100px] md:h-[100px] rounded-full bg-bg-muted border border-border-subtle overflow-hidden group-hover:border-brand-primary transition-colors duration-200">
                  <CategoryImage category={category} />
                </div>
                <span className="text-sm font-medium text-text-primary text-center">
                  {category.name}
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
