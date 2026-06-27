'use client'

import { useState } from 'react'

const LINKS = [
  { label: 'nicoleminoza.com', href: 'https://nicoleminoza.com', primary: true },
  { label: 'GitHub', href: 'https://github.com/nicoleminoza/house-style' },
  { label: 'Email', href: 'mailto:hello@nicoleminoza.com' },
]

export function Footer() {
  const [email, setEmail] = useState('')
  const [done, setDone] = useState(false)

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    // TODO: wire to Mailchimp or Buttondown (POST `email` to the list endpoint).
    setDone(true)
  }

  return (
    <footer className="mt-24 border-t border-line">
      <div className="mx-auto max-w-shell px-6 py-12">
        {/* Zone 1: the one ask. Free email capture, no login, never blocks a prompt. */}
        <form onSubmit={onSubmit} className="max-w-md">
          <label
            htmlFor="footer-email"
            className="block text-sm font-medium text-ink"
          >
            Get new prompts as I add them
          </label>
          {done ? (
            <p className="mt-2 text-sm text-muted">Thanks. You are on the list.</p>
          ) : (
            <div className="mt-2 flex gap-2">
              <input
                id="footer-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="min-h-[40px] w-full rounded-md border border-line bg-surface px-3 text-sm text-ink placeholder:text-faint focus:border-accent/40"
              />
              <button
                type="submit"
                className="min-h-[40px] shrink-0 rounded-md border border-accent bg-accent px-4 text-sm font-medium text-surface transition-opacity hover:opacity-90"
              >
                Subscribe
              </button>
            </div>
          )}
        </form>

        {/* Zone 2: identity + wayfinding. */}
        <div className="mt-10 flex flex-col gap-5 border-t border-line pt-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-serif text-lg font-medium text-ink">House Style</p>
            <p className="mt-1 text-sm text-muted">
              A project by Nicole Miñoza
            </p>
          </div>

          <nav
            aria-label="Nicole Miñoza links"
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

        <p className="mt-8 text-xs text-faint">Typeset in Fraunces and Inter.</p>
      </div>
    </footer>
  )
}
