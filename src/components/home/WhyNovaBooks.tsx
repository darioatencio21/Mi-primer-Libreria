import { Sparkles, Truck, Users, Leaf } from 'lucide-react'

const VALUES = [
  {
    icon: Sparkles,
    title: 'Curaduría experta',
    description: 'Cada libro es seleccionado por nuestro equipo de libreros con décadas de experiencia.',
  },
  {
    icon: Truck,
    title: 'Envío cuidado',
    description: 'Empaquetamos cada libro con materiales sostenibles para que llegue perfecto.',
  },
  {
    icon: Users,
    title: 'Comunidad lectora',
    description: 'Más de 50,000 lectores confían en nosotros para descubrir su próxima lectura.',
  },
  {
    icon: Leaf,
    title: 'Compromiso sostenible',
    description: 'Plantamos un árbol por cada 100 libros vendidos. Ya hemos plantado más de 2,000.',
  },
]

export function WhyNovaBooks() {
  return (
    <section className="py-[var(--space-24)] bg-bg-muted">
      <div className="mx-auto max-w-[var(--container-max)] px-[var(--space-6)] md:px-[var(--space-10)] lg:px-[var(--space-16)]">
        <div className="text-center mb-[var(--space-12)]">
          <h2 className="text-2xl md:text-4xl font-display font-normal text-text-primary tracking-[var(--tracking-4xl)] mb-[var(--space-4)]">
            Por qué Tus Libros Ya
          </h2>
          <p className="text-base text-text-secondary max-w-[var(--container-text)] mx-auto">
            No somos solo una librería online. Somos un espacio curado para lectores que valoran tanto el contenido como la experiencia.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[var(--space-8)]">
          {VALUES.map((value) => {
            const Icon = value.icon
            return (
              <div key={value.title} className="text-center">
                <div className="w-16 h-16 rounded-full bg-bg-surface shadow-[var(--shadow-xs)] flex items-center justify-center mx-auto mb-[var(--space-4)]">
                  <Icon className="w-8 h-8 text-brand-primary" strokeWidth={1.5} aria-hidden="true" />
                </div>
                <h3 className="text-base font-semibold text-text-primary mb-[var(--space-2)]">
                  {value.title}
                </h3>
                <p className="text-sm text-text-secondary">{value.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

