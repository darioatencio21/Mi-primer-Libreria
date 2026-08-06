'use client'

import { useState } from 'react'
import { Send } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { sanitizeInput } from '@/lib/sanitize'

export function NewsletterSection() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const sanitizedEmail = sanitizeInput(email)
    
    if (!sanitizedEmail || !sanitizedEmail.includes('@')) {
      setStatus('error')
      setErrorMessage('Por favor ingresa un email válido.')
      return
    }

    setStatus('loading')
    
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setStatus('success')
      setEmail('')
    } catch {
      setStatus('error')
      setErrorMessage('Algo salió mal. Intenta de nuevo.')
    }
  }

  return (
    <section className="py-[var(--space-24)] bg-brand-primary">
      <div className="mx-auto max-w-[var(--container-max)] px-[var(--space-6)] md:px-[var(--space-10)] lg:px-[var(--space-16)]">
        <div className="max-w-[640px] mx-auto text-center">
          <h2 className="text-2xl md:text-4xl font-display font-normal text-text-on-brand tracking-[var(--tracking-4xl)] mb-[var(--space-4)]">
            Mantente al día con nuestras curadurías
          </h2>
          <p className="text-base text-text-on-brand/80 mb-[var(--space-8)]">
            Recibe recomendaciones personalizadas, novedades editoriales y ofertas exclusivas directamente en tu correo.
          </p>

          {status === 'success' ? (
            <div className="bg-text-on-brand/10 border border-text-on-brand/20 rounded-[var(--radius-md)] p-[var(--space-6)]">
              <p className="text-base text-text-on-brand font-medium">
                Listo. Te avisaremos de nuestras próximas curadurías.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-[var(--space-3)]">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                disabled={status === 'loading'}
                className="flex-1 h-[var(--height-btn-lg)] px-[var(--space-4)] rounded-[var(--radius-md)] bg-bg-surface text-text-primary placeholder:text-text-tertiary border-none outline-none focus:ring-2 focus:ring-accent-gold disabled:opacity-50"
                aria-label="Email para newsletter"
                required
              />
              <Button
                type="submit"
                size="lg"
                variant="secondary"
                loading={status === 'loading'}
                icon={<Send className="w-5 h-5" />}
                iconPosition="right"
                className="bg-accent-terracotta border-accent-terracotta text-text-on-brand hover:bg-accent-terracotta/90"
              >
                Suscribirme
              </Button>
            </form>
          )}

          {status === 'error' && errorMessage && (
            <p className="mt-[var(--space-3)] text-sm text-accent-terracotta-light" role="alert">
              {errorMessage}
            </p>
          )}

          <p className="mt-[var(--space-4)] text-xs text-text-on-brand/60">
            Sin spam. Puedes darte de baja en cualquier momento.
          </p>
        </div>
      </div>
    </section>
  )
}
