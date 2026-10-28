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

      if (!res.success) {
        toast.error(res.error?.message || 'Could not add to cart')
        return
      }

      addItem(res.data)
      openCart()
      toast.success(`${product.name} added to cart`)
    } catch {
      toast.error('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center gap-3">
      {/* Quantity stepper */}
      <div className="flex items-center rounded-md border border-[var(--color-border)]">
        <button
          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          disabled={quantity <= 1 || disabled}
          aria-label="Decrease quantity"
          className="flex h-9 w-9 items-center justify-center text-[var(--color-text-muted)] transition-colors duration-150 hover:text-[var(--color-text-primary)] disabled:opacity-40"
        >
          −
        </button>
        <span className="w-8 text-center text-sm text-[var(--color-text-primary)]">{quantity}</span>
        <button
          onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
          disabled={quantity >= product.stock || disabled}
          aria-label="Increase quantity"
          className="flex h-9 w-9 items-center justify-center text-[var(--color-text-muted)] transition-colors duration-150 hover:text-[var(--color-text-primary)] disabled:opacity-40"
        >
          +
        </button>
      </div>

      <Button
        variant="primary"
        size="lg"
        loading={loading}
        disabled={disabled}
        onClick={handleAdd}
        className="flex-1"
      >
        Add to cart
      </Button>
    </div>
  )
}
