import { Star } from 'lucide-react'
import { Carousel } from '@/components/ui/Carousel'
import { getRecentReviews } from '@/lib/data'

const FALLBACK_TESTIMONIALS = [
  {
    name: 'María González',
    bookTitle: 'Profesora universitaria',
    rating: 5,
    content: 'Tus Libros Ya transformó mi forma de descubrir libros. La curaduría es impecable y el servicio es excepcional.',
  },
  {
    name: 'Carlos Ruiz',
    bookTitle: 'Escritor',
    rating: 5,
    content: 'Como autor, valoro que una librería entienda la importancia de cada libro. Tus Libros Ya lo hace.',
  },
  {
    name: 'Ana Martínez',
    bookTitle: 'Estudiante de doctorado',
    rating: 5,
    content: 'Encontré textos académicos que no estaban en ningún otro lado. El envío fue rápido y el empaque, perfecto.',
  },
]

export async function TestimonialsSection() {
  const reviews = await getRecentReviews(8)
  const testimonials =
    reviews.length > 0
      ? reviews.map((r) => ({
          name: r.userName,
          bookTitle: r.bookTitle,
          rating: r.rating,
          content: r.content,
        }))
      : FALLBACK_TESTIMONIALS

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
          {testimonials.map((testimonial, i) => (
            <div
              key={i}
              className="w-[320px] md:w-[400px] bg-bg-surface border border-border-subtle rounded-[var(--radius-lg)] p-[var(--space-6)]"
            >
              <div className="flex items-center gap-[var(--space-1)] mb-[var(--space-4)]" aria-label={`${testimonial.rating} de 5 estrellas`}>
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star
                    key={s}
                    className={`w-4 h-4 ${s < testimonial.rating ? 'fill-accent-gold text-accent-gold' : 'text-border-subtle'}`}
                    aria-hidden="true"
                  />
                ))}
              </div>
              <blockquote className="text-base text-text-primary mb-[var(--space-6)] leading-relaxed">
                &ldquo;{testimonial.content}&rdquo;
              </blockquote>
              <div>
                <p className="text-sm font-semibold text-text-primary">{testimonial.name}</p>
                {testimonial.bookTitle && (
                  <p className="text-xs text-text-tertiary">{testimonial.bookTitle}</p>
                )}
              </div>
            </div>
          ))}
        </Carousel>
      </div>
    </section>
  )
}