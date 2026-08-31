import { getAutoresConConteo, getCategoriasConConteo } from '@/lib/admin/data'
import { PageHeader } from '../../_components'
import { LibroForm } from '../_libro-form'

export default async function NuevoLibroPage() {
  const [autores, categorias] = await Promise.all([getAutoresConConteo(), getCategoriasConConteo()])
  return (
    <div>
      <PageHeader title="Nuevo libro" description="Completa los datos para agregar un libro al catálogo" />
      <LibroForm autores={autores} categorias={categorias} />
    </div>
  )
}
