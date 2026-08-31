'use client'

import { useState, useTransition } from 'react'
import { Trash2 } from 'lucide-react'

export function DeleteButton({
  action,
  id,
  label = 'Eliminar',
  confirmMessage,
  className,
}: {
  action: (id: string) => Promise<{ ok: boolean; message?: string } | undefined>
  id: string
  label?: string
  confirmMessage?: string
  className?: string
}) {
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  return (
    <div className="inline-flex flex-col items-end gap-1">
      <button
        type="button"
        disabled={pending}
        onClick={() => {
          setError(null)
          if (!window.confirm(confirmMessage ?? '¿Seguro que deseas eliminar este elemento?')) return
          startTransition(async () => {
            const result = await action(id)
            if (result && !result.ok) setError(result.message ?? 'No se pudo completar la operación.')
          })
        }}
        className={
          className ??
          'inline-flex items-center gap-1.5 text-xs font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 px-2 py-1.5 rounded-md transition-colors disabled:opacity-50'
        }
      >
        <Trash2 className="w-3.5 h-3.5" />
        {pending ? 'Eliminando…' : label}
      </button>
      {error && <span className="text-xs text-red-600">{error}</span>}
    </div>
  )
}
