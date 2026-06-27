import { readFileSync, writeFileSync } from 'node:fs'
const rows = JSON.parse(readFileSync(new URL('../supabase/seed.json', import.meta.url),'utf8'))
const heroes = rows.filter(r => ['exec-voice-matrix','pmm-positioning-system','ai-launch-os'].includes(r.id))
const q = s => `$hs$${s}$hs$`
const arr = a => `ARRAY[${a.map(q).join(',')}]::text[]`
const p = heroes.map(r => `('${r.id}','${r.slug}',${q(r.title)},${q(r.category)},${arr(r.tags)},${q(r.description)},${arr(r.variables)},'${r.tier}',${r.char_count})`).join(',\n')
const pay = heroes.map(r => `('${r.slug}',${q(r.payload)})`).join(',\n')
const sql = `insert into public.prompts (id,slug,title,category,tags,description,variables,tier,char_count) values\n${p}\non conflict (id) do nothing;\n\ninsert into public.prompt_payloads (slug,payload) values\n${pay}\non conflict (slug) do nothing;\n`
writeFileSync(new URL('../supabase/heroes.sql', import.meta.url), sql)
console.log('wrote heroes.sql,', sql.length, 'bytes,', heroes.length, 'heroes')
