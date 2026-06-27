'use client'

import { useState } from 'react'
import Link from 'next/link'
import { hasSupabase } from '@/lib/env'
import { createClient } from '@/lib/supabase/client'
import { Logo } from '@/components/Logo'

function nextParam() {
  if (typeof window === 'undefined') return '/'
  return new URLSearchParams(window.location.search).get('next') ?? '/'
}

export default function SignInPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const callback = () =>
    `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextParam())}`

  async function sendMagicLink(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError(null)
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: callback() },
    })
    setBusy(false)
    if (error) setError(error.message)
    else setSent(true)
  }

  async function oauth(provider: 'google' | 'linkedin_oidc') {
    setError(null)
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: callback(),
        // Always show the (branded) account chooser for Google sign-in.
        queryParams:
          provider === 'google' ? { prompt: 'select_account' } : undefined,
      },
    })
    if (error) setError(error.message)
  }

  return (
    <main className="mx-auto max-w-md px-6 py-20">
      <Logo className="h-12 w-12" />
      <h1 className="mt-5 font-serif text-3xl font-medium tracking-tight text-ink">
        Sign in
      </h1>
      <p className="mt-3 text-[15px] leading-relaxed text-muted">
        Save your filled prompts and unlock the hero builders. The library itself
        is free — no sign-in needed to read or copy.
      </p>

      {!hasSupabase ? (
        <div className="mt-8 rounded-md border border-line bg-surface p-5 text-sm text-muted">
          Authentication isn’t configured yet (no Supabase keys). Once the backend
          is live, this page sends a magic link and offers Google / LinkedIn.
        </div>
      ) : sent ? (
        <div className="mt-8 rounded-md border border-accent/30 bg-accent-tint/40 p-5 text-sm text-ink">
          Check your email — we sent a sign-in link to{' '}
          <span className="font-medium">{email}</span>.
        </div>
      ) : (
        <div className="mt-8 space-y-6">
          {/* Primary: passwordless email magic link */}
          <form onSubmit={sendMagicLink} className="space-y-2.5">
            <label htmlFor="email" className="block text-sm font-medium text-ink">
              Sign in with your email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              className="ring-focus w-full rounded-md border border-line bg-surface px-3.5 py-2.5 text-sm text-ink placeholder:text-faint focus:border-accent/40"
            />
            <button
              type="submit"
              disabled={busy}
              className="ring-focus w-full rounded-md border border-accent bg-accent px-3.5 py-2.5 text-sm font-medium text-surface transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {busy ? 'Sending…' : 'Email me a sign-in link'}
            </button>
            <p className="text-[11px] text-faint">
              No password — we email you a one-tap link.
            </p>
          </form>

          {/* Secondary, de-emphasized: social providers */}
          <div className="flex items-center gap-3 text-[11px] uppercase tracking-wide text-faint">
            <span className="h-px flex-1 bg-line" /> or continue with{' '}
            <span className="h-px flex-1 bg-line" />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => oauth('google')}
              className="ring-focus flex-1 rounded-md border border-line bg-surface px-3 py-2 text-xs text-muted transition-colors hover:border-accent/30 hover:text-ink"
            >
              Google
            </button>
            <button
              onClick={() => oauth('linkedin_oidc')}
              className="ring-focus flex-1 rounded-md border border-line bg-surface px-3 py-2 text-xs text-muted transition-colors hover:border-accent/30 hover:text-ink"
            >
              LinkedIn
            </button>
          </div>

          {error && <p className="text-sm text-accent">{error}</p>}
        </div>
      )}

      <Link href="/" className="ring-focus mt-8 inline-block rounded text-sm text-accent hover:underline">
        ← Back to the library
      </Link>
    </main>
  )
}
