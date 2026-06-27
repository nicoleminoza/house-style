import Link from 'next/link'

export const metadata = {
  title: 'The method — House Style',
  description:
    'A house style is a rulebook for voice. The signature moves every prompt here is written to.',
}

const MOVES: { move: string; detail: string }[] = [
  {
    move: 'Cast a sharp persona — with an attitude.',
    detail:
      'Never "a recruiter." An elite recruiter who places senior leaders at arts nonprofits. Seniority + domain + niche, then the disposition: ruthless, frank, zero tolerance.',
  },
  {
    move: 'Legislate the language; don’t hope for it.',
    detail:
      'Banned-word lists, "no AI-isms, no filler," "do not soften findings." The constraints are written down, not wished for.',
  },
  {
    move: 'Every claim carries a number or a name.',
    detail:
      '"Use only these facts." "Do not invent." The metric does the boasting. Concrete over vague, always.',
  },
  {
    move: 'Lead with ownership; kill passive verbs.',
    detail:
      'Architected, launched, repositioned, drove — never managed, helped, supported. Show, don’t tell.',
  },
  {
    move: 'Hand over a spec, not a request.',
    detail:
      'Numbered deliverables in an explicit order. The output shape is dictated, not left to chance.',
  },
  {
    move: 'Make it score or flag — never just react.',
    detail:
      'Rubrics, lenses, "original → why it’s a problem → rewrite." Feedback has to be rankable and end in a verdict.',
  },
  {
    move: 'Calibrate with a bad→good example.',
    detail:
      'vague: "…" → on-brand: "…". Voice is taught by demonstration, not adjectives.',
  },
  {
    move: 'Build in an acceptance test.',
    detail:
      'A pass/fail the output must clear — "would the target audience know why to act?"',
  },
]

export default function MethodPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="font-serif text-3xl font-medium tracking-tight text-ink">
        The method
      </h1>
      <p className="mt-5 text-[15px] leading-relaxed text-muted">
        A house style is a rulebook for voice. Every prompt here is written to the
        same one — these are the moves that recur. Curation is the product; so is
        consistency.
      </p>

      <ol className="mt-8 space-y-6">
        {MOVES.map((m, i) => (
          <li key={m.move} className="flex gap-4">
            <span className="mt-0.5 font-serif text-lg leading-none text-accent tabular-nums">
              {String(i + 1).padStart(2, '0')}
            </span>
            <div>
              <p className="font-medium text-ink">{m.move}</p>
              <p className="mt-1 text-[15px] leading-relaxed text-muted">
                {m.detail}
              </p>
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-10 text-sm">
        <Link href="/" className="text-accent hover:underline">
          ← Back to the library
        </Link>
      </div>
    </main>
  )
}
