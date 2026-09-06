import { getReseñasConLibro, listLibrosParaSeleccionar } from '@/lib/admin/data'
import { PageHeader } from '../_components'
import { CrudManager } from '../_crud'
import { crearReseña, actualizarReseña, eliminarReseña } from '../../actions'

export default async function AdminReseñasPage() {
  const reseñas = await getReseñasConLibro()
  const libros = await listLibrosParaSeleccionar()

  return (
    <div>
      <PageHeader
        title="Reseñas de clientes"
        description="Agregá o eliminá los comentarios que se muestran en la tienda"
      />
      <CrudManager
        title="Lista de reseñas"
        description={`${reseñas.length} reseñas publicadas`}
        fields={[
          {
            name: 'book',
            label: 'Libro',
            type: 'select',
            display: 'bookTitle',
            help: 'Opcional. Dejalo vacío para un testimonio general.',
            options: libros.map((l) => ({ value: l.id, label: l.title })),
          },
          { name: 'userName', label: 'Cliente', required: true },
          { name: 'rating', label: 'Calificación (1-5)', type: 'number', required: true },
          { name: 'title', label: 'Título' },
          { name: 'content', label: 'Comentario', type: 'textarea', required: true },
        ]}
        rows={reseñas as unknown as Record<string, unknown>[]}
        createAction={crearReseña}
        updateAction={actualizarReseña}
        deleteAction={eliminarReseña}
      />
    </div>
  )
}