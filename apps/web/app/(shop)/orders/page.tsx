'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { api } from '@/lib/api'
import type { OrderResponse } from '@shoppingmall/shared-types'
import { OrderStatus } from '@shoppingmall/shared-types'

function getStatusBadgeVariant(status: string): 'default' | 'success' | 'warning' | 'error' | 'muted' {
  switch (status) {
    case OrderStatus.DELIVERED:
      return 'success'
    case OrderStatus.SHIPPED:
    case OrderStatus.CONFIRMED:
      return 'default'
    case OrderStatus.PENDING:
      return 'warning'
    case OrderStatus.CANCELLED:
      return 'error'
    default:
      return 'muted'
  }
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await api.get<OrderResponse[]>('/orders')
        if (res.success) {
          setOrders(res.data)
        } else {
          setError(res.error?.message || 'Failed to load orders')
        }
      } catch {
        setError('Network error while loading orders')
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [])

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <h1 className="mb-6 text-2xl font-semibold text-[var(--color-text-primary)]">My Orders</h1>
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-lg border border-[var(--color-border)] p-6 space-y-4">
              <div className="flex justify-between items-center">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
              <Skeleton className="h-16 w-full" />
              <div className="flex justify-between items-center pt-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-6 w-24" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-16 text-center sm:px-6">
        <h1 className="text-xl font-semibold text-[var(--color-text-primary)]">Unable to load orders</h1>
        <p className="mt-2 text-sm text-[var(--color-text-muted)]">{error}</p>
        <div className="mt-6">
          <Button variant="secondary" onClick={() => window.location.reload()}>
            Try again
          </Button>
        </div>
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-20 text-center sm:px-6">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-surface-raised)] text-[var(--color-text-muted)]">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
            <path d="M3 6h18" />
            <path d="M16 10a4 4 0 0 1-8 0" />
          </svg>
        </div>
        <h1 className="mt-4 text-xl font-semibold text-[var(--color-text-primary)]">No orders yet</h1>
        <p className="mt-2 text-sm text-[var(--color-text-muted)]">
          When you place an order, it will appear here for tracking and receipt reference.
        </p>
        <div className="mt-6">
          <Button asChild variant="primary">
            <Link href="/products">Start shopping</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-[var(--color-text-primary)]">Order History</h1>
        <p className="mt-1 text-sm text-[var(--color-text-muted)]">
          Review details and delivery status of your previous purchases.
        </p>
      </div>

      <div className="space-y-6">
        {orders.map((order) => {
          const dateStr = new Date(order.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })

          return (
            <div
              key={order.id}
              className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-6"
            >
              <div className="flex flex-col gap-2 border-b border-[var(--color-border)] pb-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                    Order ID
                  </span>
                  <p className="font-mono text-sm font-medium text-[var(--color-text-primary)]">{order.id}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-[var(--color-text-muted)]">Placed on {dateStr}</span>
                  <Badge variant={getStatusBadgeVariant(order.status)}>
                    {order.status}
                  </Badge>
                </div>
              </div>

              {/* Items */}
              <div className="divide-y divide-[var(--color-border)] py-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md border border-[var(--color-border)] bg-[var(--color-surface-raised)]">
                        {item.product.images[0] ? (
                          <Image
                            src={item.product.images[0]}
                            alt={item.product.name}
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-[10px] text-[var(--color-text-muted)]">
                            No img
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[var(--color-text-primary)]">
                          {item.product.name}
                        </p>
                        <p className="text-xs text-[var(--color-text-muted)]">
                          Qty: {item.quantity} × ${parseFloat(item.priceAtTime).toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-[var(--color-text-primary)]">
                      ${(parseFloat(item.priceAtTime) * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Footer Total */}
              <div className="flex items-center justify-between border-t border-[var(--color-border)] pt-4">
                <span className="text-sm text-[var(--color-text-muted)]">Total Amount</span>
                <span className="text-base font-semibold text-[var(--color-text-primary)]">
                  ${parseFloat(order.total).toFixed(2)}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
