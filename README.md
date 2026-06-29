# House Style — AI-Native Prompt Library & Executive Portfolio

A curated, open library of enterprise brand & messaging prompts. Public catalog
is zero-friction and instantly copyable; the most complex ~30% are gated behind
OAuth as a lead-gen / PLG demonstration.

> **Tagline:** Prompts with a point of view. · **By:** Nicole Miñoza

## Stack

- **Next.js (App Router)** + **Tailwind** — server-rendered, payloads resolved server-side
- **Supabase (Postgres + Auth)** — metadata/payload split, RLS-gated premium
- **PostHog** — active users, sign-ups, copy events

## Architecture: IP protection

Public metadata (`prompts`) and secret strings (`prompt_payloads`) live in
**separate tables**. RLS exposes public payloads to everyone but premium payloads
only to authenticated users — so a premium payload is never reachable by an
anonymous client, even through the API. The catalog is a Server Component
([app/page.tsx](app/page.tsx)); locked payloads are never serialized to the browser.

## Run it now (no backend needed)

```bash
npm install
npm run dev   # http://localhost:3000
```

Without Supabase env vars the app falls back to [supabase/seed.json](supabase/seed.json)
(the library of more than 40 prompts exported from the source data file). Premium prompts show
a locked state.

## Wire up the backend

1. Create a Supabase project; copy `.env.example` → `.env.local` and fill keys.
2. Apply the schema: run [supabase/migrations/0001_init.sql](supabase/migrations/0001_init.sql)
   in the Supabase SQL editor (or `supabase db push`).
3. Seed it: `npm run seed`.
4. Enable Google + LinkedIn providers in Supabase Auth.
5. (Optional) Add PostHog keys to light up the dashboard.

## Routes

- `/` — public catalog (search + category/tag filters)
- `/demo` — interactive "fill the variables" sandbox
- `/method`, `/about` — the method behind the prompts, and the bio
- `/dashboard` — secure telemetry view (shell)

## Source of truth & seed

The single source of truth is the typed library in **[`content/prompts.ts`](content/prompts.ts)**
(+ `content/categories.ts`). Edit prompts there, then regenerate the DB seed:

```bash
npm run export-seed   # content/prompts.ts → supabase/seed.json
```

`supabase/seed.json` is the build artifact the app reads (and `npm run seed`
loads into Supabase).
