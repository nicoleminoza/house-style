'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import { track, type UseCase } from '@/lib/analytics'

interface ToastState {
  promptId: string
  answered: boolean
}

interface ToastApi {
  /** Show the copy-success intercept toast with the use-case micro-survey. */
  showUseCaseSurvey: (promptId: string) => void
}

const ToastContext = createContext<ToastApi | null>(null)

export function useToast(): ToastApi {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within <ToastProvider>')
  return ctx
}

const USE_CASES: { value: UseCase; label: string }[] = [
  { value: 'client_work', label: 'Client Work' },
  { value: 'in_house_brand', label: 'In-House Brand' },
  { value: 'personal_project', label: 'Personal Project' },
]

const VISIBLE_MS = 6000

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<ToastState | null>(null)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clear = useCallback(() => {
    if (timer.current) clearTimeout(timer.current)
    setToast(null)
  }, [])

  const showUseCaseSurvey = useCallback((promptId: string) => {
    if (timer.current) clearTimeout(timer.current)
    setToast({ promptId, answered: false })
    timer.current = setTimeout(() => setToast(null), VISIBLE_MS)
  }, [])

  // WCAG 2.2.1: pause the auto-dismiss while the user is hovering or has
  // focus inside the toast, so the micro-survey can't vanish mid-interaction.
  const pause = useCallback(() => {
    if (timer.current) clearTimeout(timer.current)
  }, [])
  const resume = useCallback(() => {
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => setToast(null), VISIBLE_MS)
  }, [])

  useEffect(() => () => void (timer.current && clearTimeout(timer.current)), [])

  function submit(useCase: UseCase) {
    if (!toast) return
    track('Feedback_Use_Case_Submitted', {
      prompt_id: toast.promptId,
      use_case: useCase,
    })
    clear()
  }

  return (
    <ToastContext.Provider value={{ showUseCaseSurvey }}>
      {children}

      {toast && (
        <div
          role="status"
          aria-live="polite"
          onMouseEnter={pause}
          onMouseLeave={resume}
          onFocus={pause}
          onBlur={resume}
          className="fixed bottom-5 right-5 z-50 w-[19rem] rounded-md border border-line bg-surface p-4 shadow-[0_8px_30px_rgba(0,0,0,0.08)]"
        >
          <div className="flex items-start justify-between gap-3">
            <p className="text-sm font-medium text-ink">Copied to clipboard.</p>
            <button
              type="button"
              onClick={clear}
              aria-label="Dismiss"
              className="ring-focus -mr-1 -mt-1 rounded p-1 text-muted transition-colors hover:text-ink"
            >
              ✕
            </button>
          </div>
          <p className="mt-2 text-xs text-muted">
            How do you plan to use this framework?
          </p>
          <div className="mt-3 flex flex-col gap-1.5">
            {USE_CASES.map((u) => (
              <button
                key={u.value}
                type="button"
                onClick={() => submit(u.value)}
                className="ring-focus rounded border border-line px-3 py-1.5 text-left text-xs text-ink transition-colors hover:border-accent/40 hover:text-accent"
              >
                {u.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </ToastContext.Provider>
  )
}
