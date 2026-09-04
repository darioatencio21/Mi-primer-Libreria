'use client'

import Link from 'next/link'
import { useActionState } from 'react'
import { LogIn } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { login } from '@/lib/auth/actions'

export function LoginForm() {
  const [state, formAction, pending] = useActionState(login, { error: undefined })

  return (
    <form action={formAction} className="flex flex-col gap-[var(--space-4)]">
      <Input
        id="email"
        name="email"
        type="email"
        label="Email"
        placeholder="vos@email.com"
        autoComplete="email"
        required
      />
      <Input
        id="password"
        name="password"
        type="password"
        label="Contraseña"
        placeholder="••••••••"
        autoComplete="current-password"
        required
      />

      {state?.error && (
        <p className="text-sm text-error" role="alert">
          {state.error}
        </p>
      )}

      <Button type="submit" size="lg" loading={pending} icon={<LogIn className="w-4 h-4" />}>
        Ingresar
      </Button>

      <p className="text-xs text-text-tertiary text-center">
        <Link href="/registro" className="font-medium text-brand-primary hover:text-brand-primary-hover">
          ¿Olvidaste tu contraseña?
        </Link>
      </p>
    </form>
  )
}