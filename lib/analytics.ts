// ─────────────────────────────────────────────────────────────────────────────
// Central analytics wrapper. THE single place to swap telemetry backends.
//
// Import only from Client Components, it uses posthog-js. Every event is fully
// typed, and the payloads are non-blocking (fire-and-forget): a slow or failing
// sink can never delay or break a user action.
//
// PRIVACY GUARDRAIL: events only ever carry ids, booleans, and enums. We never
// pass variable VALUES or pasted text. `Variable_Customized` carries the
// variable KEY only, that a field changed, not what was typed.
// ─────────────────────────────────────────────────────────────────────────────
import posthog from 'posthog-js'
import { track as vercelTrack } from '@vercel/analytics'
import { hasPostHog } from './env'
import { logEvent } from '@/app/actions'

export type UseCase = 'client_work' | 'in_house_brand' | 'personal_project'
export type Sentiment = 'positive' | 'negative'

/** The full, typed event catalog. Add new events here and nowhere else. */
export type AnalyticsEvent =
  | {
      name: 'Prompt_Copied'
      props: {
        prompt_id: string
        prompt_title: string
        is_premium: boolean
        user_authenticated: boolean
      }
    }
  | { name: 'Variable_Customized'; props: { prompt_id: string; variable_key: string } }
  | { name: 'Gate_Triggered'; props: { prompt_id: string; prompt_title: string } }
  | { name: 'Gate_Converted'; props: { prompt_id?: string } }
  | {
      name: 'Feedback_Use_Case_Submitted'
      props: { prompt_id: string; use_case: UseCase }
    }
  | { name: 'Feedback_Quality_Signal'; props: { prompt_id: string; sentiment: Sentiment } }

type EventName = AnalyticsEvent['name']
type PropsFor<N extends EventName> = Extract<AnalyticsEvent, { name: N }>['props']

/**
 * The one dispatch point. Fans out to every configured sink. To migrate from
 * Supabase logs to PostHog-only (or vice-versa), change ONLY this function.
 */
function dispatch(name: EventName, props: Record<string, unknown>): void {
  // Dev-only trace so events are observable without a backend wired.
  if (process.env.NODE_ENV !== 'production' && typeof window !== 'undefined') {
    // eslint-disable-next-line no-console
    console.debug('[analytics]', name, props)
  }
  // Sink 1: PostHog (client). No-op when unconfigured.
  try {
    if (hasPostHog && typeof window !== 'undefined') {
      posthog.capture(name, props)
    }
  } catch {
    /* never throw from telemetry */
  }
  // Sink 2: Supabase events table (via server action). Fire-and-forget.
  void logEvent(name, props)
  // Sink 3: Vercel Web Analytics (cookieless). A lightweight copy event.
  if (name === 'Prompt_Copied') {
    try {
      vercelTrack('copy', {
        prompt_id: String(props.prompt_id ?? ''),
        is_premium: Boolean(props.is_premium),
      })
    } catch {
      /* never throw from telemetry */
    }
  }
}

/** Type-safe, non-blocking event tracking. */
export function track<N extends EventName>(name: N, props: PropsFor<N>): void {
  dispatch(name, props as Record<string, unknown>)
}

// ── Gate conversion plumbing ─────────────────────────────────────────────────
// A conversion spans two page loads (gate → OAuth → return), so we remember the
// gated prompt in sessionStorage and fire Gate_Converted on the way back.
const GATE_KEY = 'hs_gate_pending'

/** Call when a non-authed user hits a premium gate. */
export function rememberGate(promptId: string): void {
  try {
    sessionStorage.setItem(GATE_KEY, promptId)
  } catch {
    /* storage blocked, conversion just won't be attributed */
  }
}

/**
 * Call once after a successful sign-in (e.g. in the OAuth callback). If the user
 * arrived via a gate, fires Gate_Converted attributed to that prompt and clears.
 */
export function consumeGateConversion(): void {
  try {
    const pending = sessionStorage.getItem(GATE_KEY)
    if (pending) {
      track('Gate_Converted', { prompt_id: pending })
      sessionStorage.removeItem(GATE_KEY)
    }
  } catch {
    /* ignore */
  }
}
