'use client'

import { Fragment, useState } from 'react'
import { BookCard } from '@/components/product/BookCard'
import { Button } from '@/components/ui/Button'
import { Sparkles, RotateCcw, ArrowRight, ChevronLeft } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Book } from '@/lib/types'

type MoodId = 'fuga' | 'reflexion' | 'aprender' | 'familia'
type FormatPref = 'fisico' | 'ebook' | 'audiolibro' | 'cualquiera'

const MOODS: { id: MoodId; label: string; icon: string; categories: string[] }[] = [
  { id: 'fuga', label: 'Fugarme a otra realidad', icon: '🌙', categories: ['ficcion'] },
  { id: 'reflexion', label: 'Reflexionar y crecer', icon: '💭', categories: ['no-ficcion'] },
  { id: 'aprender', label: 'Aprender algo nuevo', icon: '✨', categories: ['no-ficcion', 'academico'] },
  { id: 'familia', label: 'Compartir con la familia', icon: '👨‍👩‍👧', categories: ['infantil'] },
]

const FORMAT_OPTS: { id: FormatPref; label: string; icon: string }[] = [
  { id: 'fisico', label: 'Libro físico', icon: '📚' },
  { id: 'ebook', label: 'Ebook', icon: '📱' },
  { id: 'audiolibro', label: 'Audiolibro', icon: '🎧' },
  { id: 'cualquiera', label: 'No me importa', icon: '🤷' },
]

function matchesMood(book: Book, mood: MoodId): boolean {
  const moodConfig = MOODS.find((m) => m.id === mood)
  return moodConfig?.categories.some((c) => book.category.slug === c) ?? true
}

function matchesFormat(book: Book, pref: FormatPref): boolean {
  if (pref === 'cualquiera') return true
  if (pref === 'fisico') {
    return book.formats.some((f) => f.type === 'paperback' || f.type === 'hardcover')
  }
  return book.formats.some((f) => f.type === pref)
}

