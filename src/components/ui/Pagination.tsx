'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  className?: string
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: PaginationProps) {
  const getVisiblePages = () => {
    const pages: (number | 'ellipsis')[] = []
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
      return pages
    }
    pages.push(1)
    if (currentPage > 3) pages.push('ellipsis')
    const start = Math.max(2, currentPage - 1)
    const end = Math.min(totalPages - 1, currentPage + 1)
    for (let i = start; i <= end; i++) pages.push(i)
    if (currentPage < totalPages - 2) pages.push('ellipsis')
    pages.push(totalPages)
    return pages
  }

  return (
    <nav aria-label="Paginación" className={cn('flex items-center justify-center gap-[var(--space-2)]', className)}>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center justify-center w-10 h-10 rounded-[var(--radius-md)] text-text-secondary hover:bg-bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-[var(--duration-micro)]"
        aria-label="Página anterior"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      {getVisiblePages().map((page, idx) =>
        page === 'ellipsis' ? (
          <span key={`e-${idx}`} className="w-10 h-10 flex items-center justify-center text-text-tertiary text-sm">
            ...
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            aria-current={currentPage === page ? 'page' : undefined}
            className={cn(
              'flex items-center justify-center w-10 h-10 rounded-[var(--radius-full)] text-sm font-medium transition-colors duration-[var(--duration-micro)]',
              currentPage === page
                ? 'bg-brand-primary text-text-on-brand'
                : 'text-text-secondary hover:bg-bg-muted'
            )}
          >
            {page}
          </button>
        )
      )}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center justify-center w-10 h-10 rounded-[var(--radius-md)] text-text-secondary hover:bg-bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-[var(--duration-micro)]"
        aria-label="Página siguiente"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </nav>
  )
}
