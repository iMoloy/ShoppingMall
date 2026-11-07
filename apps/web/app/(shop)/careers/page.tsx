import type { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Careers at the Atelier | Shopping Mall',
  description:
    'Join our team of designers, artisans, software engineers, and luxury client curators.',
}

const OPEN_POSITIONS = [
  {
    role: 'Senior Leather Goods Designer',
    department: 'Design & Atelier',
    location: 'Paris / Remote',
    type: 'Full-time',
  },
  {
    role: 'Full-Stack Software Engineer (Next.js & TypeScript)',
    department: 'Digital Experience',
    location: 'Remote / Global',
    type: 'Full-time',
  },
  {
    role: 'Luxury Client Concierge Manager',
    department: 'Client Experience',
    location: 'New York Flagship',
    type: 'Full-time',
  },
  {
    role: 'Master Horology Specialist',
    department: 'Watchmaking',
    location: 'Geneva / London',
    type: 'Full-time',
  },
]

export default function CareersPage() {
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
        <span className="text-[var(--color-text-primary)]">Careers</span>
      </nav>

      {/* Header */}
      <div className="border-b border-[var(--color-border)] pb-8">
        <span className="text-xs font-bold uppercase tracking-widest text-[var(--color-brand-600)]">
          The House • People &amp; Culture
        </span>
        <h1 className="mt-3 text-3xl font-extrabold uppercase tracking-tight text-[var(--color-text-primary)] sm:text-5xl">
          Build The Future Of Luxury
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[var(--color-text-muted)] sm:text-base">
          We are craftspeople, architects, engineers, and visionaries united by deliberate design
          and honest luxury. Explore open opportunities to shape our journey.
        </p>
      </div>

      {/* Open Positions List */}
      <div className="mt-12 space-y-4">
        <h2 className="text-lg font-bold uppercase tracking-wider text-[var(--color-text-primary)]">
          Current Open Roles
        </h2>
        <div className="space-y-4">
          {OPEN_POSITIONS.map((pos) => (
            <div
              key={pos.role}
              className="flex flex-col justify-between gap-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-6 transition-colors hover:border-[var(--color-brand-600)] sm:flex-row sm:items-center"
            >
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-brand-600)]">
                  {pos.department}
                </span>
                <h3 className="mt-1 text-base font-bold text-[var(--color-text-primary)]">
                  {pos.role}
                </h3>
                <div className="mt-2 flex items-center gap-3 text-xs text-[var(--color-text-muted)]">
                  <span>{pos.location}</span>
                  <span>•</span>
                  <span>{pos.type}</span>
                </div>
              </div>
              <Button asChild variant="secondary" size="sm">
                <Link href="/contact">Apply Now →</Link>
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* General Inquiry */}
      <div className="mt-16 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-8 text-center sm:p-12">
        <h3 className="text-xl font-bold uppercase text-[var(--color-text-primary)]">
          Don&apos;t See Your Exact Role?
        </h3>
        <p className="mt-2 text-xs text-[var(--color-text-muted)] sm:text-sm">
          We are always eager to connect with exceptional talent across atelier design, photography,
          and engineering.
        </p>
        <div className="mt-6 flex justify-center gap-4">
          <Button asChild variant="primary" size="lg">
            <Link href="/contact">Send Open Application</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
