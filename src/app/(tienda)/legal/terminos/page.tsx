import type { Metadata } from 'next'
import { LegalPage } from '@/components/legal/LegalPage'

export const metadata: Metadata = {
  title: 'Términos y condiciones',
  description: 'Términos y condiciones de uso de tuslibrosya.',
}

export default function TerminosPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Términos y condiciones"
      updatedAt="2 de septiembre de 2026"
      description="Estos términos regulan el uso de nuestra tienda online y la compra de libros a través de tuslibrosya."
      sections={[
        {
          title: '1. Aceptación de los términos',
          body: [
            'Al acceder y utilizar tuslibrosya, aceptás estos Términos y Condiciones en su totalidad. Si no estás de acuerdo con alguna parte de ellos, te pedimos que no utilices el sitio.',
            'Podemos actualizar estos términos periódicamente. La versión vigente será la publicada en esta página con su fecha de actualización.',
          ],
        },
        {
          title: '2. Productos y precios',
          body: [
            'Todos los precios se expresan en pesos argentinos (ARS) e incluyen los impuestos aplicables según la legislación vigente, salvo que se indique lo contrario.',
            'Nos reservamos el derecho de modificar precios y disponibilidad de productos en cualquier momento sin previo aviso.',
            'Las imágenes de los productos son de carácter referencial y pueden no reflejar exactamente la edición final.',
          ],
        },
        {
          title: '3. Realización de pedidos',
          body: [
            'Al confirmar un pedido, declarás que la información de contacto y envío proporcionada es correcta y completa.',
            'Nos reservamos el derecho de rechazar o cancelar pedidos en caso de errores de precio, falta de stock u otras circunstancias, con el correspondiente reintegro en caso de haber efectuado el pago.',
          ],
        },
        {
          title: '4. Pagos',
          body: [
            'Los pagos se procesan de forma segura a través de los medios de pago habilitados en el checkout.',
            'La información de tu tarjeta nunca se almacena en nuestros servidores.',
          ],
        },
        {
          title: '5. Envíos y entregas',
          body: [
            'Los plazos de entrega son estimados y dependen de la disponibilidad de stock y de la empresa de logística.',
            'En caso de demoras por causas ajenas a nuestro control, te informaremos a la brevedad.',
          ],
        },
        {
          title: '6. Devoluciones y garantías',
          body: [
            'Disponés de hasta 30 días desde la recepción del pedido para solicitar una devolución por productos en perfecto estado.',
            'Los ebooks y audiolibros digitales, una vez descargados, no admiten devolución salvo fallo técnico comprobado.',
          ],
        },
        {
          title: '7. Responsabilidad',
          body: [
            'Nuestro sitio se ofrece "tal cual". No garantizamos que el acceso sea ininterrumpido ni libre de errores.',
            'En ningún caso seremos responsables por daños indirectos o consecuentes derivados del uso del sitio.',
          ],
        },
      ]}
    />
  )
}
