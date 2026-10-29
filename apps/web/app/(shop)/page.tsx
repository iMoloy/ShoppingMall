import type { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { NewsletterForm } from '@/components/ui/newsletter-form'

export const metadata: Metadata = {
  title: 'Home | Shopping Mall',
  description: 'Shop premium bags, luxury watches, and modern accessories at honest prices.',
}

const CATEGORIES = [
  { name: 'Bags', slug: 'bags', description: 'Leather, canvas & more' },
  { name: 'Watches', slug: 'watches', description: 'Classic & smart' },
  { name: 'Accessories', slug: 'accessories', description: 'Complete your look' },
]

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="border-b border-[var(--color-border)]">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24">
          <div className="max-w-xl">
            <p className="mb-3 text-sm font-medium text-[var(--color-brand-600)]">
              New arrivals — Summer Collection
            </p>
            <h1 className="text-4xl font-semibold leading-tight tracking-tight text-[var(--color-text-primary)] sm:text-5xl">
              Quality products,
              <br />
              honest prices.
            </h1>
            <p className="mt-4 text-base leading-relaxed text-[var(--color-text-muted)]">
              Discover our curated selection of bags, watches, and accessories — built to last and
              priced fairly.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild variant="primary" size="lg">
                <Link href="/products">Browse products</Link>
              </Button>
              <Button asChild variant="secondary" size="lg">
                <Link href="/products?category=bags">Shop bags</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <h2 className="mb-6 text-lg font-semibold text-[var(--color-text-primary)]">
          Shop by category
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/products?category=${cat.slug}`}
              className="group flex flex-col gap-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-5 transition-colors duration-150 hover:border-[var(--color-brand-600)]"
            >
              <span className="text-base font-medium text-[var(--color-text-primary)]">
                {cat.name}
              </span>
              <span className="text-sm text-[var(--color-text-muted)]">{cat.description}</span>
              <span className="mt-2 text-xs font-medium text-[var(--color-brand-600)]">
                Shop now →
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="border-t border-[var(--color-border)] bg-[var(--color-surface-raised)]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
          <div className="max-w-md">
            <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">
              Stay in the loop
            </h2>
            <p className="mt-1 text-sm text-[var(--color-text-muted)]">
              Get notified about new products and exclusive offers.
            </p>
            <NewsletterForm />
          </div>
        </div>
      </section>
    </>
  )
}
