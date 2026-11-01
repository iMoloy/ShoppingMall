import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Sustainability & Ethical Craft | Shopping Mall',
  description:
    'Our commitment to responsible luxury, vegetable-tanned leather, recycled metallurgy, and circular fashion.',
}

const PILLARS = [
  {
    title: 'Vegetable-Tanned Leathers',
    description:
      'We work exclusively with certified European tanneries utilizing natural tree barks and plant extracts, eliminating harmful chromium salts.',
  },
  {
    title: 'Recycled Precious Metallurgy',
    description:
      'Our timepiece cases and jewelry accents utilize 100% recycled 316L stainless steel and ethically certified gold plating.',
  },
  {
    title: 'Plastic-Free Archival Packaging',
    description:
      'All boxes, ribbons, and garment protectors are crafted from FSC-certified recycled pulp and organic unbleached cotton.',
  },
  {
    title: 'Lifetime Repair Program',
    description:
      'True luxury is built to last decades. We offer complimentary artisan stitching and hardware servicing for the life of every product.',
  },
]

export default function SustainabilityPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-20">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-[11px] font-medium uppercase tracking-wider text-[var(--color-text-muted)]">
        <Link href="/" className="hover:text-[var(--color-text-primary)]">Home</Link>
        <span>/</span>
        <span className="text-[var(--color-text-primary)]">Sustainability</span>
      </nav>

      {/* Header */}
      <div className="border-b border-[var(--color-border)] pb-8">
        <span className="text-xs font-bold uppercase tracking-widest text-[var(--color-brand-600)]">
          The House • Conscience &amp; Craft
        </span>
        <h1 className="mt-3 text-3xl font-extrabold uppercase tracking-tight text-[var(--color-text-primary)] sm:text-5xl">
          Conscious Modern Luxury
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[var(--color-text-muted)] sm:text-base">
          True refinement lies in harmony with our planet. We reject fast-fashion obsolescence
          in favor of small-batch artisanal production and traceable raw materials.
        </p>
      </div>

      {/* Hero Photo Banner */}
      <div className="relative mt-10 aspect-[16/9] w-full overflow-hidden rounded-2xl border border-[var(--color-border)] sm:aspect-[21/9]">
        <Image
          src="https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=1200&auto=format&fit=crop&q=80"
          alt="Artisanal Workshop & Sustainable Craft"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-6 sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-wider text-white">
            100% Traceable European Supply Chain
          </p>
        </div>
      </div>

      {/* 4 Pillars Grid */}
      <div className="mt-14">
        <h2 className="text-lg font-bold uppercase tracking-wider text-[var(--color-text-primary)]">
          Our Four Pillars of Responsibility
        </h2>
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {PILLARS.map((p, idx) => (
            <div
              key={p.title}
              className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-6"
            >
              <span className="text-xs font-bold uppercase tracking-widest text-[var(--color-brand-600)]">
                Pillar 0{idx + 1}
              </span>
              <h3 className="mt-2 text-base font-bold uppercase text-[var(--color-text-primary)]">
                {p.title}
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-[var(--color-text-muted)]">
                {p.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Call to action */}
      <div className="mt-16 text-center border-t border-[var(--color-border)] pt-10">
        <h3 className="text-xl font-bold uppercase text-[var(--color-text-primary)]">
          Invest in Longevity
        </h3>
        <p className="mt-2 text-xs text-[var(--color-text-muted)] sm:text-sm">
          Discover pieces made to be treasured across seasons and generations.
        </p>
        <div className="mt-6 flex justify-center gap-4">
          <Button asChild variant="primary" size="lg">
            <Link href="/products">Shop Sustainable Collection</Link>
          </Button>
          <Button asChild variant="secondary" size="lg">
            <Link href="/about">About Our Story</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
