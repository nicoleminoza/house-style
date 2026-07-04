'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

type Item = { href: string; label: string }

// Mobile disclosure for the section links. The auth CTA stays pinned in the
// header bar; this menu carries navigation only. A text affordance ("Menu" /
// "Close") rather than a hamburger glyph, to stay in the site's typographic
// register. The panel hangs off the sticky header (which is position:relative).
export function MobileNav({ items }: { items: Item[] }) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  // Close when the route changes (a link was followed).
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  // Close on Escape while open.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <div className="sm:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="mobile-nav"
        onClick={() => setOpen((v) => !v)}
        className="ring-focus rounded px-2.5 py-1.5 text-sm text-muted transition-colors hover:text-accent"
      >
        {open ? 'Close' : 'Menu'}
      </button>

      {open && (
        <nav
          id="mobile-nav"
          aria-label="Site"
          className="absolute inset-x-0 top-full border-b border-line bg-canvas shadow-[0_18px_30px_-24px_rgba(36,31,29,0.35)]"
        >
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="block border-t border-line px-6 py-3.5 text-sm text-muted transition-colors hover:text-accent"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </div>
  )
}
