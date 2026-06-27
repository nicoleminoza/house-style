import Link from 'next/link'

export const metadata = {
  title: 'About — House Style',
  description:
    'Why House Style exists, and how Nicole Miñoza approaches product. Curation is the product.',
}

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="font-serif text-3xl font-medium tracking-tight text-ink">
        About
      </h1>

      <div className="mt-6 space-y-5 text-[15px] leading-relaxed text-muted">
        <p>
          Most prompt collections are large and unfiltered. This one is small and
          filtered: every prompt is here for a reason.
        </p>
        <p>
          I spent 23 years in the creative-software industry, most recently
          leading product and product marketing for tools that scaled to 15M+
          MAU. Prompting became part of how I do the work: sharpening positioning,
          pressure-testing a strategy, getting to a credible first draft faster.
          The good prompts kept scattering across notes. This library collects
          them and makes them reusable.
        </p>
        <p>
          It also shows how I approach product: scope tightly, make the first try
          a win, and treat curation as the product. Built in Next.js and Supabase;
          the prompts live in a typed source file and curation happens in code
          review. The library is fully open — the gate sits on the workflow, not
          the ideas.
        </p>
        <p className="font-serif text-ink">Nicole Miñoza</p>
      </div>

      <div className="mt-8 flex items-center gap-4 text-sm">
        <a
          href="https://nicoleminoza.com"
          target="_blank"
          rel="noreferrer"
          className="text-accent hover:underline"
        >
          nicoleminoza.com ↗
        </a>
        <Link href="/method" className="text-muted hover:text-accent">
          Read the method →
        </Link>
      </div>
    </main>
  )
}
