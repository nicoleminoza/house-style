'use client'

import { useEffect } from 'react'
import posthog from 'posthog-js'
import { hasPostHog, posthogHost, posthogKey } from '@/lib/env'

/**
 * Initializes PostHog on the client when a key is present; a no-op otherwise so
 * the app runs cleanly before telemetry is configured.
 */
export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (!hasPostHog || typeof window === 'undefined') return
    // `__loaded` is set by posthog-js after init; guard re-init on fast refresh.
    if (!(posthog as unknown as { __loaded?: boolean }).__loaded) {
      posthog.init(posthogKey, {
        api_host: posthogHost,
        capture_pageview: true,
        person_profiles: 'identified_only',
      })
    }
  }, [])

  return <>{children}</>
}
