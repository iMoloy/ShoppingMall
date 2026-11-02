import type { Metadata } from 'next'
import { WishlistClient } from './wishlist-client'

export const metadata: Metadata = {
  title: 'My Wishlist & Saved Pieces | Shopping Mall',
  description:
    'Review your personal runway wishlist, saved tailoring, bespoke leather bags, and timepieces.',
}

export default function WishlistPage() {
  return <WishlistClient />
}
