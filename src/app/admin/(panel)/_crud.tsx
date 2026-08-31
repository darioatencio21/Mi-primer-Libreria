'use client'

import { useState, useTransition } from 'react'
import { Pencil, Plus, X, Save, Trash2 } from 'lucide-react'

export interface CrudField {
  name: string
  label: string
  type?: 'text' | 'textarea' | 'number'
  required?: boolean
  help?: string
}

export type CrudValue = Record<string, string>

export function CrudManager({
  title,
  description,
  fields,
  rows,
  idKey = 'id',
  createAction,
  updateAction,
  deleteAction,
}: {
  title: string
  description: string
  fields: CrudField[]
  rows: Record<string, unknown>[]
  idKey?: string
  createAction: (formData: FormData) => Promise<{ ok: boolean; message?: string } | undefined>
  updateAction: (id: string, formData: FormData) => Promise<{ ok: boolean; message?: string } | undefined>
  deleteAction: (id: string) => Promise<{ ok: boolean; message?: string } | undefined>
}) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  const displayRows = rows.map((r) => {
    const rec = r as Record<string, unknown>
    return {
      id: String(rec[idKey]),
      cells: fields.map((f) => String(rec[f.name] ?? '')),
    }
  })

  async function handleRowAction(id: string, formData: FormData, kind: 'create' | 'update') {
    setError(null)
    startTransition(async () => {
      const result =
        kind === 'create' ? await createAction(formData) : await updateAction(id, formData)
      if (result && !result.ok) setError(result.message ?? 'Error')
      else {
        setEditingId(null)
        setCreating(false)
      }
    })
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
          {description && <p className="text-sm text-slate-500">{description}</p>}
        </div>
        <button
          type="button"
          onClick={() => {
            setCreating(!creating)
            setEditingId(null)
          }}
          className="inline-flex items-center gap-2 h-9 px-3 rounded-lg bg-slate-900 text-white text-sm font-semibold hover:bg-slate-700 transition-colors"
        >
          {creating ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {creating ? 'Cancelar' : 'Nuevo'}
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3">
          {error}
        </div>
      )}

      {creating && (
        <form
          action={async (fd) => handleRowAction('', fd, 'create')}
          className="mb-5 p-4 rounded-lg bg-slate-50 border border-slate-200 flex flex-col gap-3"
        >
          <h3 className="text-sm font-semibold text-slate-700">Nuevo registro</h3>
          <FieldInputs fields={fields} />
          <button
            type="submit"
            disabled={pending}
            className="self-end inline-flex items-center gap-2 h-9 px-4 rounded-lg bg-orange-600 text-white text-sm font-semibold hover:bg-orange-500 transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            Guardar
          </button>
        </form>
      )}

      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wider text-slate-400">
            {fields.map((f) => (
              <th key={f.name} className="px-3 py-2">{f.label}</th>
            ))}
            <th className="px-3 py-2 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {displayRows.length === 0 && (
            <tr>
              <td colSpan={fields.length + 1} className="px-3 py-8 text-center text-slate-500">
                No hay registros todavía.
              </td>
            </tr>
          )}
          {displayRows.map((row) => (
            <tr key={row.id} className="border-b border-slate-100 last:border-0">
              {editingId === row.id ? (
                <td colSpan={fields.length + 1} className="px-3 py-3">
                  <form action={async (fd) => handleRowAction(row.id, fd, 'update')} className="flex flex-col gap-3">
                    <FieldInputs fields={fields} values={row.cells} />
                    <div className="flex items-center gap-2 self-end">
                      <button
                        type="button"
                        onClick={() => setEditingId(null)}
                        className="h-9 px-3 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        disabled={pending}
                        className="inline-flex items-center gap-2 h-9 px-4 rounded-lg bg-orange-600 text-white text-sm font-semibold hover:bg-orange-500 transition-colors disabled:opacity-50"
                      >
                        <Save className="w-4 h-4" />
                        Guardar
                      </button>
                    </div>
                  </form>
                </td>
              ) : (
                <>
                  {row.cells.map((cell, i) => (
                    <td key={i} className="px-3 py-3 text-slate-700">{cell}</td>
                  ))}
                  <td className="px-3 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingId(row.id)
                          setCreating(false)
                        }}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 px-2 py-1.5 rounded-md transition-colors"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                        Editar
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (!window.confirm('¿Seguro que deseas eliminar este registro?')) return
                          startTransition(async () => {
                            const result = await deleteAction(row.id)
                            if (result && !result.ok) setError(result.message ?? 'Error')
                          })
                        }}
                        disabled={pending}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 px-2 py-1.5 rounded-md transition-colors disabled:opacity-50"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Eliminar
                      </button>
                    </div>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function FieldInputs({
  fields,
  values,
}: {
  fields: CrudField[]
  values?: string[]
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {fields.map((f, i) => {
        const val = values?.[i] ?? ''
        return (
          <label key={f.name} className={`flex flex-col gap-1 ${f.type === 'textarea' ? 'md:col-span-2' : ''}`}>
            <span className="text-sm font-medium text-slate-700">{f.label}{f.required ? ' *' : ''}</span>
            {f.type === 'textarea' ? (
              <textarea
                name={f.name}
                required={f.required}
                defaultValue={val}
                rows={3}
                className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-4 focus:ring-orange-100"
              />
            ) : (
              <input
                name={f.name}
                type={f.type === 'number' ? 'number' : 'text'}
                required={f.required}
                defaultValue={val}
                className="h-11 rounded-md border border-slate-300 bg-white px-3 text-sm focus:border-orange-500 focus:outline-none focus:ring-4 focus:ring-orange-100"
              />
            )}
          </label>
        )
      })}
    </div>
  )
}
