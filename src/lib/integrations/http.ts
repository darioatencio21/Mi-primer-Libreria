import 'server-only'

/**
 * Cliente HTTP mínimo y tipado para comunicarse con un SaaS externo.
 * Prefiere el endpoint de api de Next (which se resuelve en runtime) o
 * una baseUrl configurada. Sirve como base para los adaptadores externos.
 */
export interface HttpOptions {
  baseUrl: string
  headers?: Record<string, string>
  timeoutMs?: number
}

export async function externalRequest<T>(
  path: string,
  options: HttpOptions & { method?: 'GET' | 'POST' | 'PUT' | 'PATCH'; body?: unknown }
): Promise<T> {
  const controller = new AbortController()
  const timeoutMs = options.timeoutMs ?? 10_000
  const timer = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const res = await fetch(`${options.baseUrl}${path}`, {
      method: options.method ?? 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers ?? {}),
      },
      body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
      signal: controller.signal,
      cache: 'no-store',
    })

    if (!res.ok) {
      const text = await res.text().catch(() => '')
      throw new Error(`SaaS HTTP ${res.status}: ${text.slice(0, 200)}`)
    }

    if (res.status === 204) return undefined as T
    return (await res.json()) as T
  } finally {
    clearTimeout(timer)
  }
}
