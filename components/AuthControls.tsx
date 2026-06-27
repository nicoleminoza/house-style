'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

/** Header sign-in / sign-out control. Rendered only when Supabase is configured. */
export function AuthControls({ isAuthed }: { isAuthed: boolean }) {
  const router = useRouter()

  async function signOut() {
    await createClient().auth.signOut()
    router.refresh()
  }

  if (isAuthed) {
    return (
      <button
        type="button"
        onClick={signOut}
        className="ring-focus rounded px-3 py-1.5 text-muted transition-colors hover:text-accent"
      >
        Sign out
      </button>
    )
  }

  return (
    <Link
      href="/sign-in"
      className="ring-focus rounded border border-accent/40 px-3 py-1.5 text-accent transition-colors hover:bg-accent hover:text-surface"
    >
      Sign in
    </Link>
  )
}
