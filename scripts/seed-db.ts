// Loads supabase/seed.json into the database. Uses the service-role key (server
// only) to upsert metadata into `prompts` and secret strings into
// `prompt_payloads`. Run after applying the migration:  npm run seed
import { readFileSync } from 'node:fs'
import { createClient } from '@supabase/supabase-js'
import type { SeedRow } from '../lib/types'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!url || !serviceKey) {
  console.error(
    'Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. Set them in .env.local first.',
  )
  process.exit(1)
}

const rows = JSON.parse(
  readFileSync(new URL('../supabase/seed.json', import.meta.url), 'utf8'),
) as SeedRow[]

const supabase = createClient(url, serviceKey, {
  auth: { persistSession: false },
})

async function main() {
  const metadata = rows.map((r) => ({
    id: r.id,
    slug: r.slug,
    title: r.title,
    category: r.category,
    tags: r.tags,
    description: r.description,
    variables: r.variables,
    tier: r.tier,
    char_count: r.char_count,
  }))
  const payloads = rows.map((r) => ({ slug: r.slug, payload: r.payload }))

  const { error: e1 } = await supabase.from('prompts').upsert(metadata)
  if (e1) throw e1
  const { error: e2 } = await supabase.from('prompt_payloads').upsert(payloads)
  if (e2) throw e2

  const premium = rows.filter((r) => r.tier === 'premium').length
  console.log(
    `Seeded ${rows.length} prompts — ${premium} premium / ${rows.length - premium} public`,
  )
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
