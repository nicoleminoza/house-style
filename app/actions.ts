'use server'

import { hasSupabase } from '@/lib/env'
import { getPayload } from '@/lib/prompts'
import { createClient } from '@/lib/supabase/server'

/**
 * Server-gated unlock for a premium payload. The secret is fetched on the server
 * and only returned if the caller is allowed it (RLS / tier check). A guessed
 * slug from an anonymous client gets null.
 */
export async function unlockPayload(slug: string): Promise<string | null> {
  return getPayload(slug)
}

/**
 * Persist a telemetry event. Called fire-and-forget from the client analytics
 * wrapper. No-op until Supabase is wired. Stores the typed props in `metadata`.
 *
 * PRIVACY: callers only ever pass typed, non-sensitive props (ids, booleans,
 * enums, variable KEYS — never variable values or pasted text).
 */
export async function logEvent(
  event: string,
  props: Record<string, unknown> = {},
): Promise<void> {
  if (!hasSupabase) return
  try {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    const promptSlug =
      typeof props.prompt_id === 'string' ? props.prompt_id : null
    await supabase.from('events').insert({
      event,
      prompt_slug: promptSlug,
      user_id: user?.id ?? null,
      metadata: props,
    })
  } catch {
    // Telemetry must never break a user action.
  }
}
