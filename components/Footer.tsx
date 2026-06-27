const LINKS = [
  { label: 'nicoleminoza.com', href: 'https://nicoleminoza.com', primary: true },
  { label: 'GitHub', href: 'https://github.com/nicoleminoza/house-style' },
  { label: 'Email', href: 'mailto:hello@nicoleminoza.com' },
]

// Mirrors the structure of nicoleminoza.com's footer (identity, links, colophon)
// in House Style's own palette and type. No email capture, no extra zones.
export function Footer() {
  return (
    <footer className="mt-24 border-t border-line">
      <div className="mx-auto max-w-shell px-6 py-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-serif text-lg font-medium text-ink">House Style</p>
            <p className="mt-0.5 text-sm text-muted">A project by Nicole Miñoza</p>
          </div>

          <nav
            aria-label="Links"
            className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-sm text-muted"
          >
            {LINKS.map((l, i) => (
              <span key={l.href} className="inline-flex items-center gap-2.5">
                {i > 0 && (
                  <span aria-hidden className="text-line">
                    ·
                  </span>
                )}
                <a
                  href={l.href}
                  target={l.href.startsWith('http') ? '_blank' : undefined}
                  rel={l.href.startsWith('http') ? 'noreferrer' : undefined}
                  className={
                    l.primary
                      ? 'font-medium text-ink underline decoration-line underline-offset-4 hover:text-accent'
                      : 'hover:text-accent'
                  }
                >
                  {l.label}
                </a>
              </span>
            ))}
          </nav>
        </div>

        <p className="mt-8 border-t border-line pt-6 text-xs text-muted">
          Typeset in <span className="font-serif italic">Newsreader</span>,{' '}
          <span className="font-sans">Hanken Grotesk</span>, and{' '}
          <span className="font-mono">Spline Sans Mono</span>.
        </p>
      </div>
    </footer>
  )
}
