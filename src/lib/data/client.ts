import { createClient as createSupabaseClient } from '@supabase/supabase-js'

const PLACEHOLDER_URL = 'https://tu-proyecto.supabase.co'
const PLACEHOLDER_KEY = 'tu-anon-key-aqui'

export function createDataClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key || url === PLACEHOLDER_URL || key === PLACEHOLDER_KEY) {
    throw new Error(
      'Supabase no está configurado. Completá NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY en .env.local y ejecutá las migraciones antes de usar la app.'
    )
  }

  return createSupabaseClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}