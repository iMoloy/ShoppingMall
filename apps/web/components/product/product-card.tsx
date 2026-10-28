'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useCartStore } from '@/store/cart'
import { toast } from '@/components/ui/toast'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { api } from '@/lib/api'
import type { CartItemResponse, ProductListItem } from '@shoppingmall/shared-types'

interface ProductCardProps {
  product: ProductListItem
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem, openCart } = useCartStore()

  async function handleAddToCart() {
    const res = await api.post<CartItemResponse>('/cart', {
      productId: product.id,
      quantity: 1,
    })

    if (!res.success) {
      toast.error(res.error?.message || 'Could not add to cart')
      return
    }

    addItem(res.data)
    openCart()
    toast.success(`${product.name} added to cart`)
  }

  const imageUrl = product.images[0] ?? null
  const inStock = product.stock > 0

  return (
    <article className="group flex flex-col rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] transition-colors duration-150 hover:border-[var(--color-brand-600)]">
      {/* Image */}
      <Link href={`/products/${product.slug}`} className="relative block aspect-square overflow-hidden rounded-t-lg bg-[var(--color-surface-raised)]" tabIndex={-1} aria-hidden="true">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-[var(--color-text-muted)]">
            <PlaceholderIcon />
          </div>
        )}
        {!inStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-[var(--color-surface)]/80">
            <Badge variant="muted">Out of stock</Badge>
          </div>
        )}
      </Link>

      {/* Info */}
      <div className="flex flex-1 flex-col gap-2 p-4">
        <Badge variant="muted" className="w-fit">
          {product.category.name}
        </Badge>
        <Link
          href={`/products/${product.slug}`}
          className="line-clamp-2 text-sm font-medium text-[var(--color-text-primary)] hover:underline"
        >
          {product.name}
        </Link>
        <p className="mt-auto pt-1 text-base font-semibold text-[var(--color-text-primary)]">
          ${parseFloat(product.price).toFixed(2)}
        </p>
        <Button
          variant="secondary"
          size="sm"
          className="w-full"
          disabled={!inStock}
          onClick={handleAddToCart}
        >
          {inStock ? 'Add to cart' : 'Out of stock'}
        </Button>
      </div>
    </article>
  )
}

function PlaceholderIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
    </svg>
  )
}
