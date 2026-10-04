# Developing House Style

## Stack

- **Next.js (App Router)** + **Tailwind**: server-rendered, payloads resolved server-side
- **Supabase (Postgres + Auth)**: metadata/payload split, row-level security on premium prompts
- **PostHog**: active users, sign-ups, copy events

### Protecting the gated prompts

Public metadata (`prompts`) and prompt text (`prompt_payloads`) live in separate tables. Row-level security exposes public payloads to everyone and premium payloads only to signed-in users, so a premium prompt is never reachable by an anonymous client, even through the API. The catalog is a Server Component ([`app/page.tsx`](app/page.tsx)), and locked payloads are never sent to the browser.

## Run it locally

No backend needed:

```bash
npm install
npm run dev   # http://localhost:3000
```

Without Supabase environment variables, the app falls back to [`supabase/seed.json`](supabase/seed.json). Premium prompts show a locked state.

### Connect the backend

1. Create a Supabase project. Copy `.env.example` to `.env.local` and fill in the keys.
2. Apply the schema: run [`supabase/migrations/0001_init.sql`](supabase/migrations/0001_init.sql) in the Supabase SQL editor, or `supabase db push`.
3. Seed it: `npm run seed`.
4. Enable the Google and LinkedIn providers in Supabase Auth.
5. Optional: add PostHog keys to turn on the dashboard.

## Routes

- `/`: public catalog, with search and category and tag filters
- `/demo`: fill-the-variables sandbox
- `/method`, `/about`: the method behind the prompts, and the author
- `/dashboard`: telemetry view (in progress)

## Editing prompts

The source of truth is the typed library in [`content/prompts.ts`](content/prompts.ts), with categories in `content/categories.ts`. Edit prompts there, then regenerate the seed:

```bash
npm run export-seed   # content/prompts.ts → supabase/seed.json
```
