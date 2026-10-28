import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function ProductNotFound() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6">
      <p className="text-sm font-medium text-[var(--color-text-muted)]">404</p>
      <h1 className="mt-2 text-xl font-semibold text-[var(--color-text-primary)]">
        Product not found
      </h1>
      <p className="mt-2 text-sm text-[var(--color-text-muted)]">
        This product may have been removed or the link is incorrect.
      </p>
      <div className="mt-6">
        <Button asChild variant="primary">
          <Link href="/products">Back to products</Link>
        </Button>
      </div>
    </div>
  )
}
