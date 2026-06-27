'use client'

import { useMemo, useState } from 'react'
import type { Category, PromptForClient } from '@/lib/types'
import { isHero } from '@/lib/heroes'
import { PromptCard } from './PromptCard'

const CATEGORIES: Category[] = ['PMM/GTM', 'Executive', 'AI & Creative Tools']

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

  const allTags = useMemo(
    () =>
      Array.from(new Set(prompts.flatMap((p) => p.tags))).sort((a, b) =>
        a.localeCompare(b),
      ),
    [prompts],
  )

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
      // Hero frameworks pinned to the top.
      .sort((a, b) => Number(isHero(b.slug)) - Number(isHero(a.slug)))
  }, [prompts, query, activeCats, activeTags])

  const toggle = <T,>(value: T, list: T[], set: (v: T[]) => void) =>
    set(list.includes(value) ? list.filter((v) => v !== value) : [...list, value])

  const hasFilters =
    query.trim() !== '' || activeCats.length > 0 || activeTags.length > 0

  return (
    <div>
      {/* Search + category filters */}
      <div className="sticky top-[57px] z-10 -mx-6 border-b border-line bg-canvas/90 px-6 py-5 backdrop-blur">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by title, description, or tag…"
          aria-label="Search prompts"
          className="ring-focus w-full rounded-md border border-line bg-surface px-4 py-2.5 text-sm text-ink transition-colors placeholder:text-faint focus:border-accent/40"
        />

        <div className="mt-4 flex flex-wrap items-center gap-2">
          {CATEGORIES.map((cat) => {
            const active = activeCats.includes(cat)
            const count = prompts.filter((p) => p.category === cat).length
            return (
              <button
                key={cat}
                type="button"
                onClick={() => toggle(cat, activeCats, setActiveCats)}
                className={`ring-focus inline-flex items-center gap-1.5 rounded border px-3 py-1.5 text-xs transition-colors ${
                  active
                    ? 'border-accent bg-accent text-surface'
                    : 'border-line text-ink hover:border-accent/30 hover:text-accent'
                }`}
              >
                {cat}
                <span className={active ? 'text-surface/70' : 'text-faint'}>
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
              className="ring-focus ml-1 rounded px-2 py-1.5 text-xs text-muted transition-colors hover:text-accent"
            >
              Clear
            </button>
          )}
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {allTags.map((tag) => {
            const active = activeTags.includes(tag)
            return (
              <button
                key={tag}
                type="button"
                onClick={() => toggle(tag, activeTags, setActiveTags)}
                className={`ring-focus rounded px-2 py-0.5 text-[11px] transition-colors ${
                  active
                    ? 'bg-accent-tint text-accent ring-1 ring-inset ring-accent/30'
                    : 'text-faint hover:text-ink'
                }`}
              >
                {tag}
              </button>
            )
          })}
        </div>
      </div>

      <p className="py-5 text-xs text-muted">
        {results.length === prompts.length
          ? `${prompts.length} prompts`
          : `${results.length} of ${prompts.length}`}
      </p>

      {results.length === 0 ? (
        <div className="rounded-md border border-dashed border-line py-20 text-center">
          <p className="font-serif text-lg text-ink">Nothing matches — yet.</p>
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
