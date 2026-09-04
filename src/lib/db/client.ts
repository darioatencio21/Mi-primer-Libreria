import 'server-only'
import { drizzle, type NodePgDatabase } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from './schema'

export type Db = NodePgDatabase<typeof schema>
export { schema }

/**
 * Cliente de base de datos (Postgres + Drizzle) para el entorno del servidor.
 *
 * Se inicializa de forma perezosa: importar este módulo NO abre conexiones ni
 * lanza errores. Recién la primera operación real (query/insert...) construye
 * el pool (cacheado a nivel global). Esto permite `docker build` sin una DB
 * disponible e inyecta DATABASE_URL desde el runtime.
 */
const globalForDb = globalThis as unknown as {
  pool?: Pool
  db?: Db
}

function createDb(): Db {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    throw new Error(
      'Falta DATABASE_URL. Definila en .env.local o en el compose (postgres://user:pass@host:5432/db).'
    )
  }

  const pool = new Pool({ connectionString, max: 10 })
  globalForDb.pool = pool
  return drizzle(pool, { schema }) as Db
}

function ensureDb(): Db {
  if (!globalForDb.db) {
    globalForDb.db = createDb()
  }
  return globalForDb.db
}

export const db: Db = new Proxy({} as Db, {
  get(_target, prop, receiver) {
    const value = Reflect.get(ensureDb(), prop, receiver)
    return typeof value === 'function' ? value.bind(ensureDb()) : value
  },
})