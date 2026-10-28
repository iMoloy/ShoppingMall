'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useCartStore } from '@/store/cart'
import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/toast'
import { api } from '@/lib/api'

export default function CartPage() {
  const { items, updateQuantity, removeItem } = useCartStore()

  async function handleQuantityChange(itemId: string, quantity: number) {
    if (quantity < 1) {
      await handleRemove(itemId)
      return
    }
    const res = await api.patch(`/cart/${itemId}`, { quantity })
    if (res.success) {
      updateQuantity(itemId, quantity)
    } else {
      toast.error('Could not update quantity')
    }
  }

  async function handleRemove(itemId: string) {
    const res = await api.delete(`/cart/${itemId}`)
    if (res.success) {
      removeItem(itemId)
    } else {
      toast.error('Could not remove item')
    }
  }

  const subtotal = items.reduce(
    (sum, i) => sum + parseFloat(i.product.price) * i.quantity,
    0,
  )

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6">
        <h1 className="text-xl font-semibold text-[var(--color-text-primary)]">Your cart is empty</h1>
        <p className="mt-2 text-sm text-[var(--color-text-muted)]">
          Looks like you haven&apos;t added any items to your cart yet.
        </p>
        <div className="mt-6">
          <Button asChild variant="primary">
            <Link href="/products">Browse products</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <h1 className="mb-8 text-2xl font-semibold text-[var(--color-text-primary)]">Shopping Cart</h1>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
        {/* Cart items list */}
        <div className="lg:col-span-8">
          <div className="divide-y divide-[var(--color-border)] rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)]">
            {items.map((item) => (
              <div key={item.id} className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                <div className="flex items-center gap-4">
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md border border-[var(--color-border)] bg-[var(--color-surface-raised)]">
                    {item.product.images[0] ? (
                      <Image
                        src={item.product.images[0]}
                        alt={item.product.name}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs text-[var(--color-text-muted)]">
                        No image
                      </div>
                    )}
                  </div>
                  <div>
                    <Link
                      href={`/products/${item.product.slug}`}
                      className="text-base font-medium text-[var(--color-text-primary)] hover:underline"
                    >
                      {item.product.name}
                    </Link>
                    <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                      Unit price: ${parseFloat(item.product.price).toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:gap-6">
                  {/* Quantity Stepper */}
                  <div className="flex items-center rounded-md border border-[var(--color-border)]">
                    <button
                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      aria-label="Decrease quantity"
                      className="flex h-8 w-8 items-center justify-center text-sm text-[var(--color-text-muted)] transition-colors duration-150 hover:text-[var(--color-text-primary)]"
                    >
                      −
                    </button>
                    <span className="w-8 text-center text-sm font-medium text-[var(--color-text-primary)]">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      aria-label="Increase quantity"
                      className="flex h-8 w-8 items-center justify-center text-sm text-[var(--color-text-muted)] transition-colors duration-150 hover:text-[var(--color-text-primary)]"
                    >
                      +
                    </button>
                  </div>

                  {/* Line Total */}
                  <span className="w-24 text-right text-base font-semibold text-[var(--color-text-primary)]">
                    ${(parseFloat(item.product.price) * item.quantity).toFixed(2)}
                  </span>

                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemove(item.id)}
                    aria-label={`Remove ${item.product.name}`}
                    className="text-xs text-[var(--color-text-muted)] transition-colors duration-150 hover:text-red-500"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary Card */}
        <div className="lg:col-span-4">
          <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
            <h2 className="text-base font-semibold text-[var(--color-text-primary)]">Order Summary</h2>

            <div className="mt-6 space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-[var(--color-text-muted)]">Subtotal</span>
                <span className="font-medium text-[var(--color-text-primary)]">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[var(--color-text-muted)]">Shipping</span>
                <span className="text-xs text-[var(--color-text-muted)]">Calculated at checkout</span>
              </div>
              <div className="border-t border-[var(--color-border)] pt-4">
                <div className="flex justify-between text-base font-semibold text-[var(--color-text-primary)]">
                  <span>Total</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <Button asChild variant="primary" size="lg" className="mt-6 w-full">
              <Link href="/checkout">Proceed to Checkout</Link>
            </Button>

            <p className="mt-4 text-center text-xs text-[var(--color-text-muted)]">
              Secure checkout guaranteed
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
