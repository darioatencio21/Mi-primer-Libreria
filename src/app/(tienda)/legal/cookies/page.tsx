import type { Metadata } from 'next'
import { LegalPage } from '@/components/legal/LegalPage'

export const metadata: Metadata = {
  title: 'Política de cookies',
  description: 'Cómo usamos las cookies en tuslibrosya.',
}

export default function CookiesPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Política de cookies"
      updatedAt="2 de septiembre de 2026"
      description="Te contamos qué son las cookies, cuáles usamos en tuslibrosya y cómo podés gestionarlas."
      sections={[
        {
          title: '1. ¿Qué son las cookies?',
          body: [
            'Las cookies son pequeños archivos de texto que se guardan en tu dispositivo cuando visitás un sitio web. Nos ayudan a recordar tus preferencias y a entender cómo usás el sitio.',
          ],
        },
        {
          title: '2. Cookies que utilizamos',
          body: [
            'Cookies esenciales: necesarias para el funcionamiento básico del sitio, como mantener tu carrito de compras o el estado de inicio de sesión.',
            'Cookies de rendimiento y análisis: nos permiten medir el tráfico y mejorar la experiencia de forma anónima.',
            'Cookies de funcionalidad: recuerdan tus preferencias, como moneda, idioma o ubicación.',
          ],
        },
        {
          title: '3. Cookies de terceros',
          body: [
            'Podemos utilizar herramientas de terceros (por ejemplo, análisis de tráfico) que instalan sus propias cookies. Estos terceros solo las usan conforme a sus propias políticas de privacidad.',
          ],
        },
        {
          title: '4. Gestión de cookies',
          body: [
            'Podés aceptar, rechazar o configurar las cookies a través del aviso que se muestra al ingresar al sitio o desde la configuración de tu navegador.',
            'Deshabilitar ciertas cookies puede afectar el funcionamiento de algunas funciones del sitio, como el carrito.',
          ],
        },
        {
          title: '5. Contacto',
          body: [
            'Si tenés dudas sobre esta política de cookies, escribinos a privacidad@tuslibrosya.com.ar.',
          ],
        },
      ]}
    />
  )
}
