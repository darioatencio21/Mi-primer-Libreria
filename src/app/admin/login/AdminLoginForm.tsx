'use client'

import { useActionState } from 'react'
import { KeyRound, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { loginAdmin } from '@/app/admin/actions'

export function AdminLoginForm() {
  const [state, formAction, pending] = useActionState(loginAdmin, null)

  return (
    <form action={formAction} className="w-full flex flex-col gap-4">
      <div className="mb-1 flex justify-center">
        <div className="w-14 h-14 rounded-2xl bg-orange-100 flex items-center justify-center">
          <ShieldCheck className="w-7 h-7 text-orange-600" />
        </div>
      </div>

      <Input
        id="password"
        name="password"
        type="password"
        label="Contraseña de administrador"
        placeholder="••••••••"
        inputSize="lg"
        autoFocus
      />

      {state?.message && (
        <p className="text-sm text-red-600" role="alert">
          {state.message}
        </p>
      )}

      <Button type="submit" size="lg" loading={pending} icon={<KeyRound className="w-4 h-4" />}>
        Ingresar
      </Button>
    </form>
  )
}
