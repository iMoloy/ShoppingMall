import type { Metadata } from 'next'
import { LookbookClient } from './lookbook-client'

export const metadata: Metadata = {
  title: 'Runway Lookbook & Editorial Drops | Shopping Mall',
  description:
    'Explore complete runway outfit compositions with interactive hotspot styling. Discover tailoring, leather bags, and classic horology.',
}

export default function LookbookPage() {
  return <LookbookClient />
}
