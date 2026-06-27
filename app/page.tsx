import { Catalog } from '@/components/Catalog'
import { getCatalogForClient, getIsAuthed } from '@/lib/prompts'
import { isHero } from '@/lib/heroes'

// Server Component: payloads are resolved (and gated) on the server before any
// markup reaches the browser. Locked premium payloads are never serialized.
export default async function HomePage() {
  const [prompts, isAuthed] = await Promise.all([
    getCatalogForClient(),
    getIsAuthed(),
  ])
  const heroCount = prompts.filter((p) => isHero(p.slug)).length

  return (
    <main className="mx-auto max-w-shell px-6">
      <section className="border-b border-line py-14">
        <h1 className="font-serif text-5xl font-medium tracking-tight text-ink">
          House Style
        </h1>
        <p className="mt-3 font-serif text-xl text-muted">
          Prompts with a point of view.
        </p>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">
          Curated AI prompts for marketing, brand, and product leaders.
        </p>
        <p className="mt-2 text-base font-medium text-ink">
          Curation is the product.
        </p>

        <div className="mt-6 space-y-1 text-sm text-faint">
          <p>
            {prompts.length} prompts across 3 categories, including {heroCount}{' '}
            hero frameworks · Free, no login
          </p>
          <p>
            A project by{' '}
            <a
              href="https://nicoleminoza.com"
              target="_blank"
              rel="noreferrer"
              className="text-muted underline decoration-line underline-offset-4 hover:text-accent"
            >
              Nicole Miñoza
            </a>
          </p>
        </div>

        <p className="mt-4 text-sm text-muted">
          Want to use one?{' '}
          <a href="/demo" className="text-accent hover:underline">
            Open the Sandbox
          </a>{' '}
          to fill in the variables and save your version.
        </p>
      </section>

      <Catalog prompts={prompts} isAuthed={isAuthed} />
    </main>
  )
}
