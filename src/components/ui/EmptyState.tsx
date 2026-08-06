import { ShoppingBag, Heart, Search, BookOpen, AlertCircle } from 'lucide-react'
import { Button } from './Button'
import { cn } from '@/lib/utils'

type EmptyVariant = 'cart' | 'wishlist' | 'search' | 'error' | 'not-found'

interface EmptyStateProps {
  variant: EmptyVariant
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
  className?: string
}

const icons: Record<EmptyVariant, typeof ShoppingBag> = {
  cart: ShoppingBag,
  wishlist: Heart,
  search: Search,
  error: AlertCircle,
  'not-found': BookOpen,
}

export function EmptyState({
  variant,
  title,
  description,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  const Icon = icons[variant]

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center py-[var(--space-16)] px-[var(--space-6)]',
        className
      )}
    >
      <div className="w-20 h-20 rounded-[var(--radius-full)] bg-bg-muted flex items-center justify-center mb-[var(--space-6)]">
        <Icon className="w-9 h-9 text-text-tertiary" strokeWidth={1.5} aria-hidden="true" />
      </div>
      <h3 className="text-lg font-semibold text-text-primary mb-[var(--space-2)]">
        {title}
      </h3>
      <p className="text-sm text-text-secondary max-w-[var(--container-text)] mb-[var(--space-6)]">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button variant="primary" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  )
}
