import { Catalog } from '@/components/Catalog'
import { getCatalogForClient, getIsAuthed } from '@/lib/prompts'

// Server Component: payloads are resolved (and gated) on the server before any
// markup reaches the browser. Locked premium payloads are never serialized.
export default async function HomePage() {
  const [prompts, isAuthed] = await Promise.all([
    getCatalogForClient(),
    getIsAuthed(),
  ])

  return (
    <main className="mx-auto max-w-shell px-6">
      <section className="border-b border-line py-14">
        <h1 className="max-w-3xl font-serif text-4xl font-medium leading-[1.1] tracking-tight text-ink sm:text-5xl">
          Prompts with a point of view.
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted">
          A curated, AI-native library of enterprise brand and messaging
          frameworks — each assigns a sharp role, takes variables, and pushes for
          a sharper answer than the obvious one. Curation is the product.
        </p>
        <p className="mt-4 text-sm text-faint">
          {prompts.length} prompts, incl. 3 hero frameworks · all free, all
          copyable · A project by{' '}
          <a
            href="https://nicoleminoza.com"
            target="_blank"
            rel="noreferrer"
            className="text-muted underline decoration-line underline-offset-4 hover:text-accent"
          >
            Nicole Miñoza
          </a>
        </p>
        <p className="mt-3 text-sm text-muted">
          Want to operationalize one?{' '}
          <a href="/demo" className="text-accent hover:underline">
            Open the Sandbox
          </a>{' '}
          to fill the variables and save your versions.
        </p>
      </section>

      <Catalog prompts={prompts} isAuthed={isAuthed} />
    </main>
  )
}
