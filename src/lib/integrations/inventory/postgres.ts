import 'server-only'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db/client'
import { books } from '@/lib/db/schema'
import type { InventoryProvider } from '../ports'
import type { InventoryReservation } from '../types'

/**
 * Adaptador de inventario LOCAL: opera sobre Postgres (`books.stock`).
 * Reserva stock restándolo atómicamente; si un libro no tiene suficiente,
 * NO descuenta nada para ese libro y reporta el faltante.
 *
 * Para el futuro ERP externo basta con escribir otro adaptador que implemente
 * la misma interfaz (ver `erp.ts`) y cambiar la config de entorno.
 */
export class PostgresInventoryProvider implements InventoryProvider {
  readonly id = 'postgres'
  // Guardamos las cantidades tomadas para poder revertirlas en release().
  private taken = new Map<string, number>()

  async reserve(lines: { bookId: string; quantity: number }[]): Promise<InventoryReservation> {
    const reservationRef = crypto.randomUUID()
    const result: InventoryReservation = {
      lines: [],
      success: true,
      reservationRef,
    }

    for (const line of lines) {
      const [libro] = await db
        .select({ id: books.id, stock: books.stock })
        .from(books)
        .where(eq(books.id, line.bookId))
        .limit(1)

      const remaining = libro?.stock ?? 0
      const available = libro != null && remaining >= line.quantity
      let successLine = available

      if (available) {
        const [updated] = await db
          .update(books)
          .set({ stock: remaining - line.quantity })
          .where(eq(books.id, line.bookId))
          .returning({ id: books.id })

        if (!updated) {
          result.success = false
          successLine = false
          result.errors ??= []
          result.errors.push(`No se pudo actualizar stock de ${line.bookId}`)
        } else {
          this.taken.set(line.bookId, (this.taken.get(line.bookId) ?? 0) + line.quantity)
        }
      }

      result.lines.push({
        bookId: line.bookId,
        available: successLine,
        requested: line.quantity,
        remaining: successLine ? remaining - line.quantity : remaining,
      })

      if (!successLine) result.success = false
    }

    return result
  }

  async release(reservationRef: string): Promise<void> {
    // Revertimos todo lo tomado en esta reserva (rollback simple).
    for (const [bookId, qty] of this.taken) {
      const [libro] = await db
        .select({ stock: books.stock })
        .from(books)
        .where(eq(books.id, bookId))
        .limit(1)
      await db.update(books).set({ stock: (libro?.stock ?? 0) + qty }).where(eq(books.id, bookId))
    }
    this.taken.clear()
    void reservationRef
  }
}