import Link from 'next/link'

export const metadata = {
  title: 'About, House Style',
  description:
    'Why House Style exists, and how Nicole Miñoza approaches product. Curation is the product.',
}

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="font-serif text-3xl font-medium tracking-tight text-ink">
        About
      </h1>

      <p className="mt-6 font-serif text-lg leading-relaxed text-ink">
        I led product and product marketing for creative software that scaled to
        15M+ MAU, and prompting became part of how I work. This is the curated
        set. Each prompt assigns a role, takes variables, and asks for a sharper
        answer than the obvious one. Curation is the product.
      </p>

      <div className="mt-8 space-y-5 text-[15px] leading-relaxed text-muted">
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
          a win, and treat curation as the product. Built in React. The prompts
          live in a typed data file, and curation happens in code review.
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
          nicoleminoza.com
        </a>
        <Link href="/method" className="text-muted hover:text-accent">
          Read the method
        </Link>
      </div>
    </main>
  )
}
