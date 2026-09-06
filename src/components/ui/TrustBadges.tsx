import { Truck, RotateCcw, ShieldCheck, Headphones } from 'lucide-react'
import { cn } from '@/lib/utils'

const ITEMS = [
  { icon: Truck, label: 'Envío 24-48h', sub: 'Gratis desde $50.000' },
  { icon: RotateCcw, label: '30 días de devolución', sub: 'Sin preguntas' },
  { icon: ShieldCheck, label: 'Pago 100% seguro', sub: 'Encriptación SSL' },
  { icon: Headphones, label: 'Atención de libreros', sub: 'Te ayudan a elegir' },
]

interface TrustBadgesProps {
  compact?: boolean
  className?: string
}

export function TrustBadges({ compact = false, className }: TrustBadgesProps) {
  const visible = compact ? ITEMS.slice(0, 3) : ITEMS

  return (
    <div
      className={cn(
        'grid gap-[var(--space-3)]',
        compact
          ? 'grid-cols-3 gap-x-[var(--space-4)]'
          : 'grid-cols-1 sm:grid-cols-2',
        className
      )}
    >
      {visible.map((item) => (
        <div
          key={item.label}
          className={cn('flex items-center gap-[var(--space-3)]', compact && 'flex-col text-center gap-[var(--space-2)]')}
        >
          <span className="w-9 h-9 shrink-0 rounded-[var(--radius-full)] bg-brand-primary-light flex items-center justify-center">
            <item.icon className="w-4 h-4 text-brand-primary" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-text-primary leading-snug">{item.label}</p>
            {!compact && <p className="text-[11px] text-text-secondary leading-snug">{item.sub}</p>}
          </div>
        </div>
      ))}
    </div>
  )
}