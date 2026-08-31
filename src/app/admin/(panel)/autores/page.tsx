import { getAutoresConConteo } from '@/lib/admin/data'
import { PageHeader, Table } from '../_components'
import { CrudManager } from '../_crud'
import { crearAutor, actualizarAutor, eliminarAutor } from '../../actions'

export default async function AdminAutoresPage() {
  const autores = await getAutoresConConteo()

  return (
    <div>
      <PageHeader title="Autores" description="Gestiona los autores de tu catálogo" />
      <CrudManager
        title="Lista de autores"
        description={`${autores.length} autores registrados`}
        fields={[
          { name: 'name', label: 'Nombre', required: true },
          { name: 'bio', label: 'Biografía', type: 'textarea' },
          { name: 'bookCount', label: 'Libros' },
        ]}
        rows={autores as unknown as Record<string, unknown>[]}
        createAction={crearAutor}
        updateAction={actualizarAutor}
        deleteAction={eliminarAutor}
      />
    </div>
  )
}
