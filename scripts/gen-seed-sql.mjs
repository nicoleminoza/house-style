import { readFileSync, writeFileSync } from 'node:fs'
const rows = JSON.parse(readFileSync(new URL('../supabase/seed.json', import.meta.url),'utf8'))
const q = s => `$hs$${s}$hs$`
const arr = a => `ARRAY[${a.map(q).join(',')}]::text[]`
const prompts = rows.map(r => `('${r.id}','${r.slug}',${q(r.title)},${q(r.category)},${arr(r.tags)},${q(r.description)},${arr(r.variables)},'${r.tier}',${r.char_count})`).join(',\n')
const payloads = rows.map(r => `('${r.slug}',${q(r.payload)})`).join(',\n')
const sql = `insert into public.prompts (id,slug,title,category,tags,description,variables,tier,char_count) values\n${prompts}\non conflict (id) do nothing;\n\ninsert into public.prompt_payloads (slug,payload) values\n${payloads}\non conflict (slug) do nothing;\n`
writeFileSync(new URL('../supabase/seed.sql', import.meta.url), sql)
console.log('wrote seed.sql,', sql.length, 'bytes,', rows.length, 'rows')
