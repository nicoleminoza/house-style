// Exports the curated library (content/prompts.ts — the single source of truth)
// into the DB seed. Separates PUBLIC metadata (title, description, variables,
// tier) from the secret PAYLOAD string, per the IP-protection requirement.
// Run with:  npm run export-seed
//
// GATING DECISION (2026-06-26): the 41 curated prompts are ALL public — they are
// the portfolio proof and the engine of copy/feedback telemetry. The Tier-2 gate
// lives on the *workflow* (Sandbox save) and future "hero" builders, NOT on the
// library. `tier: 'premium'` is reserved for that net-new hero content.
import { writeFileSync, mkdirSync } from 'node:fs'
import { prompts } from '../content/prompts'

type SeedRow = {
  id: string
  slug: string
  title: string
  category: string
  tags: string[]
  description: string
  variables: string[]
  tier: 'public' | 'premium'
  payload: string
  char_count: number
}

// Pull [BRACKET] variables out of a payload, de-duped, names normalized to the
// part before any comma / "e.g." so "[SITUATION, e.g., reorg]" → "SITUATION".
function extractVariables(payload: string): string[] {
  const found = payload.match(/\[[^\]]+\]/g) ?? []
  const names = found.map((raw) =>
    raw
      .replace(/^\[|\]$/g, '')
      .split(/,| e\.g\.| — /i)[0]
      .trim(),
  )
  // Real fill-in variables are ALL-CAPS tokens (e.g. POSITIONING STATEMENT).
  // Drop lowercase calibration phrases like "the specific job no rival can claim".
  const isVariable = (name: string) => /[A-Z]/.test(name) && !/[a-z]/.test(name)
  return Array.from(new Set(names.filter(isVariable)))
}

const rows: SeedRow[] = prompts.map((p) => ({
  id: p.id,
  slug: p.id,
  title: p.title,
  category: p.category,
  tags: p.tags,
  description: p.description,
  variables: extractVariables(p.prompt),
  tier: 'public', // entire curated library is public; gate lives on the workflow
  payload: p.prompt,
  char_count: p.prompt.length,
}))

const OUT_DIR = new URL('../supabase/', import.meta.url).pathname
mkdirSync(OUT_DIR, { recursive: true })
writeFileSync(OUT_DIR + 'seed.json', JSON.stringify(rows, null, 2) + '\n')

console.log(`Wrote ${rows.length} prompts to seed.json — all public`)
