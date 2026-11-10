'use client'

import { useEffect, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from '@/components/ui/toast'
import { api } from '@/lib/api'
import type { OrderResponse } from '@shoppingmall/shared-types'
import { OrderStatus } from '@shoppingmall/shared-types'

const STATUS_OPTIONS = [
  OrderStatus.PENDING,
  OrderStatus.CONFIRMED,
  OrderStatus.SHIPPED,
  OrderStatus.DELIVERED,
  OrderStatus.CANCELLED,
]

function getBadgeVariant(status: string): 'default' | 'success' | 'warning' | 'error' | 'muted' {
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

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('ALL')
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  useEffect(() => {
    async function loadOrders() {
      try {
        const res = await api.get<OrderResponse[]>('/orders/admin/all')
        if (res.success) {
          setOrders(res.data)
        }
      } finally {
        setLoading(false)
      }
    }
    loadOrders()
  }, [])

  async function handleStatusChange(orderId: string, newStatus: string) {
    setUpdatingId(orderId)
    try {
      const res = await api.patch(`/orders/admin/${orderId}/status`, { status: newStatus })
      if (res.success) {
        setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)))
        toast.success(`Order status updated to ${newStatus}`)
      } else {
        toast.error('Failed to update status')
      }
    } catch {
      toast.error('Network error. Could not update status.')
    } finally {
      setUpdatingId(null)
    }
  }

  const filteredOrders = filter === 'ALL' ? orders : orders.filter((o) => o.status === filter)

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-44" />
        <Skeleton className="h-10 w-96" />
        <Skeleton className="h-96 rounded-lg" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-[var(--color-border)] pb-5">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-brand-600)]">
            Operations
          </span>
          <span className="text-[var(--color-border)]">•</span>
          <span className="text-xs text-[var(--color-text-muted)]">Fulfillment Pipeline</span>
        </div>
        <h1 className="mt-1 font-serif text-2xl font-bold uppercase tracking-tight text-[var(--color-text-primary)] sm:text-3xl">
          Order Dispatch & Fulfillment
        </h1>
        <p className="mt-1 text-sm text-[var(--color-text-muted)]">
          Manage atelier shipping milestones, inspect customer waybills, and update dispatch states.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-[var(--color-border)] pb-3">
        <button
          onClick={() => setFilter('ALL')}
          className={[
            'rounded-md px-3 py-1.5 text-xs font-medium transition-colors duration-150',
            filter === 'ALL'
              ? 'bg-[var(--color-brand-600)] text-white'
              : 'text-[var(--color-text-muted)] hover:bg-[var(--color-surface-raised)] hover:text-[var(--color-text-primary)]',
          ].join(' ')}
        >
          All ({orders.length})
        </button>
        {STATUS_OPTIONS.map((status) => {
          const count = orders.filter((o) => o.status === status).length
          return (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={[
                'rounded-md px-3 py-1.5 text-xs font-medium transition-colors duration-150',
                filter === status
                  ? 'bg-[var(--color-brand-600)] text-white'
                  : 'text-[var(--color-text-muted)] hover:bg-[var(--color-surface-raised)] hover:text-[var(--color-text-primary)]',
              ].join(' ')}
            >
              {status} ({count})
            </button>
          )
        })}
      </div>

      {/* Orders Table */}
      <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)]">
        {filteredOrders.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-sm font-medium text-[var(--color-text-primary)]">No orders found</p>
            <p className="mt-1 text-xs text-[var(--color-text-muted)]">
              {filter !== 'ALL'
                ? `No orders currently in "${filter}" status.`
                : 'No customer orders have been received yet.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-[var(--color-border)] text-xs uppercase text-[var(--color-text-muted)]">
                <tr>
                  <th className="px-4 py-3">Order ID</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Items</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Update Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)]">
                {filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="transition-colors hover:bg-[var(--color-surface-raised)]"
                  >
                    <td className="px-4 py-3 font-mono text-xs font-medium text-[var(--color-text-primary)]">
                      {order.id}
                    </td>
                    <td className="px-4 py-3 text-xs text-[var(--color-text-muted)]">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-xs text-[var(--color-text-primary)]">
                      {order.items.reduce((sum, item) => sum + item.quantity, 0)} items
                      <span className="block text-[10px] text-[var(--color-text-muted)]">
                        {order.items
                          .map((i) => i.product.name)
                          .join(', ')
                          .slice(0, 30)}
                        ...
                      </span>
                    </td>
                    <td className="px-4 py-3 font-semibold text-[var(--color-text-primary)]">
                      ${parseFloat(order.total).toFixed(2)}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={getBadgeVariant(order.status)}>{order.status}</Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <select
                        value={order.status}
                        disabled={updatingId === order.id}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className="rounded border border-[var(--color-border)] bg-[var(--color-surface)] px-2 py-1 text-xs text-[var(--color-text-primary)] focus:border-[var(--color-brand-600)] focus:outline-none disabled:opacity-50"
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
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
