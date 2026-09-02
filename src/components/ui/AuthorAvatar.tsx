'use client'

import { useState } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface AuthorAvatarProps {
  name: string
  photo?: string
  /** Superficie contenedora: 'circle' (redondeada) o 'square'. */
  variant?: 'circle' | 'square'
  sizes?: string
  className?: string
  /** Foto como imagen explícita (Miniatura de tarjetas). */
  imageClassName?: string
}

const DEFAULT_ICON = 96

export function AuthorAvatar({
  name,
  photo,
  variant = 'circle',
  sizes = '96px',
  className,
  imageClassName,
}: AuthorAvatarProps) {
  const [failed, setFailed] = useState(false)

  const baseUri = `/api/autor-foto/${encodeURIComponent(name)}`
  const src = photo && photo.length > 0 ? photo : baseUri
  const showImage = !failed

  const container = cn(
    'h-full w-full bg-bg-muted text-text-tertiary',
    variant === 'circle' ? 'rounded-full' : 'rounded-[var(--radius-sm)]',
    className
  )

  const imgClass = cn(
    'w-full h-full',
    variant === 'circle' ? 'rounded-full' : 'rounded-[var(--radius-sm)]',
    imageClassName
  )

  return (
    <div className={cn('relative overflow-hidden', container)}>
      {showImage ? (
        <Image
          src={src}
          alt={`Foto de ${name}`}
          fill
          sizes={sizes}
          className={cn(imgClass, 'object-cover')}
          onError={() => setFailed(true)}
          unoptimized={!photo || photo.length === 0}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <svg
            className="w-3/4 h-3/4 max-w-full max-h-full"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="12" cy="8" r="4" />
            <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
          </svg>
        </div>
      )}
    </div>
  )
}