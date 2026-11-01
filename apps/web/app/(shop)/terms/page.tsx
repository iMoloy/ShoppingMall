import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Terms of Service | Shopping Mall',
  description:
    'Terms of purchase, product authenticity guarantee, intellectual property, and client service conditions.',
}

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-20">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-[11px] font-medium uppercase tracking-wider text-[var(--color-text-muted)]">
        <Link href="/" className="hover:text-[var(--color-text-primary)]">Home</Link>
        <span>/</span>
        <span className="text-[var(--color-text-primary)]">Terms of Service</span>
      </nav>

      {/* Header */}
      <div className="border-b border-[var(--color-border)] pb-8">
        <span className="text-xs font-bold uppercase tracking-widest text-[var(--color-brand-600)]">
          Legal &amp; Governance
        </span>
        <h1 className="mt-3 text-3xl font-extrabold uppercase tracking-tight text-[var(--color-text-primary)] sm:text-5xl">
          Terms of Service
        </h1>
        <p className="mt-3 text-xs uppercase tracking-wider text-[var(--color-text-muted)]">
          Effective Date: November 2026
        </p>
      </div>

      <div className="mt-10 space-y-8 text-xs leading-relaxed text-[var(--color-text-muted)] sm:text-sm">
        <section>
          <h2 className="text-base font-bold uppercase text-[var(--color-text-primary)]">
            1. Agreement to Terms
          </h2>
          <p className="mt-2">
            By accessing Shopping Mall or placing an order through our platform, you agree to be bound by these Terms of Service.
            All purchases constitute a binding contract under applicable consumer commercial laws.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold uppercase text-[var(--color-text-primary)]">
            2. 100% Authenticity Guarantee
          </h2>
          <p className="mt-2">
            Every product cataloged on Shopping Mall is guaranteed 100% genuine and original. Pieces are accompanied by an
            individual serial reference code and certificate of authenticity where applicable.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold uppercase text-[var(--color-text-primary)]">
            3. Pricing &amp; Payment
          </h2>
          <p className="mt-2">
            All prices are listed in USD and exclude shipping unless order total qualifies for complimentary delivery.
            We reserve the right to cancel orders in the rare event of typographical pricing errors, issuing an immediate full refund.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold uppercase text-[var(--color-text-primary)]">
            4. Warranty &amp; Limitation of Liability
          </h2>
          <p className="mt-2">
            Timepieces are protected by a 2-year mechanical warranty. Leather goods include complimentary artisan stitching servicing.
            Normal wear and tear or unauthorized third-party modifications void warranty coverage.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold uppercase text-[var(--color-text-primary)]">
            5. Governing Law
          </h2>
          <p className="mt-2">
            These Terms are governed by and construed under international commercial consumer law. Any dispute resolution
            shall proceed through neutral arbitration prior to formal court proceedings.
          </p>
        </section>
      </div>
    </div>
  )
}
