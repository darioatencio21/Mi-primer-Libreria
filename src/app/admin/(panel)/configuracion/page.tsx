import { getCheckoutConfig } from '@/lib/admin/data'
import { PageHeader } from '../_components'
import { CheckoutConfigForm } from './_checkout-config-form'

export default async function AdminConfiguracionPage() {
  const config = await getCheckoutConfig()

  return (
    <div>
      <PageHeader
        title="Configuración"
        description="Métodos de pago, tiempos de entrega y precios que se muestran al pagar"
      />
      <CheckoutConfigForm config={config} />
    </div>
  )
}