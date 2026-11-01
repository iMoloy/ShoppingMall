import type { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Shipping & Worldwide Delivery | Shopping Mall',
  description:
    'Learn about our express worldwide shipping, complimentary delivery over $120, and tracking options.',
}

const SHIPPING_TIERS = [
  {
    name: 'Standard Express',
    timeline: '3–5 Business Days',
    cost: 'Free on orders $120+ ($9.99 under $120)',
    description: 'Tracked ground delivery via DHL Express and FedEx.',
  },
  {
    name: 'Priority Atelier',
    timeline: '1–2 Business Days',
    cost: '$19.99',
    description: 'Dispatched same-day for orders placed before 2 PM EST.',
  },
  {
    name: 'White-Glove International',
    timeline: '3–6 Business Days',
    cost: 'Calculated at checkout (Free over $250)',
    description: 'Direct courier delivery with pre-paid import duties and taxes.',
  },
]

export default function ShippingPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-20">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-[11px] font-medium uppercase tracking-wider text-[var(--color-text-muted)]">
        <Link href="/" className="hover:text-[var(--color-text-primary)]">Home</Link>
        <span>/</span>
        <span className="text-[var(--color-text-primary)]">Shipping &amp; Delivery</span>
      </nav>

      {/* Header */}
      <div className="border-b border-[var(--color-border)] pb-8">
        <span className="text-xs font-bold uppercase tracking-widest text-[var(--color-brand-600)]">
          Client Services
        </span>
        <h1 className="mt-3 text-3xl font-extrabold uppercase tracking-tight text-[var(--color-text-primary)] sm:text-5xl">
          Shipping &amp; Delivery
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[var(--color-text-muted)] sm:text-base">
          Every piece from our atelier is meticulously inspected, wrapped in plastic-free archival packaging,
          and dispatched with full transit insurance.
        </p>
      </div>

      {/* Tiers Grid */}
      <div className="mt-12">
        <h2 className="text-lg font-bold uppercase tracking-wider text-[var(--color-text-primary)]">
          Delivery Options &amp; Rates
        </h2>
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
          {SHIPPING_TIERS.map((tier) => (
            <div
              key={tier.name}
              className="flex flex-col justify-between rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-6"
            >
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-brand-600)]">
                  {tier.timeline}
                </span>
                <h3 className="mt-2 text-lg font-bold uppercase text-[var(--color-text-primary)]">
                  {tier.name}
                </h3>
                <p className="mt-2 text-xs font-semibold text-[var(--color-text-primary)]">
                  {tier.cost}
                </p>
                <p className="mt-2 text-xs leading-relaxed text-[var(--color-text-muted)]">
                  {tier.description}
                </p>
              </div>
              <div className="mt-6 border-t border-[var(--color-border)] pt-4 text-[11px] font-medium text-[var(--color-text-muted)]">
                Includes full tracking &amp; signature upon delivery.
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQs Section */}
      <div className="mt-16 space-y-6">
        <h2 className="text-lg font-bold uppercase tracking-wider text-[var(--color-text-primary)]">
          Frequently Asked Questions
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
            <h3 className="text-sm font-bold uppercase text-[var(--color-text-primary)]">
              How do I track my shipment?
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-[var(--color-text-muted)]">
              As soon as your parcel departs our warehouse, you will receive an email and SMS with your live
              courier tracking number and estimated delivery window. You can also view live tracking anytime
              in your <Link href="/orders" className="underline hover:text-[var(--color-text-primary)]">Order History</Link>.
            </p>
          </div>

          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
            <h3 className="text-sm font-bold uppercase text-[var(--color-text-primary)]">
              Are customs &amp; import taxes included?
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-[var(--color-text-muted)]">
              Yes. All international duties, tariffs, and local VAT are calculated and collected directly at checkout.
              Your parcel will arrive with zero surprise fees on delivery.
            </p>
          </div>
        </div>
      </div>

      {/* Concierge Callout */}
      <div className="mt-16 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-8 text-center sm:p-12">
        <h3 className="text-xl font-bold uppercase text-[var(--color-text-primary)]">
          Need Custom Delivery Arrangements?
        </h3>
        <p className="mt-2 text-xs text-[var(--color-text-muted)] sm:text-sm">
          Our client concierge is on standby for discreet gifting, scheduled delivery dates, and hotel deliveries.
        </p>
        <div className="mt-6 flex justify-center gap-4">
          <Button asChild variant="primary" size="lg">
            <Link href="/contact">Contact Concierge</Link>
          </Button>
          <Button asChild variant="secondary" size="lg">
            <Link href="/products">Shop Catalog</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
