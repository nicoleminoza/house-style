'use client'

import { useEffect, useMemo, useState } from 'react'
import type { Category, PromptForClient } from '@/lib/types'
import { isHero } from '@/lib/heroes'
import { PromptCard } from './PromptCard'

const CATEGORIES: Category[] = ['PMM/GTM', 'Executive', 'AI & Creative Tools']

// URL <-> category mapping for shareable links (?category=pmm&q=positioning).
const CAT_TO_SLUG: Record<Category, string> = {
  'PMM/GTM': 'pmm',
  Executive: 'executive',
  'AI & Creative Tools': 'ai',
}
const SLUG_TO_CAT: Record<string, Category> = {
  pmm: 'PMM/GTM',
  executive: 'Executive',
  ai: 'AI & Creative Tools',
}

const TOP_TAGS = 8

export function Catalog({
  prompts,
  isAuthed,
}: {
  prompts: PromptForClient[]
  isAuthed: boolean
}) {
  const [query, setQuery] = useState('')
  const [activeCats, setActiveCats] = useState<Category[]>([])
  const [activeTags, setActiveTags] = useState<string[]>([])
  const [showAllTags, setShowAllTags] = useState(false)

  // Tags ordered by frequency (most-used first); top 8 shown by default.
  const tagsByCount = useMemo(() => {
    const counts = new Map<string, number>()
    for (const p of prompts)
      for (const t of p.tags) counts.set(t, (counts.get(t) ?? 0) + 1)
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .map(([tag]) => tag)
  }, [prompts])
  const visibleTags = showAllTags ? tagsByCount : tagsByCount.slice(0, TOP_TAGS)

  // Hydrate state from the URL on mount.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const q = params.get('q')
    if (q) setQuery(q)
    const cat = params.get('category')
    if (cat) {
      const cats = cat
        .split(',')
        .map((s) => SLUG_TO_CAT[s])
        .filter(Boolean) as Category[]
      if (cats.length) setActiveCats(cats)
    }
  }, [])

  // Reflect active category + search back into the URL (shareable, no reload).
  useEffect(() => {
    const params = new URLSearchParams()
    if (query.trim()) params.set('q', query.trim())
    if (activeCats.length)
      params.set('category', activeCats.map((c) => CAT_TO_SLUG[c]).join(','))
    const qs = params.toString()
    const url = qs
      ? `?${qs}${window.location.hash}`
      : window.location.pathname + window.location.hash
    window.history.replaceState(null, '', url)
  }, [query, activeCats])

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    return prompts
      .filter((p) => {
        const matchesQuery =
          q === '' ||
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
        const matchesCat =
          activeCats.length === 0 || activeCats.includes(p.category)
        const matchesTags =
          activeTags.length === 0 || activeTags.every((t) => p.tags.includes(t))
        return matchesQuery && matchesCat && matchesTags
      })
      .sort((a, b) => Number(isHero(b.slug)) - Number(isHero(a.slug)))
  }, [prompts, query, activeCats, activeTags])

  const toggle = <T,>(value: T, list: T[], set: (v: T[]) => void) =>
    set(list.includes(value) ? list.filter((v) => v !== value) : [...list, value])

  const hasFilters =
    query.trim() !== '' || activeCats.length > 0 || activeTags.length > 0

  return (
    <div>
      <div className="sticky top-[57px] z-10 -mx-6 border-b border-line bg-canvas/90 px-6 py-5 backdrop-blur">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by title, description, or tag…"
          aria-label="Search prompts"
          className="w-full rounded-md border border-line bg-surface px-4 py-2.5 text-sm text-ink transition-colors placeholder:text-muted focus:border-accent/40"
        />

        <div className="mt-4 flex flex-wrap items-center gap-2">
          {CATEGORIES.map((cat) => {
            const active = activeCats.includes(cat)
            const count = prompts.filter((p) => p.category === cat).length
            return (
              <button
                key={cat}
                type="button"
                aria-pressed={active}
                aria-label={`${cat}, ${count} prompts`}
                onClick={() => toggle(cat, activeCats, setActiveCats)}
                className={`inline-flex min-h-[36px] items-center gap-1.5 rounded border px-3 py-1.5 text-xs transition-colors ${
                  active
                    ? 'border-accent bg-accent text-surface'
                    : 'border-line text-ink hover:border-accent/30 hover:text-accent'
                }`}
              >
                {cat}
                <span
                  aria-hidden
                  className={active ? 'text-surface' : 'text-muted'}
                >
                  {count}
                </span>
              </button>
            )
          })}
          {hasFilters && (
            <button
              type="button"
              onClick={() => {
                setQuery('')
                setActiveCats([])
                setActiveTags([])
              }}
              className="ml-1 inline-flex min-h-[36px] items-center rounded px-2 py-1.5 text-xs text-muted transition-colors hover:text-accent"
            >
              Clear
            </button>
          )}
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          {visibleTags.map((tag) => {
            const active = activeTags.includes(tag)
            return (
              <button
                key={tag}
                type="button"
                aria-pressed={active}
                onClick={() => toggle(tag, activeTags, setActiveTags)}
                className={`inline-flex min-h-[32px] items-center rounded px-2.5 py-1 text-[11px] transition-colors ${
                  active
                    ? 'bg-accent-tint text-accent ring-1 ring-inset ring-accent/30'
                    : 'text-muted hover:bg-surface hover:text-ink'
                }`}
              >
                {tag}
              </button>
            )
          })}
          {tagsByCount.length > TOP_TAGS && (
            <button
              type="button"
              aria-expanded={showAllTags}
              onClick={() => setShowAllTags((v) => !v)}
              className="inline-flex min-h-[32px] items-center rounded px-2 py-1 text-[11px] font-medium text-accent transition-colors hover:underline"
            >
              {showAllTags ? 'less' : `+ ${tagsByCount.length - TOP_TAGS} more`}
            </button>
          )}
        </div>
      </div>

      <h2 className="sr-only">Prompt library</h2>
      <p className="py-5 text-xs text-muted" aria-live="polite">
        {results.length === prompts.length
          ? `${prompts.length} prompts`
          : `${results.length} of ${prompts.length}`}
      </p>

      {results.length === 0 ? (
        <div className="rounded-md border border-dashed border-line py-20 text-center">
          <p className="font-serif text-lg text-ink">Nothing matches yet.</p>
          <p className="mt-1 text-sm text-muted">
            Loosen a filter or clear them to see the full library.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 pb-20 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((p) => (
            <PromptCard key={p.id} prompt={p} isAuthed={isAuthed} />
          ))}
        </div>
      )}
    </div>
  )
}
