// Single source of truth for "is the backend wired up?" The app is designed to
// run fully on the local seed when Supabase isn't configured yet, then flip to
// the DB-backed, RLS-protected path once these are set.
export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''

export const hasSupabase = Boolean(supabaseUrl && supabaseAnonKey)

// Service-role key, server-only, never sent to the client. Powers the
// dashboard's event reads (bypasses RLS).
export const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? ''
export const hasSupabaseAdmin = hasSupabase && Boolean(supabaseServiceKey)

export const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY ?? ''
export const posthogHost =
  process.env.NEXT_PUBLIC_POSTHOG_HOST ?? 'https://us.i.posthog.com'
export const hasPostHog = Boolean(posthogKey)
