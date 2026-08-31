import { Star } from 'lucide-react'
import { Carousel } from '@/components/ui/Carousel'

const MOCK_TESTIMONIALS = [
  {
    id: 't1',
    name: 'María González',
    role: 'Profesora universitaria',
    rating: 5,
    quote: 'Tus Libros Ya transformó mi forma de descubrir libros. La curaduría es impecable y el servicio es excepcional.',
  },
  {
    id: 't2',
    name: 'Carlos Ruiz',
    role: 'Escritor',
    rating: 5,
    quote: 'Como autor, valoro que una librería entienda la importancia de cada libro. Tus Libros Ya lo hace.',
  },
  {
    id: 't3',
    name: 'Ana Martínez',
    role: 'Estudiante de doctorado',
    rating: 5,
    quote: 'Encontré textos académicos que no estaban en ningún otro lado. El envío fue rápido y el empaque, perfecto.',
  },
]

export function TestimonialsSection() {
  return (
    <section className="py-[var(--space-24)]">
      <div className="mx-auto max-w-[var(--container-max)] px-[var(--space-6)] md:px-[var(--space-10)] lg:px-[var(--space-16)]">
        <div className="text-center mb-[var(--space-12)]">
          <h2 className="text-2xl md:text-4xl font-display font-normal text-text-primary tracking-[var(--tracking-4xl)] mb-[var(--space-4)]">
            Lo que dicen nuestros lectores
          </h2>
          <p className="text-base text-text-secondary max-w-[var(--container-text)] mx-auto">
            Miles de lectores confían en Tus Libros Ya para descubrir su próxima gran lectura.
          </p>
        </div>

        <Carousel gap={24} showDots>
          {MOCK_TESTIMONIALS.map((testimonial) => (
            <div
              key={testimonial.id}
              className="w-[320px] md:w-[400px] bg-bg-surface border border-border-subtle rounded-[var(--radius-lg)] p-[var(--space-6)]"
            >
              <div className="flex items-center gap-[var(--space-1)] mb-[var(--space-4)]" aria-label={`${testimonial.rating} de 5 estrellas`}>
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 fill-accent-gold text-accent-gold"
                    aria-hidden="true"
                  />
                ))}
              </div>
              <blockquote className="text-base text-text-primary mb-[var(--space-6)] leading-relaxed">
                &ldquo;{testimonial.quote}&rdquo;
              </blockquote>
              <div>
                <p className="text-sm font-semibold text-text-primary">{testimonial.name}</p>
                <p className="text-xs text-text-tertiary">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </Carousel>
      </div>
    </section>
  )
}

