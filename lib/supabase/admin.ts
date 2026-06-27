import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { supabaseServiceKey, supabaseUrl } from '@/lib/env'

/**
 * Service-role client — bypasses RLS. SERVER ONLY. Used by the dashboard to read
 * telemetry the anon/authed roles can't. Never import from a Client Component.
 */
export function createAdminClient() {
  return createSupabaseClient(supabaseUrl, supabaseServiceKey, {
    auth: { persistSession: false },
  })
}
