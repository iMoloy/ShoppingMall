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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-[var(--color-border)] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-brand-600)]">
              Console Overview
            </span>
            <span className="text-[var(--color-border)]">•</span>
            <span className="text-xs text-[var(--color-text-muted)]">Live Data</span>
          </div>
          <h1 className="mt-1 font-serif text-2xl font-bold uppercase tracking-tight text-[var(--color-text-primary)] sm:text-3xl">
            Storefront Operations
          </h1>
          <p className="mt-1 text-sm text-[var(--color-text-muted)]">
            Real-time sales telemetry, atelier inventory health, and recent order transactions.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button asChild variant="secondary" size="sm">
            <Link href="/lookbook">View Lookbook</Link>
          </Button>
          <Button asChild variant="primary" size="sm">
            <Link href="/dashboard/products/new">+ Add Product</Link>
          </Button>
        </div>
      </div>

      {/* Out of Stock Alert Banner */}
      {outOfStockCount > 0 && (
        <div className="flex items-center justify-between rounded-lg border border-amber-500/20 bg-amber-500/5 px-4 py-3 text-amber-700 dark:text-amber-400">
          <div className="flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
              <line x1="12" x2="12" y1="9" y2="13" />
              <line x1="12" x2="12.01" y1="17" y2="17" />
            </svg>
            <p className="text-xs font-medium">
              <strong className="font-semibold">{outOfStockCount} item{outOfStockCount > 1 ? 's' : ''}</strong> currently out of stock in the atelier catalogue.
            </p>
          </div>
          <Link
            href="/dashboard/products"
            className="text-xs font-semibold underline underline-offset-4 hover:opacity-80"
          >
            Review Inventory →
          </Link>
        </div>
      )}

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-sm transition-shadow hover:shadow-md">
          <div className="flex items-center justify-between text-[var(--color-text-muted)]">
            <p className="text-[11px] font-bold uppercase tracking-wider">Gross Revenue</p>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--color-brand-600)]" aria-hidden="true">
              <line x1="12" x2="12" y1="2" y2="22" />
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </div>
          <p className="mt-3 font-serif text-2xl font-bold text-[var(--color-text-primary)]">${totalSales.toFixed(2)}</p>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400">
            <span>↑ Active stream</span>
            <span className="text-[var(--color-text-muted)]">• Completed & pending</span>
          </div>
        </div>

        <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-sm transition-shadow hover:shadow-md">
          <div className="flex items-center justify-between text-[var(--color-text-muted)]">
            <p className="text-[11px] font-bold uppercase tracking-wider">Total Orders</p>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--color-brand-600)]" aria-hidden="true">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
              <path d="M3 6h18" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
          </div>
          <p className="mt-3 font-serif text-2xl font-bold text-[var(--color-text-primary)]">{orders.length}</p>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-[var(--color-text-muted)]">
            <span>Customer transactions logged</span>
          </div>
        </div>

        <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-sm transition-shadow hover:shadow-md">
          <div className="flex items-center justify-between text-[var(--color-text-muted)]">
            <p className="text-[11px] font-bold uppercase tracking-wider">Catalogue Items</p>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--color-brand-600)]" aria-hidden="true">
              <rect width="7" height="9" x="3" y="3" rx="1" />
              <rect width="7" height="5" x="14" y="3" rx="1" />
              <rect width="7" height="9" x="14" y="12" rx="1" />
              <rect width="7" height="5" x="3" y="16" rx="1" />
            </svg>
          </div>
          <p className="mt-3 font-serif text-2xl font-bold text-[var(--color-text-primary)]">{products.length}</p>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-[var(--color-text-muted)]">
            <span>Curated pieces online</span>
          </div>
        </div>

        <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-sm transition-shadow hover:shadow-md">
          <div className="flex items-center justify-between text-[var(--color-text-muted)]">
            <p className="text-[11px] font-bold uppercase tracking-wider">Stock Alerts</p>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={outOfStockCount > 0 ? "text-red-500" : "text-emerald-500"} aria-hidden="true">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" x2="12" y1="8" y2="12" />
              <line x1="12" x2="12.01" y1="16" y2="16" />
            </svg>
          </div>
          <p className="mt-3 font-serif text-2xl font-bold text-[var(--color-text-primary)]">{outOfStockCount}</p>
          <div className="mt-2 flex items-center gap-1.5 text-xs">
            {outOfStockCount > 0 ? (
              <span className="text-red-500 font-medium">Restock needed</span>
            ) : (
              <span className="text-emerald-600 dark:text-emerald-400 font-medium">All items healthy</span>
            )}
          </div>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-sm">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="font-serif text-lg font-bold tracking-tight text-[var(--color-text-primary)]">Recent Client Orders</h2>
            <p className="text-xs text-[var(--color-text-muted)]">Latest purchases requiring atelier dispatch or fulfillment.</p>
          </div>
          <Link
            href="/dashboard/orders"
            className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-[var(--color-brand-600)] hover:underline"
          >
            <span>All orders</span>
            <span aria-hidden="true">→</span>
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="rounded-md border border-dashed border-[var(--color-border)] py-12 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-[var(--color-text-muted)] mb-3" aria-hidden="true">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
              <path d="M3 6h18" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            <p className="text-sm font-medium text-[var(--color-text-primary)]">No orders placed yet</p>
            <p className="mt-1 text-xs text-[var(--color-text-muted)]">When customers place orders, they will appear here in real time.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-[var(--color-border)] text-[11px] font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-3">Order Waybill</th>
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3">Fulfillment</th>
                  <th className="py-3 px-3 text-right">Settlement</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)]">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="transition-colors hover:bg-[var(--color-surface-raised)]/70">
                    <td className="py-3.5 px-3">
                      <span className="font-mono text-xs font-semibold text-[var(--color-text-primary)]">
                        #{order.id.slice(0, 12)}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-xs text-[var(--color-text-muted)]">
                      {new Date(order.createdAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="py-3.5 px-3">
                      <Badge variant={order.status === 'DELIVERED' ? 'success' : 'default'} className="rounded-md uppercase tracking-wider text-[10px]">
                        {order.status}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-3 text-right font-serif text-sm font-bold text-[var(--color-text-primary)]">
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
