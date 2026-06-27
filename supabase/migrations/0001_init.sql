-- House Style — initial schema.
-- IP-protection architecture: PUBLIC metadata lives in `prompts` (anon-readable);
-- the secret string lives in `prompt_payloads`, where RLS only exposes premium
-- payloads to authenticated users. The two are split so the payload column is
-- never reachable by an anonymous client, even via the API.

create type prompt_tier as enum ('public', 'premium');

-- ── Public metadata ──────────────────────────────────────────────────────────
create table if not exists public.prompts (
  id          text primary key,
  slug        text unique not null,
  title       text not null,
  category    text not null,
  tags        text[] not null default '{}',
  description text not null,
  variables   text[] not null default '{}',
  tier        prompt_tier not null default 'public',
  char_count  integer not null default 0,
  created_at  timestamptz not null default now()
);

-- ── Secret payloads (separate table) ─────────────────────────────────────────
create table if not exists public.prompt_payloads (
  slug    text primary key references public.prompts(slug) on delete cascade,
  payload text not null
);

-- ── Telemetry ────────────────────────────────────────────────────────────────
-- Active users, sign-ups, and copy events. Anyone may INSERT (anon copy events);
-- only the service role may SELECT (the dashboard reads via server).
create table if not exists public.events (
  id         bigint generated always as identity primary key,
  event      text not null,           -- 'view' | 'copy' | 'signup' | 'unlock_attempt'
  prompt_slug text,
  user_id    uuid,
  metadata   jsonb not null default '{}',
  created_at timestamptz not null default now()
);
create index if not exists events_event_created_idx on public.events (event, created_at desc);

-- ── Row Level Security ───────────────────────────────────────────────────────
alter table public.prompts          enable row level security;
alter table public.prompt_payloads  enable row level security;
alter table public.events           enable row level security;

-- Metadata: readable by everyone (anon + authed).
create policy "prompts: public read"
  on public.prompts for select
  using (true);

-- Payloads for PUBLIC prompts: readable by everyone.
create policy "payloads: public prompts readable by all"
  on public.prompt_payloads for select
  using (
    exists (
      select 1 from public.prompts p
      where p.slug = prompt_payloads.slug and p.tier = 'public'
    )
  );

-- Payloads for PREMIUM prompts: readable only when authenticated.
create policy "payloads: premium prompts readable by authed"
  on public.prompt_payloads for select
  to authenticated
  using (
    exists (
      select 1 from public.prompts p
      where p.slug = prompt_payloads.slug and p.tier = 'premium'
    )
  );

-- Telemetry: anyone may insert an event; nobody may read via anon/authed
-- (the service-role key bypasses RLS for the dashboard).
create policy "events: anyone can insert"
  on public.events for insert
  with check (true);
