'use client'

import { useState } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

const PLACEHOLDER = '/placeholder-book.svg'

interface BookCoverProps {
  isbn?: string
  coverImage?: string
  title: string
  author?: string
  sizes: string
  className?: string
  /** 'card' mantiene aspect 3/4 recomendado; 'natural' usa width/height explícitos (miniaturas). */
  variant?: 'card' | 'natural'
  /** Tamaño de imagen remota: 'S' miniaturas, 'M' tarjetas, 'L' vista principal grande. */
  coverSize?: 'S' | 'M' | 'L'
  width?: number
  height?: number
  priority?: boolean
}

function buildSrc(isbn?: string, coverImage?: string, title?: string, author?: string, coverSize = 'M'): string {
  if (coverImage && coverImage !== PLACEHOLDER && coverImage !== '') return coverImage
  if (isbn) {
    const params = new URLSearchParams()
    if (title) params.set('t', title)
    if (author) params.set('a', author)
    params.set('size', coverSize)
    const qs = params.toString()
    return `/api/portada/${encodeURIComponent(isbn)}${qs ? `?${qs}` : ''}`
  }
  return PLACEHOLDER
}

export function BookCover({
  isbn,
  coverImage,
  title,
  author,
  sizes,
  className,
  variant = 'card',
  coverSize = 'M',
  width,
  height,
  priority,
}: BookCoverProps) {
  const [src, setSrc] = useState<string>(() => buildSrc(isbn, coverImage, title, author, coverSize))
  const [failed, setFailed] = useState(false)

  const currentSrc = failed ? PLACEHOLDER : src

  if (variant === 'natural') {
    return (
      <Image
        src={currentSrc}
        alt={`Portada de ${title}`}
        width={width ?? 64}
        height={height ?? 80}
        className={cn('object-contain', className)}
        onError={() => setFailed(true)}
        unoptimized={currentSrc.startsWith('/api/')}
      />
    )
  }

  return (
    <Image
      src={currentSrc}
      alt={`Portada de ${title}`}
      fill
      sizes={sizes}
      priority={priority}
      className={cn('object-contain', className)}
      onError={() => setFailed(true)}
      unoptimized={currentSrc.startsWith('/api/')}
    />
  )
}
