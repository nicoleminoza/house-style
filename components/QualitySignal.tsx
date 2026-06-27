'use client'

import { useState } from 'react'
import { track, type Sentiment } from '@/lib/analytics'

/** Binary thumbs up/down quality signal, shown beneath an exposed payload. */
export function QualitySignal({ promptId }: { promptId: string }) {
  const [voted, setVoted] = useState<Sentiment | null>(null)

  function vote(sentiment: Sentiment) {
    if (voted) return
    setVoted(sentiment)
    track('Feedback_Quality_Signal', { prompt_id: promptId, sentiment })
  }

  if (voted) {
    return (
      <p className="mt-3 text-xs text-faint">
        Thanks, logged your {voted === 'positive' ? '👍' : '👎'}.
      </p>
    )
  }

  return (
    <div className="mt-3 flex items-center gap-3">
      <span className="text-xs text-muted">
        Did this framework meet your expectations?
      </span>
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => vote('positive')}
          aria-label="Met expectations"
          className="ring-focus rounded border border-line px-2 py-1 text-xs transition-colors hover:border-accent/40 hover:text-accent"
        >
          👍
        </button>
        <button
          type="button"
          onClick={() => vote('negative')}
          aria-label="Did not meet expectations"
          className="ring-focus rounded border border-line px-2 py-1 text-xs transition-colors hover:border-accent/40 hover:text-accent"
        >
          👎
        </button>
      </div>
    </div>
  )
}
