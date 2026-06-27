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
          <span className="ml-1 hidden text-xs text-muted sm:inline">
            Prompts with a point of view
          </span>
        </Link>

        <nav className="flex min-w-0 items-center gap-1 overflow-x-auto whitespace-nowrap pl-2 text-sm [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
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
          {hasSupabase && (
            <span className="ml-1 shrink-0 border-l border-line pl-2">
              <AuthControls isAuthed={isAuthed} />
            </span>
          )}
        </nav>
      </div>
    </header>
  )
}
