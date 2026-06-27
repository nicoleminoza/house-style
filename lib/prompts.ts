// SERVER-ONLY data layer. Never import this from a Client Component — payloads
// must only be resolved on the server, gated by tier + auth.
import { hasSupabase } from './env'
import { seedRows, seedMeta } from './seed'
import { createClient } from './supabase/server'
import type { PromptForClient, PromptMeta } from './types'

/** Is the current request authenticated? Always false until Supabase is wired. */
export async function getIsAuthed(): Promise<boolean> {
  if (!hasSupabase) return false
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return Boolean(user)
}

/** Public-safe metadata for the whole catalog. No payloads. */
export async function getCatalogMeta(): Promise<PromptMeta[]> {
  if (!hasSupabase) return seedMeta

  const supabase = createClient()
  const { data, error } = await supabase
    .from('prompts')
    .select('id, slug, title, category, tags, description, variables, tier, char_count')
    .order('category')
  if (error || !data) return seedMeta

  return data.map((r) => ({
    id: r.id,
    slug: r.slug,
    title: r.title,
    category: r.category,
    tags: r.tags ?? [],
    description: r.description,
    variables: r.variables ?? [],
    tier: r.tier,
    charCount: r.char_count,
  }))
}

/**
 * The catalog as delivered to the client. Public payloads are inlined (instantly
 * copyable, zero friction). Premium payloads are included ONLY when the user is
 * authed; otherwise `payload` is null and `locked` is true — the secret string
 * never leaves the server for a locked prompt.
 */
export async function getCatalogForClient(): Promise<PromptForClient[]> {
  const isAuthed = await getIsAuthed()

  if (!hasSupabase) {
    return seedRows.map((r) => {
      const unlocked = r.tier === 'public' || isAuthed
      return {
        id: r.id,
        slug: r.slug,
        title: r.title,
        category: r.category,
        tags: r.tags,
        description: r.description,
        variables: r.variables,
        tier: r.tier,
        charCount: r.char_count,
        payload: unlocked ? r.payload : null,
        locked: !unlocked,
      }
    })
  }

  const supabase = createClient()
  const meta = await getCatalogMeta()
  // RLS only returns payloads the caller is allowed to read: all public rows,
  // plus premium rows when authenticated.
  const { data: payloads } = await supabase
    .from('prompt_payloads')
    .select('slug, payload')
  const payloadMap = new Map((payloads ?? []).map((p) => [p.slug, p.payload]))

  return meta.map((m) => {
    const payload = payloadMap.get(m.slug) ?? null
    return { ...m, payload, locked: payload === null && m.tier === 'premium' }
  })
}

/**
 * Fetch a single premium payload on demand (e.g. right after sign-in). Returns
 * null if the prompt is premium and the user isn't authed — the gate holds even
 * if the slug is guessed.
 */
export async function getPayload(slug: string): Promise<string | null> {
  if (!hasSupabase) {
    const row = seedRows.find((r) => r.slug === slug)
    if (!row) return null
    if (row.tier === 'public') return row.payload
    return (await getIsAuthed()) ? row.payload : null
  }

  const supabase = createClient()
  const { data } = await supabase
    .from('prompt_payloads')
    .select('payload')
    .eq('slug', slug)
    .maybeSingle()
  return data?.payload ?? null
}
