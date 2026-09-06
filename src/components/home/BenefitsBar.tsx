import { Truck, ShieldCheck, RotateCcw, Headphones } from 'lucide-react'
import { BENEFITS } from '@/lib/constants'

const iconMap = {
  truck: Truck,
  'shield-check': ShieldCheck,
  'rotate-ccw': RotateCcw,
  headphones: Headphones,
}

export function BenefitsBar() {
  return (
    <section className="bg-bg-muted py-[var(--space-8)]">
      <div className="mx-auto max-w-[var(--container-max)] px-[var(--space-6)] md:px-[var(--space-10)] lg:px-[var(--space-16)]">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-[var(--space-6)] lg:gap-[var(--space-8)]">
          {BENEFITS.map((benefit) => {
            const Icon = iconMap[benefit.icon as keyof typeof iconMap]
            return (
              <div
                key={benefit.title}
                className="flex items-start gap-[var(--space-3)] lg:gap-[var(--space-4)] group"
              >
                <div className="shrink-0 w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-bg-surface shadow-[var(--shadow-xs)] flex items-center justify-center group-hover:scale-108 group-hover:bg-brand-primary-light transition-all duration-200">
                  <Icon className="w-5 h-5 sm:w-7 sm:h-7 text-brand-primary" strokeWidth={1.5} aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm sm:text-base font-semibold text-text-primary mb-[var(--space-1)]">
                    {benefit.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-text-secondary leading-snug">{benefit.description}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
