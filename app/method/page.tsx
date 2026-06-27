import Link from 'next/link'

export const metadata = {
  title: 'The method, House Style',
  description:
    'Curation is the product. The four-part bar every prompt here has to clear.',
}

const BAR: { part: string; detail: string }[] = [
  {
    part: 'Role assignment',
    detail:
      'Every prompt casts a specific, credentialed expert with a point of view, not a generic assistant. The role sets the standard the answer has to meet.',
  },
  {
    part: '[BRACKET] variables',
    detail:
      'Fill-in slots carry your product, audience, and real facts into the prompt, so it adapts to your situation instead of returning something generic.',
  },
  {
    part: 'A structured deliverable',
    detail:
      'The output shape is dictated: numbered sections in an explicit order, so the answer arrives usable, not as a wall of text you have to mine.',
  },
  {
    part: 'One instruction that pushes for a sharper answer',
    detail:
      'A single line that refuses the obvious. Flag what a competitor could claim, name the cost of a choice, rank by impact, cut the filler.',
  },
]

export default function MethodPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="font-serif text-3xl font-medium tracking-tight text-ink">
        The method
      </h1>
      <p className="mt-5 font-serif text-lg leading-relaxed text-ink">
        Curation is the product.
      </p>
      <p className="mt-3 text-[15px] leading-relaxed text-muted">
        A prompt earns its place here only if it clears a four-part bar. Each one
        assigns a role, takes variables, returns a structured deliverable, and
        includes one instruction that pushes for a sharper answer than the obvious
        one.
      </p>

      <ol className="mt-8 space-y-6">
        {BAR.map((b, i) => (
          <li key={b.part} className="flex gap-4">
            <span className="mt-0.5 font-serif text-lg leading-none text-accent tabular-nums">
              {String(i + 1).padStart(2, '0')}
            </span>
            <div>
              <p className="font-medium text-ink">{b.part}</p>
              <p className="mt-1 text-[15px] leading-relaxed text-muted">
                {b.detail}
              </p>
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-10 text-sm">
        <Link href="/" className="text-accent hover:underline">
          Back to the library
        </Link>
      </div>
    </main>
  )
}
