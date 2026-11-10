'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/toast'
import { api } from '@/lib/api'

interface LiveTrackingResponse {
  order: {
    id: string
    status: string
    courier: string | null
    trackingNumber: string | null
    total: string
    currency: string
    items: {
      quantity: number
      priceAtTime: string
      product: { name: string; images: string[] }
    }[]
  }
  milestones: { stage: string; description: string; done: boolean }[]
}

interface TimelineEvent {
  status: string
  location: string
  timestamp: string
  description: string
  completed: boolean
  current: boolean
}

const DEFAULT_TIMELINE: TimelineEvent[] = [
  {
    status: 'Order Placed & Authenticated',
    location: 'Paris Atelier Studio',
    timestamp: 'Today, 09:14 AM',
    description: 'Order confirmed and payment verified with 256-bit SSL encryption.',
    completed: true,
    current: false,
  },
  {
    status: 'Artisan Quality Inspection',
    location: 'Quality Control Atelier (Paris)',
    timestamp: 'Today, 11:30 AM',
    description: 'Garment stitching, hardware, and leather finish inspected by master artisan.',
    completed: true,
    current: false,
  },
  {
    status: 'Dispatched via DHL Express',
    location: 'Charles de Gaulle Hub (CDG)',
    timestamp: 'Today, 02:45 PM',
    description: 'Handed over to courier with climate-neutral express transit docket.',
    completed: true,
    current: true,
  },
  {
    status: 'International Transit',
    location: 'Regional Sorting Facility',
    timestamp: 'Estimated Tomorrow',
    description: 'En route to local distribution facility.',
    completed: false,
    current: false,
  },
  {
    status: 'Out for White Glove Delivery',
    location: 'Client Destination',
    timestamp: 'Estimated in 48 Hours',
    description: 'Courier agent will contact recipient for signature hand delivery.',
    completed: false,
    current: false,
  },
]

