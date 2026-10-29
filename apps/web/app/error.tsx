'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Error is logged on client for debugging in non-production
  }, [error])

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center p-6 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" x2="12" y1="8" y2="12" />
          <line x1="12" x2="12.01" y1="16" y2="16" />
        </svg>
      </div>

      <h1 className="mt-4 text-xl font-semibold text-[var(--color-text-primary)]">
        Something went wrong
      </h1>
      <p className="mt-2 max-w-md text-sm text-[var(--color-text-muted)]">
        An unexpected error occurred while loading this page. You can try refreshing or returning to the home page.
      </p>

      <div className="mt-6 flex gap-3">
        <Button variant="secondary" onClick={() => reset()}>
          Try again
        </Button>
        <Button asChild variant="primary">
          <Link href="/">Go to Home</Link>
        </Button>
      </div>
    </div>
  )
}
