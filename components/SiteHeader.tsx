import Link from 'next/link'
import { hasSupabase } from '@/lib/env'
import { getIsAuthed } from '@/lib/prompts'
import { AuthControls } from './AuthControls'
import { Logo } from './Logo'

// Public nav. The private Dashboard is added only for signed-in viewers below.
const NAV = [
  { href: '/', label: 'Library' },
  { href: '/demo', label: 'Sandbox' },
  { href: '/method', label: 'Method' },
  { href: '/about', label: 'About' },
]

export async function SiteHeader() {
  const isAuthed = hasSupabase ? await getIsAuthed() : false

  return (
    <header className="sticky top-0 z-20 border-b border-line bg-canvas/85 backdrop-blur supports-[backdrop-filter]:bg-canvas/70">
      <div className="mx-auto flex max-w-shell items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2 rounded-sm"
        >
          <Logo className="h-7 w-7 shrink-0" />
          <span className="font-serif text-lg font-medium tracking-tight text-ink">
            House&nbsp;Style
          </span>
        </Link>

        {/* Section links scroll horizontally on narrow screens; the auth control
            is pinned outside that strip so the primary CTA is never scrolled
            off-screen on mobile. */}
        <div className="flex min-w-0 items-center gap-2 pl-2">
          <nav className="flex min-w-0 items-center gap-1 overflow-x-auto whitespace-nowrap text-sm [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="shrink-0 rounded px-3 py-1.5 text-muted transition-colors hover:text-accent"
              >
                {item.label}
              </Link>
            ))}
            {isAuthed && (
              <Link
                href="/dashboard"
                className="shrink-0 rounded px-3 py-1.5 text-muted transition-colors hover:text-accent"
              >
                Dashboard
              </Link>
            )}
          </nav>
          {hasSupabase && (
            <span className="shrink-0 border-l border-line pl-2">
              <AuthControls isAuthed={isAuthed} />
            </span>
          )}
        </div>
      </div>
    </header>
  )
}
