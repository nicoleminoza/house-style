'use client'

import { useMemo, useRef, useState } from 'react'
import { rememberGate, track } from '@/lib/analytics'
import { copyToClipboard } from '@/lib/clipboard'
import { useToast } from './Toast'

export interface SandboxPrompt {
  slug: string
  title: string
  category: string
  variables: string[]
  payload: string
}

function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/** Replace [VARIABLE ...] tokens with the user's values; leave unfilled ones. */
function fillPayload(payload: string, values: Record<string, string>) {
  let out = payload
  for (const [key, val] of Object.entries(values)) {
    if (!val.trim()) continue
    const re = new RegExp(`\\[${escapeRegExp(key)}[^\\]]*\\]`, 'g')
    out = out.replace(re, val)
  }
  return out
}

export function Sandbox({
  prompts,
  isAuthed,
}: {
  prompts: SandboxPrompt[]
  isAuthed: boolean
}) {
  const [activeSlug, setActiveSlug] = useState(prompts[0]?.slug ?? '')
  const [values, setValues] = useState<Record<string, string>>({})
  const [copied, setCopied] = useState(false)
  const [gated, setGated] = useState(false)
  const focusValue = useRef<string>('')
  const { showUseCaseSurvey } = useToast()

  const active = useMemo(
    () => prompts.find((p) => p.slug === activeSlug),
    [prompts, activeSlug],
  )
  const filled = active ? fillPayload(active.payload, values) : ''

  function selectPrompt(slug: string) {
    setActiveSlug(slug)
    setValues({})
    setGated(false)
  }

  // THE GATE. Reading + filling + copying is free; *saving* your filled versions
  // requires an account — that's the additive, premium workflow. Fires the
  // conversion funnel event. (Redirects to /sign-in once auth is built.)
  function handleSave() {
    if (!active) return
    if (isAuthed) {
      // TODO: persist to the user's workspace once auth + storage exist.
      return
    }
    track('Gate_Triggered', {
      prompt_id: active.slug,
      prompt_title: active.title,
    })
    rememberGate(active.slug)
    setGated(true)
    window.location.href = '/sign-in?next=/demo'
  }

  // PRIVACY: we track only that a variable changed (its KEY) — never the value.
  function handleBlur(variableKey: string) {
    const current = values[variableKey] ?? ''
    if (current !== focusValue.current && current.trim() !== '') {
      track('Variable_Customized', {
        prompt_id: activeSlug,
        variable_key: variableKey,
      })
    }
  }

  async function handleCopy() {
    if (!active) return
    const ok = await copyToClipboard(filled)
    if (!ok) return
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    track('Prompt_Copied', {
      prompt_id: active.slug,
      prompt_title: active.title,
      is_premium: false,
      user_authenticated: isAuthed,
    })
    showUseCaseSurvey(active.slug)
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[18rem_1fr]">
      {/* Prompt picker */}
      <aside className="lg:max-h-[70vh] lg:overflow-y-auto">
        <ul className="space-y-1">
          {prompts.map((p) => (
            <li key={p.slug}>
              <button
                type="button"
                onClick={() => selectPrompt(p.slug)}
                className={`ring-focus w-full rounded border px-3 py-2 text-left text-sm transition-colors ${
                  p.slug === activeSlug
                    ? 'border-accent/40 bg-surface text-ink'
                    : 'border-transparent text-muted hover:border-line hover:text-ink'
                }`}
              >
                {p.title}
                <span className="mt-0.5 block text-[10px] text-faint">
                  {p.category}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </aside>

      {/* Fill + preview */}
      {active && (
        <section>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {active.variables.map((key) => (
              <label key={key} className="block">
                <span className="mb-1 block text-[11px] font-medium text-muted">
                  {key}
                </span>
                <input
                  type="text"
                  value={values[key] ?? ''}
                  onFocus={() => (focusValue.current = values[key] ?? '')}
                  onChange={(e) =>
                    setValues((v) => ({ ...v, [key]: e.target.value }))
                  }
                  onBlur={() => handleBlur(key)}
                  placeholder={`[${key}]`}
                  className="ring-focus w-full rounded border border-line bg-surface px-2.5 py-1.5 text-sm text-ink placeholder:text-faint focus:border-accent/40"
                />
              </label>
            ))}
          </div>

          <div className="mt-5 flex items-center justify-between">
            <span className="text-xs text-faint">Live preview</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopy}
                className={`ring-focus rounded border px-3 py-1.5 text-xs font-medium transition-colors ${
                  copied
                    ? 'border-accent bg-accent text-surface'
                    : 'border-line text-muted hover:border-accent/30 hover:text-accent'
                }`}
              >
                {copied ? 'Copied!' : 'Copy filled prompt'}
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="ring-focus rounded border border-accent/40 px-3 py-1.5 text-xs font-medium text-accent transition-colors hover:bg-accent hover:text-surface"
              >
                Save my version
              </button>
            </div>
          </div>
          {gated && (
            <p className="mt-2 text-right text-[11px] text-accent">
              🔒 Sign in to save your filled prompts — coming soon.
            </p>
          )}
          <pre className="mt-2 whitespace-pre-wrap rounded border border-line bg-surface px-4 py-3.5 font-sans text-[13px] leading-relaxed text-ink">
            {filled}
          </pre>
        </section>
      )}
    </div>
  )
}
