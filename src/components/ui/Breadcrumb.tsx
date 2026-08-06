import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  className?: string
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className={cn('flex items-center flex-wrap gap-[var(--space-1)]', className)}>
      <ol className="flex items-center gap-[var(--space-1)]">
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          return (
            <li key={index} className="flex items-center gap-[var(--space-1)]">
              {index > 0 && (
                <ChevronRight
                  className="w-3.5 h-3.5 text-text-tertiary"
                  aria-hidden="true"
                />
              )}
              {isLast || !item.href ? (
                <span
                  className={cn(
                    'text-xs',
                    isLast ? 'text-text-primary font-medium' : 'text-text-secondary'
                  )}
                  aria-current={isLast ? 'page' : undefined}
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="text-xs text-text-secondary hover:underline decoration-[1.5px] underline-offset-[3px] transition-colors duration-[var(--duration-micro)]"
                >
                  {item.label}
                </Link>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
