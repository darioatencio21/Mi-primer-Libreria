'use server'

import { redirect } from 'next/navigation'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db/client'
import { profiles, users } from '@/lib/db/schema'
import { hashPassword, verifyPassword } from './password'
import { createSession, destroySession } from './session'

export interface AuthResult {
  error?: string
}

export async function login(prev: AuthResult, formData: FormData): Promise<AuthResult> {
  const email = String(formData.get('email') ?? '').trim().toLowerCase()
  const password = String(formData.get('password') ?? '')

  if (!email || !password) return { error: 'Completá email y contraseña.' }

  const user = await db.query.users.findFirst({ where: eq(users.email, email) })
  if (!user) return { error: 'Email o contraseña incorrectos.' }

  const valid = await verifyPassword(password, user.passwordHash)
  if (!valid) return { error: 'Email o contraseña incorrectos.' }

  await createSession(user.id)
  redirect('/cuenta')
}

export async function register(prev: AuthResult, formData: FormData): Promise<AuthResult> {
  const email = String(formData.get('email') ?? '').trim().toLowerCase()
  const name = String(formData.get('name') ?? '').trim()
  const password = String(formData.get('password') ?? '')
  const confirmPassword = String(formData.get('confirm_password') ?? '')

  if (!name) return { error: 'Ingresá tu nombre y apellido.' }
  if (!email || !password) return { error: 'Completá email y contraseña.' }
  if (password !== confirmPassword) return { error: 'Las contraseñas no coinciden.' }
  if (password.length < 8) return { error: 'La contraseña debe tener al menos 8 caracteres.' }

  const existing = await db.query.users.findFirst({ where: eq(users.email, email) })
  if (existing) return { error: 'Ya existe una cuenta con ese email.' }

  const passwordHash = await hashPassword(password)

  const [user] = await db
    .insert(users)
    .values({ email, passwordHash, fullName: name })
    .returning()

  if (user) {
    await db.insert(profiles).values({ id: user.id, fullName: name })
  }

  await createSession(user.id)
  redirect('/cuenta')
}

export async function logout(): Promise<void> {
  await destroySession()
  redirect('/cuenta')
}