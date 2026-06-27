import { redirect } from 'next/navigation'
import { hasSupabaseAdmin } from '@/lib/env'
import { getIsAuthed } from '@/lib/prompts'
import { createAdminClient } from '@/lib/supabase/admin'

export const metadata = { title: 'Dashboard, House Style' }
export const dynamic = 'force-dynamic'

interface Metrics {
  copies: number
  gatesTriggered: number
  gatesConverted: number
  conversionPct: number | null
  topPrompt: { slug: string; share: number } | null
}

// Real telemetry reads via the service-role client (bypasses RLS). The numbers
// that power the interview narrative: copies, Tier-2 conversion, hero share.
async function getMetrics(): Promise<Metrics | null> {
  if (!hasSupabaseAdmin) return null
  try {
    const supabase = createAdminClient()
    const [funnel, copyRows] = await Promise.all([
      supabase.from('gate_funnel').select('*').maybeSingle(),
      supabase.from('events').select('prompt_slug').eq('event', 'Prompt_Copied'),
    ])

    const rows = copyRows.data ?? []
    const copies = rows.length
    const counts = new Map<string, number>()
    for (const r of rows) {
      const k = r.prompt_slug ?? 'unknown'
      counts.set(k, (counts.get(k) ?? 0) + 1)
    }
    let topPrompt: Metrics['topPrompt'] = null
    if (copies > 0) {
      const [slug, n] = [...counts.entries()].sort((a, b) => b[1] - a[1])[0]
      topPrompt = { slug, share: Math.round((100 * n) / copies) }
    }

    return {
      copies,
      gatesTriggered: funnel.data?.gates_triggered ?? 0,
      gatesConverted: funnel.data?.gates_converted ?? 0,
      conversionPct: funnel.data?.conversion_rate_pct ?? null,
      topPrompt,
    }
  } catch {
    return null
  }
}

export default async function DashboardPage() {
  // Hard lock: the dashboard is private. Non-authed visitors never see it.
  const isAuthed = await getIsAuthed()
  if (!isAuthed) redirect('/sign-in?next=/dashboard')

  const metrics = await getMetrics()

  return (
    <main className="mx-auto max-w-shell px-6 py-14">
      <h1 className="font-serif text-3xl font-medium tracking-tight text-ink">
        Dashboard
      </h1>
      <p className="mt-4 text-sm text-muted">
        Live usage, copy events, Tier-2 gate conversion, and the hero framework.
      </p>

      {!hasSupabaseAdmin && (
        <p className="mt-2 text-xs text-muted">
          Add <code>SUPABASE_SERVICE_ROLE_KEY</code> to light up live numbers.
        </p>
      )}

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Metric label="Prompt copies" value={metrics ? String(metrics.copies) : '0'} />
        <Metric
          label="Tier-2 conversion"
          value={metrics?.conversionPct != null ? `${metrics.conversionPct}%` : '0%'}
          sub={
            metrics
              ? `${metrics.gatesConverted} / ${metrics.gatesTriggered} gates`
              : undefined
          }
        />
        <Metric
          label="Top framework (copy share)"
          value={metrics?.topPrompt ? `${metrics.topPrompt.share}%` : '0%'}
          sub={metrics?.topPrompt?.slug}
        />
      </div>
    </main>
  )
}

function Metric({
  label,
  value,
  sub,
}: {
  label: string
  value: string
  sub?: string
}) {
  return (
    <div className="rounded-md border border-line bg-surface p-5">
      <p className="text-xs text-muted">{label}</p>
      <p className="mt-2 font-serif text-3xl text-ink tabular-nums">{value}</p>
      {sub && <p className="mt-1 truncate text-[11px] text-muted">{sub}</p>}
    </div>
  )
}
