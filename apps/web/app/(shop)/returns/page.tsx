import type { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Returns & Complimentary Exchanges | Shopping Mall',
  description:
    'Enjoy our hassle-free 30-day return policy. Complimentary exchanges with pre-paid return shipping labels.',
}

const RETURN_STEPS = [
  {
    step: '01',
    title: 'Initiate Your Request',
    description:
      'Visit your Order History or contact our Concierge with your order reference number within 30 days of receipt.',
  },
  {
    step: '02',
    title: 'Print Complimentary Label',
    description:
      'A pre-paid insured courier return shipping label will be generated and emailed directly to your inbox.',
  },
  {
    step: '03',
    title: 'Pack & Hand Over',
    description:
      'Place the item in its original box with dust bag, tags attached, and drop it off at any local courier station.',
  },
  {
    step: '04',
    title: 'Instant Refund / Exchange',
    description:
      'Once inspected, your refund is credited within 48 hours, or your replacement item is dispatched immediately.',
  },
]

export default function ReturnsPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-20">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-[11px] font-medium uppercase tracking-wider text-[var(--color-text-muted)]">
        <Link href="/" className="hover:text-[var(--color-text-primary)]">Home</Link>
        <span>/</span>
        <span className="text-[var(--color-text-primary)]">Returns &amp; Exchanges</span>
      </nav>

      {/* Header */}
      <div className="border-b border-[var(--color-border)] pb-8">
        <span className="text-xs font-bold uppercase tracking-widest text-[var(--color-brand-600)]">
          Client Services
        </span>
        <h1 className="mt-3 text-3xl font-extrabold uppercase tracking-tight text-[var(--color-text-primary)] sm:text-5xl">
          Complimentary 30-Day Returns
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[var(--color-text-muted)] sm:text-base">
          We want you to feel complete confidence in every piece you acquire. If an item does not meet
          your expectations, return or exchange it with zero stress.
        </p>
      </div>

      {/* 4 Steps */}
      <div className="mt-12">
        <h2 className="text-lg font-bold uppercase tracking-wider text-[var(--color-text-primary)]">
          The Seamless Return Process
        </h2>
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {RETURN_STEPS.map((s) => (
            <div
              key={s.step}
              className="flex flex-col justify-between rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-6"
            >
              <div>
                <span className="text-xl font-extrabold text-[var(--color-brand-600)]">
                  {s.step}
                </span>
                <h3 className="mt-3 text-base font-bold uppercase text-[var(--color-text-primary)]">
                  {s.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-[var(--color-text-muted)]">
                  {s.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Eligibility Checklist */}
      <div className="mt-16 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-8">
        <h3 className="text-base font-bold uppercase tracking-wider text-[var(--color-text-primary)]">
          Return Eligibility Checklist
        </h3>
        <ul className="mt-4 space-y-3 text-xs text-[var(--color-text-muted)]">
          <li className="flex items-center gap-2">
            <span className="text-emerald-500 font-bold">✓</span>
            Items must be in unworn, unwashed, and original condition.
          </li>
          <li className="flex items-center gap-2">
            <span className="text-emerald-500 font-bold">✓</span>
            All designer tags, protective plastic films, dust bags, and boxes must be included.
          </li>
          <li className="flex items-center gap-2">
            <span className="text-emerald-500 font-bold">✓</span>
            Watches must not have been resized or had links removed.
          </li>
        </ul>
      </div>

      {/* Action Footer */}
      <div className="mt-12 flex flex-wrap justify-between items-center gap-4 border-t border-[var(--color-border)] pt-8">
        <div>
          <h4 className="text-sm font-bold uppercase text-[var(--color-text-primary)]">
            Ready to request a return?
          </h4>
          <p className="text-xs text-[var(--color-text-muted)]">
            Locate your recent order to start the automated exchange portal.
          </p>
        </div>
        <div className="flex gap-3">
          <Button asChild variant="primary" size="lg">
            <Link href="/orders">View Orders</Link>
          </Button>
          <Button asChild variant="secondary" size="lg">
            <Link href="/contact">Support Concierge</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
