import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Our Heritage & Atelier Craft | Shopping Mall',
  description:
    'Learn about Shopping Mall, our commitment to architectural fashion, ethical leathercraft, and honest pricing.',
}

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-20">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-[11px] font-medium uppercase tracking-wider text-[var(--color-text-muted)]">
        <Link href="/" className="hover:text-[var(--color-text-primary)]">Home</Link>
        <span>/</span>
        <span className="text-[var(--color-text-primary)]">The House &amp; Story</span>
      </nav>

      {/* Header */}
      <div className="border-b border-[var(--color-border)] pb-8">
        <span className="text-xs font-bold uppercase tracking-widest text-[var(--color-brand-600)]">
          The House • Story &amp; Heritage
        </span>
        <h1 className="mt-3 text-3xl font-extrabold uppercase tracking-tight text-[var(--color-text-primary)] sm:text-5xl">
          Quiet Luxury, Deliberate Craft
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[var(--color-text-muted)] sm:text-base">
          Founded on the conviction that high-fashion tailoring, full-grain leathercraft, and
          automatic horology should be accessible without artificial retail markups.
        </p>
      </div>

      {/* Atelier Banner Image */}
      <div className="relative mt-10 aspect-[16/9] w-full overflow-hidden rounded-2xl border border-[var(--color-border)] sm:aspect-[21/9]">
        <Image
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&auto=format&fit=crop&q=80"
          alt="Shopping Mall Atelier & Design Studio"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-6 sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-wider text-white">
            Designed in Paris &amp; London • Handcrafted by Master Artisans
          </p>
        </div>
      </div>

      {/* Core Values Grid */}
      <div className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-3">
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-6">
          <span className="text-xs font-bold uppercase tracking-widest text-[var(--color-brand-600)]">
            Value 01
          </span>
          <h2 className="mt-2 text-base font-bold uppercase text-[var(--color-text-primary)]">
            Uncompromising Standards
          </h2>
          <p className="mt-2 text-xs leading-relaxed text-[var(--color-text-muted)]">
            Every millimeter of stitching, leather grain selection, and sapphire glass calibration is inspected before release.
          </p>
        </div>

        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-6">
          <span className="text-xs font-bold uppercase tracking-widest text-[var(--color-brand-600)]">
            Value 02
          </span>
          <h2 className="mt-2 text-base font-bold uppercase text-[var(--color-text-primary)]">
            Direct Atelier Pricing
          </h2>
          <p className="mt-2 text-xs leading-relaxed text-[var(--color-text-muted)]">
            By eliminating traditional wholesale intermediaries and retail markups, we deliver luxury at honest prices.
          </p>
        </div>

        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-6">
          <span className="text-xs font-bold uppercase tracking-widest text-[var(--color-brand-600)]">
            Value 03
          </span>
          <h2 className="mt-2 text-base font-bold uppercase text-[var(--color-text-primary)]">
            Circular Longevity
          </h2>
          <p className="mt-2 text-xs leading-relaxed text-[var(--color-text-muted)]">
            We reject the disposable fashion cycle. Our pieces are crafted to patina gracefully and endure decades.
          </p>
        </div>
      </div>

      {/* Call to Action */}
      <div className="mt-16 text-center border-t border-[var(--color-border)] pt-12">
        <h2 className="text-2xl font-bold uppercase text-[var(--color-text-primary)]">
          Experience The Summer Collection
        </h2>
        <p className="mt-2 text-xs text-[var(--color-text-muted)] sm:text-sm">
          Browse our curated catalog of tailored suits, bags, and timepieces.
        </p>
        <div className="mt-6 flex justify-center gap-4">
          <Button asChild variant="primary" size="lg">
            <Link href="/products">Shop Catalog</Link>
          </Button>
          <Button asChild variant="secondary" size="lg">
            <Link href="/contact">Contact Concierge</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
