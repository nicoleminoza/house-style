import Link from 'next/link'
import { Sandbox, type SandboxPrompt } from '@/components/Sandbox'
import { getCatalogForClient, getIsAuthed } from '@/lib/prompts'

export const metadata = { title: 'Sandbox, House Style' }

// Interactive "fill the variables" sandbox. Only prompts whose payload is
// unlocked (all public prompts, plus premium when authed) can be filled here.
export default async function DemoPage() {
  const [catalog, isAuthed] = await Promise.all([
    getCatalogForClient(),
    getIsAuthed(),
  ])

  const prompts: SandboxPrompt[] = catalog
    .filter((p) => p.payload && p.variables.length > 0)
    .map((p) => ({
      slug: p.slug,
      title: p.title,
      category: p.category,
      variables: p.variables,
      payload: p.payload as string,
    }))

  return (
    <main className="mx-auto max-w-shell px-6 py-14">
      <h1 className="font-serif text-3xl font-medium tracking-tight text-ink">
        Sandbox
      </h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
        Fill a prompt&rsquo;s variables and copy the finished text. Premium
        frameworks unlock here once you sign in.
      </p>

      <div className="mt-8">
        <Sandbox prompts={prompts} isAuthed={isAuthed} />
      </div>

      <Link
        href="/"
        className="ring-focus mt-10 inline-block rounded text-sm text-accent hover:underline"
      >
        ← Back to the library
      </Link>
    </main>
  )
}
