import 'server-only'
import { createHash, randomBytes } from 'crypto'
import { cookies } from 'next/headers'
import { cache } from 'react'
import { and, eq, gt } from 'drizzle-orm'
import { db } from '@/lib/db/client'
import { sessions, users } from '@/lib/db/schema'

export const SESSION_COOKIE = 'session'
const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000

function sha256(value: string): string {
  return createHash('sha256').update(value).digest('hex')
}

export async function createSession(userId: string): Promise<void> {
  const token = randomBytes(32).toString('base64url')
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS).toISOString()

  await db.insert(sessions).values({ userId, tokenHash: sha256(token), expiresAt })

  const store = await cookies()
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: SESSION_TTL_MS / 1000,
  })
}

export async function destroySession(): Promise<void> {
  const store = await cookies()
  const token = store.get(SESSION_COOKIE)?.value
  store.delete(SESSION_COOKIE)
  if (!token) return
  await db.delete(sessions).where(eq(sessions.tokenHash, sha256(token)))
}

export interface SessionUser {
  id: string
  email: string
  name: string | null
}

export const getCurrentUser = cache(async (): Promise<SessionUser | null> => {
  const store = await cookies()
  const token = store.get(SESSION_COOKIE)?.value
  if (!token) return null

  const now = new Date().toISOString()
  const session = await db.query.sessions.findFirst({
    where: and(eq(sessions.tokenHash, sha256(token)), gt(sessions.expiresAt, now)),
  })
  if (!session) return null

  const user = await db.query.users.findFirst({ where: eq(users.id, session.userId) })
  if (!user) return null

  return { id: user.id, email: user.email, name: user.fullName }
})