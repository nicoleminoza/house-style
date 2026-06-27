'use client'

import { useState } from 'react'

const META = [
  { label: 'nicoleminoza.com', href: 'https://nicoleminoza.com', primary: true },
  { label: 'Résumé', href: 'https://nicoleminoza.com/resume.html' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/nicoleminoza' },
  { label: 'hello@nicoleminoza.com', href: 'mailto:hello@nicoleminoza.com' },
  { label: 'GitHub', href: 'https://github.com/nicoleminoza/house-style' },
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
        {/* Free email capture. No login, no modal, never blocks a prompt. */}
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

        <p className="mt-10 max-w-xl text-sm leading-relaxed text-muted">
          I led product and product marketing for creative software that scaled
          to 15M+ MAU, and prompting became part of how I work. This is the
          curated set. Each prompt assigns a role, takes variables, and asks for a
          sharper answer than the obvious one. Curation is the product.
        </p>

        <div className="mt-8">
          <p className="font-serif text-lg font-medium text-ink">House Style</p>
          <p className="mt-1 text-sm text-muted">A project by Nicole Miñoza.</p>
        </div>

        <nav
          aria-label="Nicole Miñoza links"
          className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted"
        >
          {META.map((m, i) => (
            <span key={m.href} className="inline-flex items-center gap-2">
              {i > 0 && (
                <span aria-hidden className="text-line">
                  ·
                </span>
              )}
              <a
                href={m.href}
                target={m.href.startsWith('http') ? '_blank' : undefined}
                rel={m.href.startsWith('http') ? 'noreferrer' : undefined}
                className={
                  m.primary
                    ? 'font-medium text-ink underline decoration-line underline-offset-4 hover:text-accent'
                    : 'hover:text-accent'
                }
              >
                {m.label}
              </a>
            </span>
          ))}
          <span aria-hidden className="text-line">
            ·
          </span>
          <span>Seattle, WA</span>
        </nav>

        <p className="mt-6 text-xs text-faint">Typeset in Fraunces and Inter.</p>
      </div>
    </footer>
  )
}
