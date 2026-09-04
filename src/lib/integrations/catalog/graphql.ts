import 'server-only'

export interface GraphQLResponse<D> {
  data?: D
  errors?: { message: string }[]
}

/**
 * Cliente GraphQL mínimo y tipado (sin dependencias externas).
 * Hace un POST a {endpoint} con la query/variables y devuelve `data`,
 * lanzando si hay errores de GraphQL o de red.
 */
export async function graphqlRequest<D>(
  endpoint: string,
  query: string,
  variables?: Record<string, unknown>,
  token?: string
): Promise<D> {
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ query, variables }),
    cache: 'no-store',
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`GraphQL HTTP ${res.status}: ${text.slice(0, 200)}`)
  }

  const json = (await res.json()) as GraphQLResponse<D>

  if (json.errors && json.errors.length > 0) {
    throw new Error(`GraphQL: ${json.errors.map((e) => e.message).join('; ')}`)
  }

  return json.data as D
}
