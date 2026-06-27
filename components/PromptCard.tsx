'use client'

import { useState } from 'react'
import type { PromptForClient } from '@/lib/types'
import { track } from '@/lib/analytics'
import { copyToClipboard } from '@/lib/clipboard'
import { isHero } from '@/lib/heroes'
import { useToast } from './Toast'
import { QualitySignal } from './QualitySignal'

const CATEGORY_BADGE: Record<string, string> = {
  'PMM/GTM': 'bg-canvas text-ink border border-line',
  Executive: 'bg-accent-tint text-accent',
  'AI & Creative Tools': 'bg-[#e8e2d6] text-[#5a4a52]',
}

// The whole curated library is public and instantly copyable. The Tier-2 gate
// lives on the workflow (the Sandbox), not here.
export function PromptCard({
  prompt,
  isAuthed,
}: {
  prompt: PromptForClient
  isAuthed: boolean
}) {
  const [expanded, setExpanded] = useState(false)
  const [copied, setCopied] = useState(false)
  const payload = prompt.payload ?? ''
  const { showUseCaseSurvey } = useToast()
  const panelId = `prompt-panel-${prompt.slug}`

  async function handleCopy() {
    if (!payload) return
    const ok = await copyToClipboard(payload)
    if (!ok) return
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    track('Prompt_Copied', {
      prompt_id: prompt.slug,
      prompt_title: prompt.title,
      is_premium: false,
      user_authenticated: isAuthed,
    })
    showUseCaseSurvey(prompt.slug)
  }

  return (
    <article
      id={`prompt-${prompt.slug}`}
      className={`flex scroll-mt-28 flex-col rounded-md border bg-surface p-5 transition-colors hover:border-accent/30 ${
        isHero(prompt.slug) ? 'border-accent/40' : 'border-line'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <span
          className={`inline-flex items-center rounded px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-[0.08em] ${
            CATEGORY_BADGE[prompt.category] ?? 'bg-canvas text-ink'
          }`}
        >
          {prompt.category}
        </span>
        {isHero(prompt.slug) && (
          <span className="inline-flex items-center gap-1 rounded bg-accent px-2 py-0.5 text-[11px] font-medium text-surface">
            ★ Hero
          </span>
        )}
      </div>

      <h3 className="mt-3 font-serif text-lg font-medium leading-snug text-ink">
        <a href={`#prompt-${prompt.slug}`} className="hover:text-accent">
          {prompt.title}
        </a>
      </h3>
      <p className="mt-1.5 text-sm leading-relaxed text-muted">
        {prompt.description}
      </p>

      {prompt.variables.length > 0 && (
        <p className="mt-3 text-[11px] text-muted">
          {prompt.variables.length} variable
          {prompt.variables.length === 1 ? '' : 's'} to fill
        </p>
      )}

      <div className="mt-4 flex items-center gap-2">
        <button
          type="button"
          onClick={handleCopy}
          aria-label={copied ? 'Copied' : `Copy the ${prompt.title} prompt`}
          className={`inline-flex min-h-[40px] items-center gap-1.5 rounded border px-3 text-xs font-medium transition-colors ${
            copied
              ? 'border-accent bg-accent text-surface'
              : 'border-line text-muted hover:border-accent/30 hover:text-accent'
          }`}
        >
          {copied ? 'Copied' : 'Copy'}
        </button>
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          aria-controls={panelId}
          className="inline-flex min-h-[40px] items-center rounded px-2 text-xs font-medium text-accent transition-colors hover:underline"
        >
          {expanded ? 'Hide prompt' : 'Show full prompt'}
        </button>
      </div>

      {expanded && (
        <div className="mt-3" id={panelId}>
          <pre className="max-h-80 overflow-y-auto whitespace-pre-wrap rounded border border-line bg-canvas px-3.5 py-3 font-sans text-[13px] leading-relaxed text-ink">
            {payload}
          </pre>
          <QualitySignal promptId={prompt.slug} />
        </div>
      )}

      <div className="mt-4 flex flex-wrap gap-x-2 gap-y-1 border-t border-line pt-3">
        {prompt.tags.map((tag) => (
          <span key={tag} className="text-[11px] text-muted">
            #{tag}
          </span>
        ))}
      </div>
    </article>
  )
}
