interface LegalSection {
  title: string
  body: string[]
}

interface LegalPageProps {
  eyebrow: string
  title: string
  description: string
  updatedAt: string
  sections: LegalSection[]
}

export function LegalPage({
  eyebrow,
  title,
  description,
  updatedAt,
  sections,
}: LegalPageProps) {
  return (
    <article className="mx-auto max-w-[var(--container-text)] px-[var(--space-6)] py-[var(--space-12)] md:py-[var(--space-16)]">
      <p className="text-sm font-semibold text-accent-terracotta uppercase tracking-wider mb-[var(--space-3)]">
        {eyebrow}
      </p>
      <h1 className="text-3xl md:text-5xl font-display font-medium text-text-primary tracking-[var(--tracking-5xl)] mb-[var(--space-3)]">
        {title}
      </h1>
      <p className="text-sm text-text-tertiary mb-[var(--space-8)]">
        Última actualización: {updatedAt}
      </p>
      <p className="text-base md:text-lg text-text-secondary mb-[var(--space-10)]">
        {description}
      </p>

      <div className="flex flex-col gap-[var(--space-10)]">
        {sections.map((section, i) => (
          <section key={i}>
            <h2 className="text-lg md:text-xl font-display font-medium text-text-primary tracking-[var(--tracking-3xl)] mb-[var(--space-3)]">
              {section.title}
            </h2>
            <div className="flex flex-col gap-[var(--space-3)]">
              {section.body.map((paragraph, j) => (
                <p key={j} className="text-sm leading-[var(--leading-lg)] text-text-secondary">
                  {paragraph}
                </p>
              ))}
            </div>
          </section>
        ))}
      </div>
    </article>
  )
}