export function TrackingClient() {
  const searchParams = useSearchParams()
  const initialOrderId = searchParams.get('orderId') ?? 'ORD-LUX-2026-X89'
  const [orderQuery, setOrderQuery] = useState(initialOrderId)
  const [activeOrderId, setActiveOrderId] = useState<string | null>(initialOrderId)
  const [liveData, setLiveData] = useState<LiveTrackingResponse | null>(null)
  const [searching, setSearching] = useState(false)

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = orderQuery.trim()
    if (!trimmed) {
      toast.error('Please enter a valid order or waybill number.')
      return
    }
    setSearching(true)
    try {
      const res = await api.get<LiveTrackingResponse>(`/orders/track/${encodeURIComponent(trimmed)}`, {
        skipAuth: true,
      })
      if (res.success && res.data) {
        setLiveData(res.data)
        setActiveOrderId(res.data.order.trackingNumber || trimmed)
        toast.success(`Live shipment dossier loaded for ${trimmed}`)
        return
      }
    } catch {
      // Fallback to sample preview if API or demo waybill is offline
    } finally {
      setSearching(false)
    }

    if (trimmed === 'ORD-LUX-2026-X89') {
      setLiveData(null)
      setActiveOrderId(trimmed)
      toast.success(`Demo dossier loaded for ${trimmed}`)
    } else {
      toast.error(`No shipment found for ${trimmed}`)
    }
  }

  function handleDownloadInvoice() {
    toast.success('Atelier invoice PDF generated and downloaded.')
    window.print()
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      {/* Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="mb-4 flex items-center gap-2 text-[11px] font-medium uppercase tracking-wider text-[var(--color-text-muted)]"
      >
        <Link href="/" className="hover:text-[var(--color-text-primary)]">
          Home
        </Link>
        <span>/</span>
        <span className="text-[var(--color-text-primary)]">Live Shipment Tracking</span>
      </nav>

      {/* Header */}
      <div className="mb-8 border-b border-[var(--color-border)] pb-6">
        <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-brand-600)]">
          Courier Concierge &bull; Global Tracking
        </span>
        <h1 className="mt-1 text-2xl font-extrabold uppercase tracking-tight text-[var(--color-text-primary)] sm:text-4xl">
          Live Order &amp; Courier Tracking
        </h1>
        <p className="mt-1 text-xs text-[var(--color-text-muted)]">
          Real-time transit updates from our atelier to your front door.
        </p>
      </div>

      {/* Search Input Box */}
      <form onSubmit={handleSearch} className="mb-8 flex max-w-md gap-2">
        <input
          type="text"
          value={orderQuery}
          onChange={(e) => setOrderQuery(e.target.value)}
          placeholder="Enter order ID (e.g. ORD-LUX-2026-X89)"
          className="flex-1 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 font-mono text-xs uppercase text-[var(--color-text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-600)]"
        />
        <Button
          type="submit"
          variant="primary"
          size="md"
          disabled={searching}
          className="uppercase tracking-wider"
        >
          {searching ? 'Checking...' : 'Track'}
        </Button>
      </form>

      {activeOrderId && (
        <div className="flex flex-col gap-8">
          {/* Status Overview Card */}
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-6 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--color-border)] pb-6">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-brand-600)]">
                  Active Consignment
                </span>
                <p className="mt-1 font-mono text-xl font-black text-[var(--color-text-primary)]">
                  {activeOrderId}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleDownloadInvoice}
                  className="text-xs uppercase tracking-wider"
                >
                  Download Invoice (PDF)
                </Button>
                <Button asChild variant="ghost" size="sm" className="text-xs">
                  <Link href="/contact">Concierge Support</Link>
                </Button>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4 text-xs sm:grid-cols-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
                  Courier Partner
                </span>
                <p className="mt-1 font-bold text-[var(--color-text-primary)]">
                  {liveData?.order.courier || 'DHL Express VIP'}
                </p>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
                  Waybill Number
                </span>
                <p className="mt-1 font-mono font-bold text-[var(--color-text-primary)]">
                  {liveData?.order.trackingNumber || 'DHL-FR-9824104'}
                </p>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
                  Status
                </span>
                <p className="mt-1 font-bold text-emerald-600 dark:text-emerald-400">
                  {liveData?.order.status || 'White Glove Priority'}
                </p>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
                  Estimated Delivery
                </span>
                <p className="mt-1 font-bold text-[var(--color-text-primary)]">Within 48 Hours</p>
              </div>
            </div>
          </div>

          {/* Timeline Visual */}
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 sm:p-8">
            <h2 className="mb-6 text-sm font-extrabold uppercase tracking-wider text-[var(--color-text-primary)]">
              Shipment Progress Dossier
            </h2>

            <ol className="relative ml-3 space-y-8 border-l border-[var(--color-border)]">
              {(liveData
                ? liveData.milestones.map((m, idx, arr) => ({
                    status: m.stage,
                    location: liveData.order.courier || 'Atelier Logistics',
                    timestamp: m.done ? 'Completed' : 'Pending',
                    description: m.description,
                    completed: m.done,
                    current: m.done && (idx === arr.length - 1 || !arr[idx + 1]?.done),
                  }))
                : DEFAULT_TIMELINE
              ).map((step) => (
                <li key={step.status} className="mb-8 ml-6 last:mb-0">
                  <span
                    className={`absolute -left-3 flex h-6 w-6 items-center justify-center rounded-md text-xs font-bold ${
                      step.completed
                        ? 'bg-[var(--color-brand-600)] text-white shadow-sm'
                        : step.current
                          ? 'border-2 border-[var(--color-brand-600)] bg-[var(--color-surface)] text-[var(--color-brand-600)]'
                          : 'border border-[var(--color-border)] bg-[var(--color-surface-raised)] text-[var(--color-text-muted)]'
                    }`}
                  >
                    {step.completed ? '✓' : '•'}
                  </span>

                  <div className="flex flex-col gap-0.5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3
                        className={`text-xs font-bold uppercase tracking-wider ${
                          step.completed || step.current
                            ? 'text-[var(--color-text-primary)]'
                            : 'text-[var(--color-text-muted)]'
                        }`}
                      >
                        {step.status}
                      </h3>
                      <span className="text-[11px] text-[var(--color-text-muted)]">
                        {step.timestamp}
                      </span>
                    </div>

                    <span className="text-[10px] font-semibold text-[var(--color-brand-600)]">
                      {step.location}
                    </span>

                    <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                      {step.description}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          {/* Package Contents Preview */}
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-6">
            <h3 className="mb-4 text-xs font-extrabold uppercase tracking-wider text-[var(--color-text-primary)]">
              Consignment Manifest
            </h3>
            <div className="flex items-center gap-4">
              <div className="relative aspect-[3/4] h-16 w-12 overflow-hidden rounded-md border border-[var(--color-border)] bg-[var(--color-surface)]">
                <Image
                  src="https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=300&auto=format&fit=crop&q=80"
                  alt="Tailored Blazer"
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold uppercase text-[var(--color-text-primary)]">
                  Oversized Double-Breasted Wool Blazer
                </p>
                <p className="text-[11px] text-[var(--color-text-muted)]">
                  Size M &bull; 100% Virgin Wool
                </p>
              </div>
              <span className="text-xs font-bold text-[var(--color-text-primary)]">$210.00</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
