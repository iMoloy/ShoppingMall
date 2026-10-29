'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from '@/components/ui/toast'
import { api } from '@/lib/api'
import type { ProductListItem } from '@shoppingmall/shared-types'

export default function AdminProductsPage() {
  const [products, setProducts] = useState<ProductListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    async function loadProducts() {
      try {
        const res = await api.get<ProductListItem[]>('/products?limit=100')
        if (res.success) {
          setProducts(res.data)
        }
      } finally {
        setLoading(false)
      }
    }
    loadProducts()
  }, [])

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return

    const res = await api.delete(`/products/${id}`)
    if (res.success) {
      setProducts((prev) => prev.filter((p) => p.id !== id))
      toast.success(`"${name}" deleted successfully`)
    } else {
      toast.error('Failed to delete product')
    }
  }

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.name.toLowerCase().includes(search.toLowerCase()),
  )

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-44" />
          <Skeleton className="h-9 w-32" />
        </div>
        <Skeleton className="h-10 w-72" />
        <Skeleton className="h-96 rounded-lg" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--color-text-primary)]">Product Catalog</h1>
          <p className="mt-1 text-sm text-[var(--color-text-muted)]">
            Manage your store inventory, prices, and catalog status.
          </p>
        </div>
        <Button asChild variant="primary">
          <Link href="/dashboard/products/new">+ Add Product</Link>
        </Button>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-4">
        <input
          type="search"
          placeholder="Search by product name or category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-sm rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-brand-600)] focus:outline-none focus:ring-1 focus:ring-[var(--color-brand-600)]"
        />
        <span className="text-xs text-[var(--color-text-muted)]">
          Showing {filtered.length} of {products.length} products
        </span>
      </div>

      {/* Products Table */}
      <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)]">
        {filtered.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-sm font-medium text-[var(--color-text-primary)]">No products found</p>
            <p className="mt-1 text-xs text-[var(--color-text-muted)]">
              {search ? 'Try adjusting your search keywords' : 'Get started by adding your first product.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-[var(--color-border)] text-xs text-[var(--color-text-muted)] uppercase">
                <tr>
                  <th className="py-3 px-4">Product</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Stock</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)]">
                {filtered.map((product) => (
                  <tr key={product.id} className="hover:bg-[var(--color-surface-raised)] transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded border border-[var(--color-border)] bg-[var(--color-surface-raised)]">
                          {product.images[0] ? (
                            <Image
                              src={product.images[0]}
                              alt={product.name}
                              fill
                              sizes="40px"
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center text-[10px] text-[var(--color-text-muted)]">
                              No img
                            </div>
                          )}
                        </div>
                        <span className="font-medium text-[var(--color-text-primary)]">
                          {product.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-[var(--color-text-muted)]">
                      {product.category.name}
                    </td>
                    <td className="py-3 px-4 font-medium text-[var(--color-text-primary)]">
                      ${parseFloat(product.price).toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-[var(--color-text-muted)]">
                      {product.stock} units
                    </td>
                    <td className="py-3 px-4">
                      {product.stock > 10 ? (
                        <Badge variant="success">In Stock</Badge>
                      ) : product.stock > 0 ? (
                        <Badge variant="warning">Low Stock</Badge>
                      ) : (
                        <Badge variant="error">Out of Stock</Badge>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <Link
                        href={`/products/${product.slug}`}
                        target="_blank"
                        className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
                      >
                        View
                      </Link>
                      <button
                        onClick={() => handleDelete(product.id, product.name)}
                        className="text-xs text-red-500 hover:text-red-700 transition-colors"
                      >
                        Delete
                      </button>
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
