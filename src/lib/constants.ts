export const SITE_NAME = 'Tus Libros Ya'
export const SITE_DESCRIPTION = 'Librería online premium — libros físicos, ebooks y audiolibros curados para lectores exigentes.'

export const CATEGORIES = [
  { name: 'Ficción', slug: 'ficcion', icon: 'book-open' },
  { name: 'No Ficción', slug: 'no-ficcion', icon: 'newspaper' },
  { name: 'Infantil', slug: 'infantil', icon: 'baby' },
  { name: 'Autoayuda', slug: 'autoayuda', icon: 'heart' },
  { name: 'Académico', slug: 'academico', icon: 'graduation-cap' },
  { name: 'Cómics', slug: 'comics', icon: 'image' },
  { name: 'Poesía', slug: 'poesia', icon: 'feather' },
  { name: 'Ciencia', slug: 'ciencia', icon: 'atom' },
] as const

export const NAV_ITEMS = [
  { label: 'Inicio', href: '/' },
  { label: 'Libros', href: '/libros', hasMegaMenu: true },
  { label: 'Revistas', href: '/libros/revistas' },
  { label: 'Libros de Texto', href: '/libros/academico' },
  { label: 'Audiolibros', href: '/libros/audiolibros' },
  { label: 'Recomendados', href: '/libros/recomendados' },
  { label: 'Ofertas', href: '/libros/ofertas', highlight: true },
] as const

export const MEGA_MENU_COLUMNS = [
  {
    title: 'Ficción',
    items: ['Novela', 'Cuento', 'Ciencia Ficción', 'Fantasía', 'Misterio', 'Romance'],
  },
  {
    title: 'No Ficción',
    items: ['Biografía', 'Historia', 'Ensayo', 'Política', 'Filosofía', 'Arte'],
  },
  {
    title: 'Infantil/Juvenil',
    items: ['0-5 años', '6-8 años', '9-12 años', 'Young Adult', 'Cómics infantiles'],
  },
  {
    title: 'Académico',
    items: ['Ciencias', 'Ingeniería', 'Medicina', 'Derecho', 'Economía', 'Educación'],
  },
] as const

export const BENEFITS = [
  { icon: 'truck', title: 'Envío rápido', description: 'Recibe tu pedido en 24-48h' },
  { icon: 'shield-check', title: 'Pago 100% seguro', description: 'Encriptación de extremo a extremo' },
  { icon: 'rotate-ccw', title: 'Devoluciones fáciles', description: '30 días para devolver sin preguntas' },
  { icon: 'headphones', title: 'Atención personalizada', description: 'Libreros reales te ayudan a elegir' },
] as const

export const PROMO_MESSAGES = [
  'Envío gratis en pedidos desde $50.000',
  'Devoluciones gratuitas en 30 días',
  '10% de descuento en tu primera compra con el código TUYA10',
] as const
