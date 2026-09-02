'use client'

import { useState } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface ProductGalleryProps {
  images: string[]
  title: string
}

export function ProductGallery({ images, title }: ProductGalleryProps) {
  const [activeImage, setActiveImage] = useState(0)
  const gallery = images.length > 0 ? images : ['/placeholder-book.svg']

  return (
    <div className="flex flex-col md:flex-row gap-[var(--space-4)]">
      <div className="hidden md:flex flex-col gap-[var(--space-3)]">
        {gallery.map((img, i) => (
          <button
            key={i}
            onClick={() => setActiveImage(i)}
            className={cn(
              'w-16 h-20 rounded-[var(--radius-sm)] bg-bg-muted overflow-hidden border-2 transition-colors duration-[var(--duration-micro)]',
              activeImage === i ? 'border-brand-primary' : 'border-transparent hover:border-border-hover'
            )}
            aria-label={`Ver imagen ${i + 1} de ${title}`}
            aria-pressed={activeImage === i}
          >
            <Image
              src={img}
              alt={`Vista ${i + 1} de ${title}`}
              width={64}
              height={80}
              className="w-full h-full object-contain p-1"
            />
          </button>
        ))}
      </div>

      <div className="flex-1 min-w-0">
        <div className="relative aspect-[3/4] rounded-[var(--radius-lg)] bg-bg-muted overflow-hidden">
          <Image
            src={gallery[activeImage]}
            alt={`Portada de ${title}`}
            fill
            sizes="(max-width: 1024px) 100vw, 45vw"
            className="object-contain p-[var(--space-8)]"
            priority
          />
        </div>

        {gallery.length > 1 && (
          <div className="md:hidden flex gap-[var(--space-2)] mt-[var(--space-3)] overflow-x-auto scrollbar-hide">
            {gallery.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(i)}
                className={cn(
                  'w-14 h-[72px] shrink-0 rounded-[var(--radius-sm)] bg-bg-muted overflow-hidden border-2 transition-colors duration-[var(--duration-micro)]',
                  activeImage === i ? 'border-brand-primary' : 'border-transparent'
                )}
                aria-label={`Ver imagen ${i + 1} de ${title}`}
                aria-pressed={activeImage === i}
              >
                <Image
                  src={img}
                  alt={`Vista ${i + 1} de ${title}`}
                  width={56}
                  height={72}
                  className="w-full h-full object-contain p-1"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}