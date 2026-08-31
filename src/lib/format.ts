/**
 * Formatea un valor numérico como precio en pesos argentinos.
 * Ej.: 34990 -> "$ 34.990"
 */
export function formatArs(value: number | string | null | undefined): string {
  const n = typeof value === 'string' ? parseFloat(value) : value
  if (n == null || isNaN(n)) return '$ 0'
  const rounded = Math.round(n)
  return `$ ${rounded.toLocaleString('es-AR')}`
}

/**
 * Convierte un precio en dólares a pesos usando la tasa configurada.
 * La tasa se lee de la variable de entorno AR_USD_RATE (el propio server).
 */
export function usdToArs(value: number): number {
  const rate = parseFloat(process.env.AR_USD_RATE || '1300')
  const result = value * (isNaN(rate) || rate <= 0 ? 1300 : rate)
  return Math.round(result)
}
