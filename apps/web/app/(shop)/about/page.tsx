import type { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'About Us | Shopping Mall',
  description: 'Learn about Shopping Mall, our mission, quality standards, and curated collection.',
}

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-24">
      {/* Header */}
      <div className="text-center">
        <p className="text-sm font-semibold uppercase tracking-wider text-[var(--color-brand-600)]">
          Our Story
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-[var(--color-text-primary)] sm:text-4xl">
          Crafted with care, priced with honesty
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base text-[var(--color-text-muted)]">
          Shopping Mall was created to provide premium leather bags, precision timepieces, and modern lifestyle accessories without inflated retail markups.
        </p>
      </div>

      {/* Values Grid */}
      <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-3">
        <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[var(--color-surface-raised)] text-[var(--color-brand-600)]">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <h2 className="mt-4 text-base font-semibold text-[var(--color-text-primary)]">Uncompromising Quality</h2>
          <p className="mt-2 text-sm text-[var(--color-text-muted)]">
            Every product in our catalog undergoes rigorous inspection for durability, stitching, and precision finish.
          </p>
        </div>

        <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[var(--color-surface-raised)] text-[var(--color-brand-600)]">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="10" />
              <path d="m9 12 2 2 4-4" />
            </svg>
          </div>
          <h2 className="mt-4 text-base font-semibold text-[var(--color-text-primary)]">Transparent Pricing</h2>
          <p className="mt-2 text-sm text-[var(--color-text-muted)]">
            Direct sourcing means no middleman markups. You get genuine craftsmanship at fair, honest prices.
          </p>
        </div>

        <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[var(--color-surface-raised)] text-[var(--color-brand-600)]">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
          </div>
          <h2 className="mt-4 text-base font-semibold text-[var(--color-text-primary)]">Fast & Secure Delivery</h2>
          <p className="mt-2 text-sm text-[var(--color-text-muted)]">
            Dependable doorstep delivery with live tracking and hassle-free returns support.
          </p>
        </div>
      </div>

      {/* CTA */}
      <div className="mt-16 text-center">
        <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">Ready to explore?</h2>
        <p className="mt-2 text-sm text-[var(--color-text-muted)]">Browse our latest collection of bags and watches.</p>
        <div className="mt-6 flex justify-center gap-4">
          <Button asChild variant="primary" size="lg">
            <Link href="/products">Shop Catalog</Link>
          </Button>
          <Button asChild variant="secondary" size="lg">
            <Link href="/contact">Get in Touch</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
