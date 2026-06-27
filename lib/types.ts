export type Category = 'PMM/GTM' | 'Executive' | 'AI & Creative Tools'
export type Tier = 'public' | 'premium'

/** Public-safe metadata — always sent to the client. Never includes payload. */
export interface PromptMeta {
  id: string
  slug: string
  title: string
  category: Category
  tags: string[]
  description: string
  variables: string[]
  tier: Tier
  charCount: number
}

/** The secret payload — only resolved server-side, gated by tier + auth. */
export interface PromptPayload {
  slug: string
  payload: string
}

/** A prompt as delivered to the client: metadata, plus payload ONLY when allowed. */
export interface PromptForClient extends PromptMeta {
  /** Present for public prompts, or premium prompts when the user is authed. Null when locked. */
  payload: string | null
  locked: boolean
}

/** Raw shape of supabase/seed.json (the export from the curated library). */
export interface SeedRow {
  id: string
  slug: string
  title: string
  category: Category
  tags: string[]
  description: string
  variables: string[]
  tier: Tier
  payload: string
  char_count: number
}
