'use client'

import { useState } from 'react'
import { useCartStore } from '@/store/cart'
import { toast } from '@/components/ui/toast'
import { Button } from '@/components/ui/button'
import { api } from '@/lib/api'
import type { CartItemResponse, ProductDetail } from '@shoppingmall/shared-types'

interface Props {
  product: ProductDetail
  disabled?: boolean
}

export function AddToCartButton({ product, disabled = false }: Props) {
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(false)
  const { addItem, openCart } = useCartStore()

  async function handleAdd() {
    setLoading(true)
    try {
      const res = await api.post<CartItemResponse>('/cart', {
        productId: product.id,
        quantity,
      })

      if (res.success && res.data) {
        addItem(res.data)
      } else {
        addItem({
          id: `cart-${product.id}`,
          quantity,
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
      }
      openCart()
      toast.success(`${product.name} added to cart`)
    } catch {
      addItem({
        id: `cart-${product.id}`,
        quantity,
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
      openCart()
      toast.success(`${product.name} added to cart`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      {/* Quantity stepper (44px touch target) */}
      <div className="flex h-11 items-center rounded-md border border-[var(--color-border)] bg-[var(--color-surface)]">
        <button
          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          disabled={quantity <= 1 || disabled}
          aria-label="Decrease quantity"
          className="flex h-11 w-11 items-center justify-center text-base font-semibold text-[var(--color-text-muted)] transition-colors duration-150 hover:text-[var(--color-text-primary)] disabled:opacity-40"
        >
          −
        </button>
        <span className="w-10 text-center text-sm font-bold text-[var(--color-text-primary)]">
          {quantity}
        </span>
        <button
          onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
          disabled={quantity >= product.stock || disabled}
          aria-label="Increase quantity"
          className="flex h-11 w-11 items-center justify-center text-base font-semibold text-[var(--color-text-muted)] transition-colors duration-150 hover:text-[var(--color-text-primary)] disabled:opacity-40"
        >
          +
        </button>
      </div>

      {/* Primary Action Button (44px touch target) */}
      <Button
        variant="primary"
        size="lg"
        loading={loading}
        disabled={disabled}
        onClick={handleAdd}
        className="h-11 flex-1 uppercase tracking-wider font-semibold text-xs"
      >
        {disabled ? 'Out of Stock' : 'Add to Shopping Bag'}
      </Button>
    </div>
  )
}
