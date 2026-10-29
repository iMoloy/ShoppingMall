import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function GlobalNotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center p-6 text-center">
      <p className="font-mono text-sm font-semibold text-[var(--color-brand-600)]">404</p>
      <h1 className="mt-2 text-2xl font-bold tracking-tight text-[var(--color-text-primary)] sm:text-3xl">
        Page not found
      </h1>
      <p className="mt-2 max-w-sm text-sm text-[var(--color-text-muted)]">
        Sorry, we couldn’t find the page you’re looking for. It might have been moved or removed.
      </p>
      <div className="mt-6 flex gap-3">
        <Button asChild variant="primary">
          <Link href="/">Back to Home</Link>
        </Button>
        <Button asChild variant="secondary">
          <Link href="/products">Browse Catalog</Link>
        </Button>
      </div>
    </div>
  )
}
