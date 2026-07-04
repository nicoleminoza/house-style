import type { Metadata } from 'next'
import { Catalog } from '@/components/Catalog'
import { getCatalogForClient, getIsAuthed } from '@/lib/prompts'
import { getSiteContext, getSiteOrigin } from '@/lib/site-context'

// Self-referential canonical for the homepage, on whichever host served it.
// Scoped to this segment so it never leaks onto subpages (/about, /demo, …).
export function generateMetadata(): Metadata {
  return { alternates: { canonical: getSiteOrigin() } }
}

// Server Component: payloads are resolved (and gated) on the server before any
// markup reaches the browser. Locked premium payloads are never serialized.
export default async function HomePage() {
  const [prompts, isAuthed] = await Promise.all([
    getCatalogForClient(),
    getIsAuthed(),
  ])
  const site = getSiteContext()

  return (
    <main className="mx-auto max-w-shell px-6">
      <section className="border-b border-line py-14">
        <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-accent-2">
          A project by{' '}
          <a
            href={site.bylineUrl}
            target="_blank"
            rel="noreferrer"
            className="hover:text-accent"
          >
            {site.bylineName}
          </a>
        </p>
        <h1 className="mt-3 font-serif text-5xl font-medium tracking-tight text-ink">
          House Style
        </h1>
        <p className="mt-2 font-serif text-xl italic text-muted">
          Prompts with a point of view.
        </p>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">
          AI prompts for marketing, brand, and product leaders. Free, no login.
        </p>

        <p className="mt-6 font-mono text-xs text-muted">
          {prompts.length} prompts, 3 categories ·{' '}
          <a href="/demo" className="text-accent hover:underline">
            Open the Sandbox →
          </a>
        </p>
      </section>

      <Catalog prompts={prompts} isAuthed={isAuthed} />
    </main>
  )
}
