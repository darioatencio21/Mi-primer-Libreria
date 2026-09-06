import { NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db/client'
import { settings as settingsTable } from '@/lib/db/schema'
import {
  CHECKOUT_SETTINGS_KEY,
  DEFAULT_CHECKOUT_CONFIG,
  normalizeCheckoutConfig,
} from '@/lib/checkout-config'

export const dynamic = 'force-dynamic'

export async function GET() {
  const [row] = await db
    .select()
    .from(settingsTable)
    .where(eq(settingsTable.key, CHECKOUT_SETTINGS_KEY))
    .limit(1)

  return NextResponse.json(normalizeCheckoutConfig(row?.value) ?? DEFAULT_CHECKOUT_CONFIG)
}