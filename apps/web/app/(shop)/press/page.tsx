import type { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Press & Editorial Inquiries | Shopping Mall',
  description:
    'Press releases, media kits, runway highlights, and official editorial contacts for Shopping Mall.',
}

const PRESS_FEATURES = [
  {
    publication: 'VOGUE EDITORIAL',
    date: 'Summer 2026',
    quote:
      'Shopping Mall represents the rare antidote to excessive markups—redefining quiet luxury through pure lines and surgical-grade craftsmanship.',
  },
  {
    publication: 'GQ STYLE ISSUE',
    date: 'Spring 2026',
    quote:
      'The minimalist chronograph that outshines heritage Swiss houses at a third of the traditional cost.',
  },
  {
    publication: 'HARPER’S BAZAAR',
    date: 'Autumn Edit',
    quote:
      'Handcrafted Italian leather totes with uncompromising architectural silhouettes that belong in every modern wardrobe.',
  },
]

export default function PressPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-20">
      {/* Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="mb-6 flex items-center gap-2 text-[11px] font-medium uppercase tracking-wider text-[var(--color-text-muted)]"
      >
        <Link href="/" className="hover:text-[var(--color-text-primary)]">
          Home
        </Link>
        <span>/</span>
        <span className="text-[var(--color-text-primary)]">Press &amp; Editorial</span>
      </nav>

      {/* Header */}
      <div className="border-b border-[var(--color-border)] pb-8">
        <span className="text-xs font-bold uppercase tracking-widest text-[var(--color-brand-600)]">
          The House • Media &amp; Runway
        </span>
        <h1 className="mt-3 text-3xl font-extrabold uppercase tracking-tight text-[var(--color-text-primary)] sm:text-5xl">
          Press &amp; Editorial
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[var(--color-text-muted)] sm:text-base">
          Official press releases, high-resolution campaign assets, lookbook imagery, and media
          relations for journalists, stylists, and editors.
        </p>
      </div>

      {/* Press Quotes */}
      <div className="mt-12 space-y-6">
        <h2 className="text-lg font-bold uppercase tracking-wider text-[var(--color-text-primary)]">
          Editorial Accolades
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {PRESS_FEATURES.map((item) => (
            <div
              key={item.publication}
              className="flex flex-col justify-between rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-6"
            >
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-brand-600)]">
                  {item.publication}
                </span>
                <p className="mt-3 text-xs italic leading-relaxed text-[var(--color-text-primary)]">
                  &ldquo;{item.quote}&rdquo;
                </p>
              </div>
              <div className="mt-6 border-t border-[var(--color-border)] pt-3 text-[10px] uppercase tracking-wider text-[var(--color-text-muted)]">
                {item.date}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Media Inquiries & Kit */}
      <div className="mt-14 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-8 sm:p-10">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div>
            <h3 className="text-xl font-bold uppercase text-[var(--color-text-primary)]">
              Press Kit &amp; High-Res Assets
            </h3>
            <p className="mt-2 max-w-xl text-xs leading-relaxed text-[var(--color-text-muted)]">
              Download current collection lookbooks, behind-the-scenes artisan photography, brand
              logos, and executive biographies for publishing.
            </p>
            <p className="mt-3 text-xs text-[var(--color-text-primary)]">
              <strong>Direct Press Contact:</strong>{' '}
              <a
                href="mailto:press@shoppingmall.com"
                className="underline hover:text-[var(--color-brand-600)]"
              >
                press@shoppingmall.com
              </a>
            </p>
          </div>
          <Button asChild variant="primary" size="lg">
            <Link href="/contact">Request Media Kit</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
