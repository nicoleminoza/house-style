'use client'

import { useEffect } from 'react'
import { consumeGateConversion } from '@/lib/analytics'

/**
 * Fires Gate_Converted once after a successful sign-in. `consumeGateConversion`
 * only emits when a gate was actually remembered (sessionStorage), so running it
 * on authed loads is safe and self-limiting.
 */
export function AuthEvents({ isAuthed }: { isAuthed: boolean }) {
  useEffect(() => {
    if (isAuthed) consumeGateConversion()
  }, [isAuthed])
  return null
}
