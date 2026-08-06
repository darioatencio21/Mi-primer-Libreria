import { type ReactNode } from 'react'
import { cn } from '@/lib/utils'

type BadgeVariant =
  | 'bestseller'
  | 'discount'
  | 'new'
  | 'low-stock'
  | 'digital'

interface BadgeProps {
  variant: BadgeVariant
  children: ReactNode
  className?: string
}

const variantStyles: Record<BadgeVariant, string> = {
  bestseller:
    'bg-badge-bestseller-bg text-badge-bestseller-text border border-badge-bestseller-border',
  discount:
    'bg-badge-discount text-text-on-brand',
  new:
    'bg-badge-new-bg text-badge-new-text',
  'low-stock':
    'bg-badge-stock-low-bg text-badge-stock-low-text',
  digital:
    'bg-badge-digital-bg text-badge-digital-text',
}

export function Badge({ variant, children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center h-6 px-[10px] rounded-[var(--radius-sm)] text-xs font-semibold whitespace-nowrap',
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  )
}
