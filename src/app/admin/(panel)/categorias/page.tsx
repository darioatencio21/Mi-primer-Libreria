import { getCategoriasConConteo } from '@/lib/admin/data'
import { PageHeader } from '../_components'
import { CrudManager } from '../_crud'
import { crearCategoria, actualizarCategoria, eliminarCategoria } from '../../actions'

export default async function AdminCategoriasPage() {
  const categorias = await getCategoriasConConteo()

  return (
    <div>
      <PageHeader title="Categorías" description="Gestiona las categorías del catálogo" />
      <CrudManager
        title="Lista de categorías"
        description={`${categorias.length} categorías registradas`}
        fields={[
          { name: 'name', label: 'Nombre', required: true },
          { name: 'description', label: 'Descripción', type: 'textarea' },
          { name: 'icon', label: 'Ícono', help: 'Nombre del ícono (ej: book-open)' },
          { name: 'sort_order', label: 'Orden' },
          { name: 'bookCount', label: 'Libros' },
        ]}
        rows={categorias as unknown as Record<string, unknown>[]}
        createAction={crearCategoria}
        updateAction={actualizarCategoria}
        deleteAction={eliminarCategoria}
      />
    </div>
  )
}