export function BookQuiz({ pool }: { pool: Book[] }) {
  const [mood, setMood] = useState<MoodId | null>(null)
  const [format, setFormat] = useState<FormatPref | null>(null)
  const [step, setStep] = useState<0 | 1>(0)

  const answered = mood !== null && format !== null

  const recommendations = (() => {
    if (!mood || !format) return []
    const scored = pool
      .map((book) => ({
        book,
        score: (matchesMood(book, mood) ? 2 : 0) + (matchesFormat(book, format) ? 1 : 0),
      }))
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((x) => x.book)
    return (scored.length > 0 ? scored : pool).slice(0, 4)
  })()

  const reset = () => {
    setMood(null)
    setFormat(null)
    setStep(0)
  }

  return (
    <div className="rounded-[var(--radius-xl)] border border-border-subtle bg-bg-surface p-[var(--space-8)] md:p-[var(--space-12)]">
      <div className="text-center max-w-[560px] mx-auto mb-[var(--space-8)]">
        <p className="flex items-center justify-center gap-[var(--space-2)] text-xs font-semibold uppercase tracking-[0.14em] text-brand-primary mb-[var(--space-3)]">
          <Sparkles className="w-4 h-4" aria-hidden="true" />
          Recomendador
        </p>
        <h2 className="text-2xl md:text-4xl font-display font-normal text-text-primary tracking-[var(--tracking-4xl)]">
          ¿No sabés qué leer?
        </h2>
        <p className="mt-[var(--space-3)] text-sm text-text-secondary">
          Respondé un par de preguntas y dejá que nuestros libreros virtuales elijan por vos.
        </p>
      </div>

      {!answered ? (
        <div className="max-w-[680px] mx-auto">
          <div className="mb-[var(--space-6)]">
            <div className="flex items-center justify-center gap-[var(--space-3)] max-w-[320px] mx-auto mb-[var(--space-6)]">
              {[0, 1].map((i) => (
                <Fragment key={i}>
                  {i > 0 && (
                    <div className="flex-1 h-1 rounded-full bg-border-subtle overflow-hidden" aria-hidden="true">
                      <div
                        className="h-full bg-brand-primary rounded-full transition-all duration-500 ease-out"
                        style={{ width: answered || step > 0 ? '100%' : '0%' }}
                      />
                    </div>
                  )}
                  <span
                    className={cn(
                      'flex items-center gap-[var(--space-1)] h-7 px-[var(--space-3)] rounded-full text-[11px] font-semibold uppercase tracking-wide transition-colors duration-200',
                      answered || step >= i
                        ? 'bg-brand-primary text-text-on-brand'
                        : 'bg-bg-muted text-text-tertiary'
                    )}
                  >
                    <span aria-hidden="true">{i + 1}</span>
                    <span className="hidden sm:inline">{i === 0 ? 'Lectura' : 'Formato'}</span>
                  </span>
                </Fragment>
              ))}
            </div>
            <h3 className="text-lg font-semibold text-text-primary text-center">
              {step === 0 ? '¿Qué estás buscando hoy?' : '¿En qué formato lo preferís?'}
            </h3>
          </div>

          {step === 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-[var(--space-3)]">
              {MOODS.map((option) => {
                const active = mood === option.id
                return (
                  <button
                    key={option.id}
                    onClick={() => setMood(option.id)}
                    aria-pressed={active}
                    className={cn(
                      'flex items-center gap-[var(--space-3)] p-[var(--space-4)] rounded-[var(--radius-md)] border text-left transition-all duration-[var(--duration-micro)]',
                      active
                        ? 'border-brand-primary bg-brand-primary-light'
                        : 'border-border-subtle hover:border-border-hover'
                    )}
                  >
                    <span className="text-2xl" aria-hidden="true">{option.icon}</span>
                    <span className="text-sm font-medium text-text-primary">{option.label}</span>
                  </button>
                )
              })}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-[var(--space-3)]">
              {FORMAT_OPTS.map((option) => {
                const active = format === option.id
                return (
                  <button
                    key={option.id}
                    onClick={() => setFormat(option.id)}
                    aria-pressed={active}
                    className={cn(
                      'flex flex-col items-center gap-[var(--space-2)] p-[var(--space-5)] rounded-[var(--radius-md)] border text-center transition-all duration-[var(--duration-micro)]',
                      active
                        ? 'border-brand-primary bg-brand-primary-light'
                        : 'border-border-subtle hover:border-border-hover'
                    )}
                  >
                    <span className="text-2xl" aria-hidden="true">{option.icon}</span>
                    <span className="text-sm font-medium text-text-primary">{option.label}</span>
                  </button>
                )
              })}
            </div>
          )}

          <div className="flex items-center justify-between mt-[var(--space-6)]">
            <Button
              variant="secondary"
              disabled={step === 0}
              onClick={() => setStep(0)}
              icon={<ChevronLeft className="w-4 h-4" />}
            >
              Volver
            </Button>
            <Button
              disabled={step === 0 ? mood === null : format === null}
              onClick={() => setStep(1)}
              className={cn(step === 1 && 'hidden')}
            >
              Continuar
              <ArrowRight className="w-4 h-4" />
            </Button>
            {step === 1 && (
              <Button disabled={!format} onClick={() => setStep(1)}>
                Ver recomendaciones
                <ArrowRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      ) : (
        <>
          <p className="text-center text-sm text-text-secondary mb-[var(--space-6)]">
            Elegimos {recommendations.length} lecturas para tu momento:
          </p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-[var(--space-4)]">
            {recommendations.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
          <div className="flex justify-center mt-[var(--space-8)]">
            <Button variant="secondary" onClick={reset} icon={<RotateCcw className="w-4 h-4" />}>
              Empezar de nuevo
            </Button>
          </div>
        </>
      )}
    </div>
  )
}