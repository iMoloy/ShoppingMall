import type { Metadata } from 'next'
import { Suspense } from 'react'
import { TrackingClient } from './tracking-client'

export const metadata: Metadata = {
  title: 'Live Order & Courier Tracking | Shopping Mall',
  description:
    'Track your runway order and White Glove delivery with real-time waypoint milestones from Paris atelier to your front door.',
}

export default function TrackingPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-5xl px-4 py-20 text-center">Loading shipment dossier...</div>
      }
    >
      <TrackingClient />
    </Suspense>
  )
}
