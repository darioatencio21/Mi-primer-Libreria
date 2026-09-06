'use client'

import { useActionState } from 'react'
import { Save } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import type { FormatType } from '@/lib/db/types'
import { crearLibro, actualizarLibro } from '../../actions'

export interface LibroFormData {
  id?: string
  title: string
  slug: string
  autor_id: string
  categoria_id: string
  description: string
  price: string
  discount_price: string
  discount_percentage: string
  cover_image: string
  isbn: string
  publisher: string
  pages: string
  language: string
  publish_date: string
  dimensions: string
  stock: string
  is_bestseller: boolean
  is_new: boolean
  tags: string
  formato_hardcover_price: string
  formato_hardcover_stock: string
  formato_paperback_price: string
  formato_paperback_stock: string
  formato_ebook_price: string
  formato_ebook_stock: string
  formato_audiobook_price: string
  formato_audiobook_stock: string
  images: string
}

const FORMATOS: FormatType[] = ['hardcover', 'paperback', 'ebook', 'audiobook']
const FORMATO_LABELS: Record<FormatType, string> = {
  hardcover: 'Tapa dura',
  paperback: 'Tapa blanda',
  ebook: 'eBook',
  audiobook: 'Audiolibro',
}

interface AutoresProp { id: string; name: string }
interface CategoriasProp { id: string; name: string }

export function LibroForm({
  autores,
  categorias,
  initial,
  isEditing,
}: {
  autores: AutoresProp[]
  categorias: CategoriasProp[]
  initial?: LibroFormData | null
  isEditing?: boolean
}) {
  const action = isEditing
    ? actualizarLibro.bind(null, initial?.id ?? '')
    : crearLibro

  const [state, formAction, pending] = useActionState(action, null)
  const f = initial

  return (
    <form
      action={formAction}
      className="max-w-4xl bg-white rounded-xl border border-slate-200 p-4 flex flex-col gap-5 sm:p-6"
    >
      {state?.message && (
        <div className="rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3">
          {state.message}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <Input label="Título *" name="title" required defaultValue={f?.title ?? ''} inputSize="md" />
        </div>
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium text-slate-700">Autor *</span>
          <select
            name="autor_id"
            required
            defaultValue={f?.autor_id ?? ''}
            className="h-11 rounded-md border border-slate-300 bg-white px-3 text-sm focus:border-orange-500 focus:outline-none focus:ring-4 focus:ring-orange-100"
          >
            <option value="">Selecciona un autor</option>
            {autores.map((a) => (
              <option key={a.id} value={a.id}>{a.name}</option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium text-slate-700">Categoría *</span>
          <select
            name="categoria_id"
            required
            defaultValue={f?.categoria_id ?? ''}
            className="h-11 rounded-md border border-slate-300 bg-white px-3 text-sm focus:border-orange-500 focus:outline-none focus:ring-4 focus:ring-orange-100"
          >
            <option value="">Selecciona una categoría</option>
            {categorias.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </label>

        <div className="md:col-span-2">
          <Input label="Descripción" name="description" defaultValue={f?.description ?? ''} />
        </div>

        <Input label="Precio base (ARS$)*" name="price" type="number" step="0.01" defaultValue={f?.price ?? ''} required />
        <Input label="Precio oferta" name="discount_price" type="number" step="0.01" defaultValue={f?.discount_price ?? ''} />
        <Input label="Descuento (%)" name="discount_percentage" type="number" defaultValue={f?.discount_percentage ?? ''} />
        <Input label="Stock" name="stock" type="number" defaultValue={f?.stock ?? ''} />

        <Input label="Portada (URL)" name="cover_image" defaultValue={f?.cover_image ?? ''} />
        <Input label="ISBN" name="isbn" defaultValue={f?.isbn ?? ''} />
        <Input label="Editorial" name="publisher" defaultValue={f?.publisher ?? ''} />
        <Input label="Páginas" name="pages" type="number" defaultValue={f?.pages ?? ''} />
        <Input label="Idioma" name="language" defaultValue={f?.language ?? 'Español'} />
        <Input label="Fecha de publicación" name="publish_date" type="date" defaultValue={f?.publish_date ?? ''} />
        <Input label="Dimensiones" name="dimensions" defaultValue={f?.dimensions ?? ''} />
        <Input label="Etiquetas (separadas por coma)" name="tags" defaultValue={f?.tags ?? ''} />
        <Input label="Imágenes extras (URLs separadas por coma)" name="images" defaultValue={f?.images ?? ''} />

        <div className="flex items-center gap-6 md:col-span-2 pt-1">
          <label className="inline-flex items-center gap-2 text-sm text-slate-700">
            <input type="checkbox" name="is_bestseller" defaultChecked={f?.is_bestseller} className="w-4 h-4 accent-orange-600" />
            Bestseller
          </label>
          <label className="inline-flex items-center gap-2 text-sm text-slate-700">
            <input type="checkbox" name="is_new" defaultChecked={f?.is_new} className="w-4 h-4 accent-orange-600" />
            Novedad
          </label>
        </div>
      </div>

      <div className="border-t border-slate-100 pt-5">
        <h3 className="text-sm font-semibold text-slate-900 mb-3">Formatos</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {FORMATOS.map((type) => (
            <div key={type} className="grid grid-cols-1 gap-2.5 rounded-xl border border-slate-200 bg-slate-50/60 p-4">
              <span className="mb-0.5 text-sm font-semibold text-slate-800">{FORMATO_LABELS[type]}</span>
              <label className="flex items-center justify-between gap-3">
                <span className="text-xs font-medium text-slate-500">Precio</span>
                <input
                  name={`format_${type}_price`}
                  type="number"
                  step="0.01"
                  defaultValue={f?.[`formato_${type}_price` as keyof LibroFormData] !== undefined ? String(f?.[(`formato_${type}_price`) as keyof LibroFormData]) : ''}
                  className="h-9 w-32 rounded-md border border-slate-300 bg-white px-3 text-right text-sm focus:border-orange-500 focus:outline-none"
                />
              </label>
              <label className="flex items-center justify-between gap-3">
                <span className="text-xs font-medium text-slate-500">Stock</span>
                <input
                  name={`format_${type}_stock`}
                  type="number"
                  defaultValue={f?.[`formato_${type}_stock` as keyof LibroFormData] !== undefined ? String(f?.[(`formato_${type}_stock`) as keyof LibroFormData]) : ''}
                  className="h-9 w-24 rounded-md border border-slate-300 bg-white px-3 text-right text-sm focus:border-orange-500 focus:outline-none"
                />
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3 justify-end pt-2">
        <Button type="submit" size="lg" loading={pending} icon={<Save className="w-4 h-4" />}>
          {isEditing ? 'Guardar cambios' : 'Crear libro'}
        </Button>
      </div>
    </form>
  )
}
