'use server'

import { randomBytes, createHash } from 'crypto'
import { eq } from 'drizzle-orm'
import { getCurrentUser } from '@/lib/auth/session'
import { db } from '@/lib/db/client'
import { users } from '@/lib/db/schema'
import { placeOrder } from '@/lib/integrations'
import { sanitizeInput } from '@/lib/sanitize'
import type { Address, BookFormat } from '@/lib/types'

export interface CheckoutItemInput {
  bookId: string
  title: string
  format: BookFormat['type']
  quantity: number
  price: number
}

export interface CheckoutInput {
  email: string
  fullName: string
  street: string
  city: string
  postalCode: string
  country: string
  phone: string
  shippingMethodId: string
  items: CheckoutItemInput[]
  subtotal: number
  shipping: number
  tax: number
  total: number
}

export interface CheckoutResult {
  ok: boolean
  orderId?: string
  orderNumber?: string
  message?: string
  outOfStock?: { bookId: string; requested: number; remaining: number }[]
}

const MAX = {
  email: 40,
  fullName: 30,
  street: 30,
  city: 25,
  postalCode: 10,
  phone: 20,
} as const

function clean(value: unknown, max: number): string {
  return sanitizeInput(String(value ?? '')).slice(0, max)
}

async function resolveUserId(email: string, fullName: string): Promise<string> {
  const current = await getCurrentUser()
  if (current) return current.id

  const existing = await db.query.users.findFirst({
    where: eq(users.email, email),
  })
  if (existing) return existing.id

  const [guest] = await db
    .insert(users)
    .values({
      email,
      fullName,
      passwordHash: `guest-${createHash('sha256').update(randomBytes(32)).digest('hex')}`,
    })
    .returning({ id: users.id })
  if (!guest) throw new Error('No se pudo crear la cuenta de invitado.')
  return guest.id
}

export async function submitCheckout(input: CheckoutInput): Promise<CheckoutResult> {
  try {
    const email = clean(input.email, MAX.email)
    if (!email) return { ok: false, message: 'El email es obligatorio.' }

    const address: Address = {
      fullName: clean(input.fullName, MAX.fullName),
      street: clean(input.street, MAX.street),
      city: clean(input.city, MAX.city),
      postalCode: clean(input.postalCode, MAX.postalCode),
      country: clean(input.country, 30) || 'Argentina',
      phone: clean(input.phone, MAX.phone),
    }

    const items = (Array.isArray(input.items) ? input.items : [])
      .slice(0, 50)
      .map((item) => ({
        bookId: String(item.bookId ?? '').slice(0, 64),
        title: clean(item.title, 200),
        format: item.format,
        quantity: Math.min(10, Math.max(1, Math.round(Number(item.quantity) || 1))),
        price: Math.max(0, Number(item.price) || 0),
      }))
      .filter((item) => item.bookId && item.title)

    if (items.length === 0) return { ok: false, message: 'El carrito está vacío.' }

    const userId = await resolveUserId(email, address.fullName)

    const subtotal = Math.max(0, Number(input.subtotal) || 0)
    const shipping = Math.max(0, Number(input.shipping) || 0)
    const tax = Math.max(0, Number(input.tax) || 0)
    const total = Math.max(0, Number(input.total) || 0)

    const result = await placeOrder({
      userId,
      email,
      lines: items,
      subtotal,
      shipping,
      tax,
      total,
      shippingAddress: address,
      shippingMethodId: String(input.shippingMethodId ?? '').slice(0, 40) || undefined,
    })

    return {
      ok: result.ok,
      orderId: result.orderId,
      orderNumber: result.orderNumber,
      message: result.message,
      outOfStock: result.outOfStock,
    }
  } catch (err) {
    return {
      ok: false,
      message: err instanceof Error ? err.message : 'No se pudo confirmar el pedido.',
    }
  }
}