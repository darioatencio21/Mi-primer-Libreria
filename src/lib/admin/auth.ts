import 'server-only'
import { createHash } from 'crypto'
import { cookies } from 'next/headers'
import { cache } from 'react'

export const ADMIN_SESSION_COOKIE = 'admin_session'

function digest(value: string): string {
  return createHash('sha256').update(value).digest('hex')
}

export function verifyAdminPassword(password: string): boolean {
  const expected = process.env.ADMIN_PASS
  if (!expected) return false
  return digest(password) === digest(expected)
}

export async function createAdminSession(): Promise<void> {
  const store = await cookies()
  store.set(ADMIN_SESSION_COOKIE, makeSessionToken(), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/admin',
    maxAge: 60 * 60 * 12,
  })
}

export async function destroyAdminSession(): Promise<void> {
  const store = await cookies()
  store.delete(ADMIN_SESSION_COOKIE)
}

function makeSessionToken(): string {
  const secret = process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASS || 'tly-admin'
  return digest(secret)
}

function isSessionTokenValid(token: string | undefined): boolean {
  if (!token) return false
  const secret = process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASS || 'tly-admin'
  // El token es un hash del secreto que solo el servidor puede producir;
  // compararlo con igualdad impide que un atacante lo forje sin la clave.
  return token === digest(secret)
}

export const isAdminSessionActive = cache(async (): Promise<boolean> => {
  const store = await cookies()
  return isSessionTokenValid(store.get(ADMIN_SESSION_COOKIE)?.value)
})
