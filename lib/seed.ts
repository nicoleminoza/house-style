import seedJson from '@/supabase/seed.json'
import type { PromptMeta, SeedRow } from './types'

// The curated library, generated from the typed source in the Vite app.
// Used directly as the data source until Supabase is configured.
export const seedRows = seedJson as SeedRow[]

export function rowToMeta(row: SeedRow): PromptMeta {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    category: row.category,
    tags: row.tags,
    description: row.description,
    variables: row.variables,
    tier: row.tier,
    charCount: row.char_count,
  }
}

export const seedMeta: PromptMeta[] = seedRows.map(rowToMeta)
