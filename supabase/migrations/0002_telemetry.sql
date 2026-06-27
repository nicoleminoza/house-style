-- House Style — telemetry/analytics extensions.
-- All events flow into the existing `events` table (event text + metadata jsonb),
-- so no new columns are needed. These indexes make the interview-grade queries
-- fast: funnel conversion, top prompts by copy, use-case + sentiment breakdowns.

-- Event vocabulary (stored in events.event):
--   Prompt_Copied                | metadata: prompt_id, prompt_title, is_premium, user_authenticated
--   Variable_Customized          | metadata: prompt_id, variable_key            (KEY only, never the value)
--   Gate_Triggered               | metadata: prompt_id, prompt_title
--   Gate_Converted               | metadata: prompt_id
--   Feedback_Use_Case_Submitted  | metadata: prompt_id, use_case
--   Feedback_Quality_Signal      | metadata: prompt_id, sentiment

-- Fast lookups by prompt (e.g. "% of copy events captured by the hero prompt").
create index if not exists events_prompt_slug_idx on public.events (prompt_slug);

-- Fast filtering inside metadata (e.g. use_case / sentiment / is_premium rollups).
create index if not exists events_metadata_gin_idx on public.events using gin (metadata);

-- Convenience rollup for the dashboard: one row per event type per day.
create or replace view public.event_daily as
select
  date_trunc('day', created_at) as day,
  event,
  count(*) as count
from public.events
group by 1, 2;

-- ── Funnel helper ────────────────────────────────────────────────────────────
-- Tier-2 gate conversion rate = Gate_Converted / Gate_Triggered. Exposed as a
-- view so the dashboard reads a single number for the interview narrative.
create or replace view public.gate_funnel as
select
  count(*) filter (where event = 'Gate_Triggered')  as gates_triggered,
  count(*) filter (where event = 'Gate_Converted')  as gates_converted,
  round(
    100.0 * count(*) filter (where event = 'Gate_Converted')
    / nullif(count(*) filter (where event = 'Gate_Triggered'), 0),
    1
  ) as conversion_rate_pct
from public.events;
