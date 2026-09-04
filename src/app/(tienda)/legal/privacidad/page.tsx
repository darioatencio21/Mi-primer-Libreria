import type { Metadata } from 'next'
import { LegalPage } from '@/components/legal/LegalPage'

export const metadata: Metadata = {
  title: 'Política de privacidad',
  description: 'Cómo tratamos tus datos personales en tuslibrosya.',
}

export default function PrivacidadPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Política de privacidad"
      updatedAt="2 de septiembre de 2026"
      description="En tuslibrosya cuidamos tu privacidad. Esta política explica qué datos recopilamos, cómo los usamos y qué derechos tenés."
      sections={[
        {
          title: '1. Datos que recopilamos',
          body: [
            'Recopilamos los datos que nos proporcionás al crear una cuenta o realizar un pedido: nombre, correo electrónico, dirección de envío y datos de facturación.',
            'También recopilamos datos de uso de forma anónima para mejorar la experiencia, como páginas visitadas y dispositivos utilizados.',
          ],
        },
        {
          title: '2. Uso de los datos',
          body: [
            'Usamos tus datos para procesar y entregar tus pedidos, gestionar tu cuenta, enviarte comunicaciones relacionadas con la compra y, si lo autorizaste, novedades editoriales.',
            'Nunca vendemos tus datos personales a terceros.',
          ],
        },
        {
          title: '3. Bases legales',
          body: [
            'Tratamos tus datos bajo la Ley N° 25.326 de Protección de Datos Personales de la República Argentina y con tu consentimiento, la ejecución de contratos y obligaciones legales.',
          ],
        },
        {
          title: '4. Almacenamiento y seguridad',
          body: [
            'Tus datos se almacenan de forma encriptada en servidores seguros y solo son accesibles por personal autorizado.',
            'Implementamos medidas técnicas y organizativas para proteger tu información frente a accesos no autorizados.',
          ],
        },
        {
          title: '5. Tus derechos',
          body: [
            'De acuerdo con la Ley 25.326, podés ejercer los derechos de acceso, rectificación, actualización y supresión de tus datos personales.',
            'Para ejercerlos, escribinos a privacidad@tuslibrosya.com.ar. En caso de que consideres que el tratamiento no cumple la normativa, también podés recurrir a la Agencia de Acceso a la Información Pública (AAIP).',
          ],
        },
        {
          title: '6. Conservación',
          body: [
            'Conservamos tus datos solo durante el tiempo necesario para cumplir los fines para los que fueron recopilados y las obligaciones legales aplicables.',
          ],
        },
      ]}
    />
  )
}
