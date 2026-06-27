import { cookies } from 'next/headers'
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { supabaseAnonKey, supabaseUrl } from '@/lib/env'

type CookieToSet = { name: string; value: string; options: CookieOptions }

/**
 * Request-scoped Supabase client bound to the user's auth cookies. RLS runs as
 * the signed-in user (or anon), which is what enforces premium-payload gating
 * at the database layer.
 */
export function createClient() {
  const cookieStore = cookies()
  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet: CookieToSet[]) {
        try {
          cookiesToSet.forEach(({ name, value, options }: CookieToSet) =>
            cookieStore.set(name, value, options),
          )
        } catch {
          // Called from a Server Component — middleware refreshes the session.
        }
      },
    },
  })
}
