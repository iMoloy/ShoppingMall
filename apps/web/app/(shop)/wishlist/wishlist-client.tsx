'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useWishlistStore } from '@/store/wishlist'
import { useCartStore } from '@/store/cart'
import { toast } from '@/components/ui/toast'
import { Button } from '@/components/ui/button'
import type { ProductListItem } from '@shoppingmall/shared-types'

export function WishlistClient() {
  const { items, removeItem, clearWishlist } = useWishlistStore()
  const { addItem, openCart } = useCartStore()

  function handleMoveToBag(product: ProductListItem) {
    addItem({
      id: `cart-${product.id}`,
      quantity: 1,
      product: {
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        images: product.images,
        stock: product.stock,
        category: product.category,
      },
    })
    removeItem(product.id)
    openCart()
    toast.success(`${product.name} moved to bag`)
  }

  function handleMoveAllToBag() {
    const inStockItems = items.filter((p) => p.stock > 0)
    if (inStockItems.length === 0) {
      toast.error('No in-stock pieces to move.')
      return
    }

    inStockItems.forEach((product) => {
      addItem({
        id: `cart-${product.id}`,
        quantity: 1,
        product: {
          id: product.id,
          name: product.name,
          slug: product.slug,
          price: product.price,
          images: product.images,
          stock: product.stock,
          category: product.category,
        },
      })
      removeItem(product.id)
    })

    openCart()
    toast.success(`${inStockItems.length} pieces moved to shopping bag`)
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      {/* Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="mb-4 flex items-center gap-2 text-[11px] font-medium uppercase tracking-wider text-[var(--color-text-muted)]"
      >
        <Link href="/" className="hover:text-[var(--color-text-primary)]">
          Home
        </Link>
        <span>/</span>
        <span className="text-[var(--color-text-primary)]">Wishlist</span>
      </nav>

      {/* Header */}
      <div className="mb-8 flex flex-col justify-between gap-4 border-b border-[var(--color-border)] pb-6 sm:flex-row sm:items-end">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-brand-600)]">
            Personal Atelier Edit
          </span>
          <h1 className="mt-1 text-2xl font-extrabold uppercase tracking-tight text-[var(--color-text-primary)] sm:text-4xl">
            Saved Pieces &amp; Wishlist
          </h1>
          <p className="mt-1 text-xs text-[var(--color-text-muted)]">
            {items.length === 0
              ? 'Your personal runway wishlist is currently empty.'
              : `${items.length} curated style${items.length === 1 ? '' : 's'} saved for your collection.`}
          </p>
        </div>

        {items.length > 0 && (
          <div className="flex items-center gap-3">
            <Button
              variant="primary"
              size="sm"
              onClick={handleMoveAllToBag}
              className="uppercase tracking-wider"
            >
              Move All to Bag →
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearWishlist}
              className="text-xs text-[var(--color-text-muted)] hover:text-red-500"
            >
              Clear All
            </Button>
          </div>
        )}
      </div>

      {/* Content */}
      {items.length === 0 ? (
        <div className="flex min-h-[350px] flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--color-border)] p-8 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-[var(--color-surface-raised)] text-[var(--color-text-muted)]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
            </svg>
          </div>
          <h2 className="mt-4 text-base font-extrabold uppercase tracking-tight text-[var(--color-text-primary)]">
            No Saved Pieces Yet
          </h2>
          <p className="mt-1.5 max-w-sm text-xs leading-relaxed text-[var(--color-text-muted)]">
            Explore our curated drops of tailoring, leather bags, and classic timepieces and tap the
            heart icon to save items.
          </p>
          <Button asChild variant="primary" size="md" className="mt-6 uppercase tracking-wider">
            <Link href="/products">Explore All Collections</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4">
          {items.map((product) => {
            const imageUrl = product.images[0] ?? null
            const inStock = product.stock > 0

            return (
              <article
                key={product.id}
                className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-3 transition-all hover:border-[var(--color-brand-600)]"
              >
                <div>
                  {/* 3:4 Image */}
                  <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg bg-[var(--color-surface-raised)]">
                    <Link href={`/products/${product.slug}`} className="block h-full w-full">
                      {imageUrl ? (
                        <Image
                          src={imageUrl}
                          alt={product.name}
                          fill
                          sizes="(max-width: 640px) 50vw, 25vw"
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs text-[var(--color-text-muted)]">
                          Photo
                        </div>
                      )}
                    </Link>

                    {/* Remove button */}
                    <button
                      type="button"
                      onClick={() => {
                        removeItem(product.id)
                        toast.success(`${product.name} removed from wishlist`)
                      }}
                      aria-label={`Remove ${product.name} from wishlist`}
                      className="bg-[var(--color-surface)]/90 absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-md text-[var(--color-text-muted)] shadow-sm backdrop-blur-sm transition-colors hover:text-red-500"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Info */}
                  <div className="mt-3 flex flex-col gap-1">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)]">
                      {product.category.name}
                    </span>
                    <Link
                      href={`/products/${product.slug}`}
                      className="line-clamp-1 text-xs font-bold uppercase tracking-tight text-[var(--color-text-primary)] hover:text-[var(--color-brand-600)]"
                    >
                      {product.name}
                    </Link>
                    <div className="flex items-baseline gap-2">
                      <span className="text-sm font-extrabold text-[var(--color-text-primary)]">
                        ${parseFloat(product.price).toFixed(2)}
                      </span>
                      <span className="text-[11px] text-[var(--color-text-muted)] line-through">
                        ${(parseFloat(product.price) * 1.25).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action button */}
                <div className="border-[var(--color-border)]/60 mt-4 border-t pt-3">
                  <Button
                    variant="primary"
                    size="sm"
                    disabled={!inStock}
                    onClick={() => handleMoveToBag(product)}
                    className="w-full text-[11px] uppercase tracking-wider"
                  >
                    {inStock ? 'Move to Bag' : 'Out of Stock'}
                  </Button>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}
