'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { api } from '@/lib/api'
import type { OrderResponse, ProductListItem } from '@shoppingmall/shared-types'

export default function DashboardOverviewPage() {
  const [orders, setOrders] = useState<OrderResponse[]>([])
  const [products, setProducts] = useState<ProductListItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const [ordersRes, productsRes] = await Promise.all([
          api.get<OrderResponse[]>('/orders'),
          api.get<ProductListItem[]>('/products?limit=100'),
        ])

        if (ordersRes.success) setOrders(ordersRes.data)
        if (productsRes.success) setProducts(productsRes.data)
      } catch {
        // Fallback gracefully on network error
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const totalSales = orders.reduce((sum, o) => sum + parseFloat(o.total), 0)
  const outOfStockCount = products.filter((p) => p.stock === 0).length
  const recentOrders = orders.slice(0, 5)

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-lg" />
          ))}
        </div>
        <Skeleton className="h-64 rounded-lg" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--color-text-primary)]">Dashboard Overview</h1>
          <p className="mt-1 text-sm text-[var(--color-text-muted)]">
            Store performance, product inventory, and customer activity summary.
          </p>
        </div>
        <div>
          <Button asChild variant="primary">
            <Link href="/dashboard/products/new">+ Add Product</Link>
          </Button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Total Sales</p>
          <p className="mt-2 text-2xl font-bold text-[var(--color-text-primary)]">${totalSales.toFixed(2)}</p>
          <p className="mt-1 text-xs text-emerald-600 dark:text-emerald-400">All completed & pending transactions</p>
        </div>

        <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Total Orders</p>
          <p className="mt-2 text-2xl font-bold text-[var(--color-text-primary)]">{orders.length}</p>
          <p className="mt-1 text-xs text-[var(--color-text-muted)]">Customer orders placed</p>
        </div>

        <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Total Products</p>
          <p className="mt-2 text-2xl font-bold text-[var(--color-text-primary)]">{products.length}</p>
          <p className="mt-1 text-xs text-[var(--color-text-muted)]">Listed in catalog</p>
        </div>

        <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Out of Stock</p>
          <p className="mt-2 text-2xl font-bold text-[var(--color-text-primary)]">{outOfStockCount}</p>
          <p className="mt-1 text-xs text-red-500">Requires inventory replenishment</p>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-[var(--color-text-primary)]">Recent Orders</h2>
          <Link
            href="/dashboard/orders"
            className="text-xs font-medium text-[var(--color-brand-600)] hover:underline"
          >
            View all orders →
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <p className="py-8 text-center text-sm text-[var(--color-text-muted)]">No orders placed yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-[var(--color-border)] text-xs text-[var(--color-text-muted)] uppercase">
                <tr>
                  <th className="py-3 px-2">Order ID</th>
                  <th className="py-3 px-2">Date</th>
                  <th className="py-3 px-2">Status</th>
                  <th className="py-3 px-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)]">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-[var(--color-surface-raised)]">
                    <td className="py-3 px-2 font-mono text-xs">{order.id}</td>
                    <td className="py-3 px-2 text-xs text-[var(--color-text-muted)]">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-2">
                      <Badge variant={order.status === 'DELIVERED' ? 'success' : 'default'}>
                        {order.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-2 text-right font-medium">
                      ${parseFloat(order.total).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
