import { createClient } from '@supabase/supabase-js'

/**
 * Cliente con la SERVICE ROLE key (usa el entorno del servidor).
 * Bypassa RLS; SOLO debe usarse en server actions / route handlers
 * del área de administración protegida por sesión admin.
 */
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
}
