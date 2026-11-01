import type { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Flagship Boutiques & Global Stockists | Shopping Mall',
  description:
    'Experience Shopping Mall in person. Explore our flagship atelier boutiques in New York, London, Paris, and Tokyo.',
}

const STORES = [
  {
    city: 'New York',
    neighborhood: 'SoHo Flagship',
    address: '482 Broome Street, New York, NY 10013',
    phone: '+1 (212) 555-0182',
    hours: 'Mon–Sat: 11 AM – 7 PM | Sun: 12 PM – 6 PM',
    services: 'Private styling suite, in-store embossing, lifetime repairs',
  },
  {
    city: 'London',
    neighborhood: 'Mayfair Atelier',
    address: '14 Mount Street, London W1K 2RF',
    phone: '+44 20 7946 0912',
    hours: 'Mon–Sat: 10 AM – 6:30 PM | Sun: Closed',
    services: 'Bespoke horology consultations, champagne appointments',
  },
  {
    city: 'Paris',
    neighborhood: 'Le Marais Studio',
    address: '38 Rue de Turenne, 75003 Paris',
    phone: '+33 1 42 68 55 00',
    hours: 'Tue–Sat: 11 AM – 7 PM | Sun: 1 PM – 6 PM',
    services: 'Leather personalization, private atelier tours',
  },
  {
    city: 'Tokyo',
    neighborhood: 'Ginza Sanctuary',
    address: '6-10-1 Ginza, Chuo-ku, Tokyo 104-0061',
    phone: '+81 3 5555 0144',
    hours: 'Daily: 10:30 AM – 8:30 PM',
    services: 'Exclusive Japan-only capsules, watchmaker servicing',
  },
]

export default function StoresPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-20">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-[11px] font-medium uppercase tracking-wider text-[var(--color-text-muted)]">
        <Link href="/" className="hover:text-[var(--color-text-primary)]">Home</Link>
        <span>/</span>
        <span className="text-[var(--color-text-primary)]">Stores &amp; Boutiques</span>
      </nav>

      {/* Header */}
      <div className="border-b border-[var(--color-border)] pb-8">
        <span className="text-xs font-bold uppercase tracking-widest text-[var(--color-brand-600)]">
          The House • Physical Sanctuaries
        </span>
        <h1 className="mt-3 text-3xl font-extrabold uppercase tracking-tight text-[var(--color-text-primary)] sm:text-5xl">
          Flagship Boutiques
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[var(--color-text-muted)] sm:text-base">
          Touch the full-grain leather, experience the weight of surgical steel horology,
          and receive personalized styling from our resident masters.
        </p>
      </div>

      {/* Stores List */}
      <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
        {STORES.map((s) => (
          <div
            key={s.city}
            className="flex flex-col justify-between rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-6 sm:p-8"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-widest text-[var(--color-brand-600)]">
                  {s.city}
                </span>
                <span className="rounded-full bg-[var(--color-surface)] px-2.5 py-0.5 text-[10px] font-semibold text-[var(--color-text-primary)] border border-[var(--color-border)]">
                  {s.neighborhood}
                </span>
              </div>
              <h2 className="mt-3 text-xl font-bold uppercase text-[var(--color-text-primary)]">
                {s.city} Boutique
              </h2>
              <p className="mt-3 text-xs text-[var(--color-text-primary)] font-medium">
                {s.address}
              </p>
              <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                {s.phone}
              </p>
              <div className="mt-4 border-t border-[var(--color-border)] pt-3 text-xs text-[var(--color-text-muted)]">
                <p><strong>Hours:</strong> {s.hours}</p>
                <p className="mt-1"><strong>Atelier Services:</strong> {s.services}</p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[var(--color-border)]">
              <Link
                href="/contact"
                className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-primary)] hover:text-[var(--color-brand-600)]"
              >
                Book Private Appointment →
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Booking Callout */}
      <div className="mt-16 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-8 text-center sm:p-12">
        <h3 className="text-xl font-bold uppercase text-[var(--color-text-primary)]">
          Prefer Private Virtual Styling?
        </h3>
        <p className="mt-2 text-xs text-[var(--color-text-muted)] sm:text-sm">
          Schedule a 1-on-1 video appointment with our head stylist from the comfort of your home.
        </p>
        <div className="mt-6 flex justify-center gap-4">
          <Button asChild variant="primary" size="lg">
            <Link href="/contact">Schedule Appointment</Link>
          </Button>
          <Button asChild variant="secondary" size="lg">
            <Link href="/products">Shop Catalog</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
