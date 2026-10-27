'use client'

import { useEffect, useState, useCallback } from 'react'

type ToastType = 'success' | 'error' | 'info'

interface Toast {
  id: string
  message: string
  type: ToastType
}

// Simple event bus — no external library needed
const listeners = new Set<(toast: Toast) => void>()

export function toast(message: string, type: ToastType = 'info') {
  const id = Math.random().toString(36).slice(2)
  const t: Toast = { id, message, type }
  listeners.forEach((fn) => fn(t))
}

toast.success = (message: string) => toast(message, 'success')
toast.error = (message: string) => toast(message, 'error')

const typeClasses: Record<ToastType, string> = {
  success: 'border-emerald-500 bg-[var(--color-surface)] text-emerald-700 dark:text-emerald-400',
  error: 'border-red-500 bg-[var(--color-surface)] text-red-700 dark:text-red-400',
  info: 'border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-primary)]',
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const remove = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  useEffect(() => {
    const handler = (t: Toast) => {
      setToasts((prev) => [...prev, t])
      setTimeout(() => remove(t.id), 4000)
    }
    listeners.add(handler)
    return () => { listeners.delete(handler) }
  }, [remove])

  if (toasts.length === 0) return null

  return (
    <div
      aria-live="polite"
      aria-atomic="false"
      className="fixed bottom-4 right-4 z-50 flex flex-col gap-2"
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          role="status"
          className={[
            'flex min-w-64 max-w-sm items-start justify-between gap-3 rounded-lg border px-4 py-3 shadow-sm',
            typeClasses[t.type],
          ].join(' ')}
        >
          <p className="text-sm">{t.message}</p>
          <button
            onClick={() => remove(t.id)}
            aria-label="Dismiss"
            className="mt-0.5 shrink-0 text-[var(--color-text-muted)] transition-colors duration-150 hover:text-[var(--color-text-primary)]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  )
}
