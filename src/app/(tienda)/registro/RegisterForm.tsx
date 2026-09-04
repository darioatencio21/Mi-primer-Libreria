'use client'

import { useActionState } from 'react'
import { UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { register } from '@/lib/auth/actions'

export function RegisterForm() {
  const [state, formAction, pending] = useActionState(register, { error: undefined })

  return (
    <form action={formAction} className="flex flex-col gap-[var(--space-4)]">
      <Input
        id="name"
        name="name"
        type="text"
        label="Nombre y apellido"
        placeholder="Tu nombre"
        autoComplete="name"
        required
      />
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
        placeholder="Mínimo 8 caracteres"
        autoComplete="new-password"
        minLength={8}
        required
      />
      <Input
        id="confirm_password"
        name="confirm_password"
        type="password"
        label="Repetir contraseña"
        placeholder="••••••••"
        autoComplete="new-password"
        required
      />

      {state?.error && (
        <p className="text-sm text-error" role="alert">
          {state.error}
        </p>
      )}

      <Button type="submit" size="lg" loading={pending} icon={<UserPlus className="w-4 h-4" />}>
        Crear cuenta
      </Button>
    </form>
  )
}