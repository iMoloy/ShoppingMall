import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy Policy | Shopping Mall',
  description:
    'Our strict commitment to customer privacy, data encryption, GDPR compliance, and non-disclosure.',
}

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-20">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-[11px] font-medium uppercase tracking-wider text-[var(--color-text-muted)]">
        <Link href="/" className="hover:text-[var(--color-text-primary)]">Home</Link>
        <span>/</span>
        <span className="text-[var(--color-text-primary)]">Privacy Policy</span>
      </nav>

      {/* Header */}
      <div className="border-b border-[var(--color-border)] pb-8">
        <span className="text-xs font-bold uppercase tracking-widest text-[var(--color-brand-600)]">
          Legal &amp; Trust
        </span>
        <h1 className="mt-3 text-3xl font-extrabold uppercase tracking-tight text-[var(--color-text-primary)] sm:text-5xl">
          Privacy Policy
        </h1>
        <p className="mt-3 text-xs uppercase tracking-wider text-[var(--color-text-muted)]">
          Last Updated: November 2026
        </p>
      </div>

      <div className="mt-10 space-y-8 text-xs leading-relaxed text-[var(--color-text-muted)] sm:text-sm">
        <section>
          <h2 className="text-base font-bold uppercase text-[var(--color-text-primary)]">
            1. Overview &amp; Philosophy
          </h2>
          <p className="mt-2">
            Shopping Mall Studio Inc. (&ldquo;we&rdquo;, &ldquo;our&rdquo;, &ldquo;us&rdquo;) treats your personal privacy as an absolute priority.
            We never sell, rent, or trade customer data to advertising brokers or third-party behavioral trackers.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold uppercase text-[var(--color-text-primary)]">
            2. Information We Collect
          </h2>
          <p className="mt-2">
            We collect only the essential information needed to fulfill your purchases and ensure secure delivery:
          </p>
          <ul className="mt-3 list-disc pl-5 space-y-1">
            <li>Contact details: Name, email address, phone number, and physical shipping address.</li>
            <li>Payment data: Encrypted directly via PCI-DSS Level 1 compliant gateways (Stripe &amp; SSLCommerz). We never store raw credit card numbers on our servers.</li>
            <li>Order history: Items purchased, sizing preferences, and transaction receipts for warranty servicing.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-bold uppercase text-[var(--color-text-primary)]">
            3. Data Security &amp; Encryption
          </h2>
          <p className="mt-2">
            All data in transit is protected by end-to-end 256-bit SSL encryption. Internal database access is strictly isolated
            and authenticated through raw JWT token rotation.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold uppercase text-[var(--color-text-primary)]">
            4. Your Rights (GDPR &amp; CCPA)
          </h2>
          <p className="mt-2">
            Regardless of your geographic location, you retain full rights to request an export of all personal data held,
            request permanent erasure of your account, or opt-out of newsletter communications at any time.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold uppercase text-[var(--color-text-primary)]">
            5. Contact Our Data Protection Officer
          </h2>
          <p className="mt-2">
            Inquiries regarding privacy or data requests can be submitted directly to{' '}
            <a href="mailto:privacy@shoppingmall.com" className="text-[var(--color-text-primary)] underline">
              privacy@shoppingmall.com
            </a>.
          </p>
        </section>
      </div>
    </div>
  )
}
