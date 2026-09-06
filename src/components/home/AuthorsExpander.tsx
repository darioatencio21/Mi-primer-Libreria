'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronDown } from 'lucide-react'
import { AuthorAvatar } from '@/components/ui/AuthorAvatar'
import { cn } from '@/lib/utils'
import type { Author } from '@/lib/types'

export function AuthorsExpander({ authors }: { authors: Author[] }) {
  const [open, setOpen] = useState(false)

  if (!authors.length) return null

  return (
    <div className="mt-[var(--space-8)] text-center">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls="autores-completos"
        className="inline-flex items-center gap-[var(--space-2)] text-sm font-semibold text-brand-primary underline decoration-[1.5px] underline-offset-[3px] hover:opacity-80 transition-opacity duration-[var(--duration-micro)]"
      >
        {open ? 'Mostrar menos autores' : 'Ver todos los autores'}
        <ChevronDown
          className={cn('w-4 h-4 transition-transform duration-200', open && 'rotate-180')}
          aria-hidden="true"
        />
      </button>

      <div
        id="autores-completos"
        className={cn(
          'grid transition-[grid-template-rows] duration-300 ease-out',
          open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        )}
      >
        <div className="overflow-hidden">
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-[var(--space-5)] lg:gap-[var(--space-6)] mt-[var(--space-8)] pt-[var(--space-6)] border-t border-border-subtle">
            {authors.map((author) => (
              <Link
                key={author.id}
                href={`/autores/${author.slug}`}
                className="flex flex-col items-center text-center group"
              >
                <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-full bg-bg-muted border-2 border-border-subtle overflow-hidden group-hover:border-brand-primary transition-colors duration-200">
                  <AuthorAvatar name={author.name} photo={author.photo} variant="circle" sizes="96px" />
                </div>
                <h4 className="text-sm font-semibold text-text-primary mt-[var(--space-2)] group-hover:text-brand-primary transition-colors duration-[var(--duration-micro)] line-clamp-2">
                  {author.name}
                </h4>
                <p className="text-xs text-text-tertiary">{author.bookCount} libros</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}