import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Handles the OAuth / magic-link return: exchanges the code for a session cookie,
// then sends the user back where they were headed (?next=).
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      // ?signed_in=1 lets the client fire Gate_Converted for an attributed gate.
      const sep = next.includes('?') ? '&' : '?'
      return NextResponse.redirect(`${origin}${next}${sep}signed_in=1`)
    }
  }

  return NextResponse.redirect(`${origin}/sign-in?error=auth`)
}
