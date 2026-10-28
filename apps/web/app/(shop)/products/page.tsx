import type { Metadata } from 'next'
import { Suspense } from 'react'
import Link from 'next/link'
import { ProductCard } from '@/components/product/product-card'
import { ProductCardSkeleton } from '@/components/ui/skeleton'
import type { ApiSuccess, ProductListItem, Category } from '@shoppingmall/shared-types'
import type { SearchParams } from '@/types'

export const metadata: Metadata = {
  title: 'Products',
  description: 'Browse our full collection of bags, watches, and accessories.',
}

async function fetchProducts(category?: string, cursor?: string) {
  const params = new URLSearchParams()
  if (category) params.set('category', category)
  if (cursor) params.set('cursor', cursor)
  params.set('limit', '12')

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/products?${params}`,
    { next: { revalidate: 60, tags: ['products'] } },
  )

  if (!res.ok) return { data: [] as ProductListItem[], meta: undefined }
  const json = (await res.json()) as ApiSuccess<ProductListItem[]>
  return { data: json.data, meta: json.meta }
}

async function fetchCategories() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/categories`,
    { next: { revalidate: 3600, tags: ['categories'] } },
  )
  if (!res.ok) return [] as Category[]
  const json = (await res.json()) as ApiSuccess<Category[]>
  return json.data
}

async function ProductGrid({ category }: { category?: string }) {
  const { data: products } = await fetchProducts(category)

  if (products.length === 0) {
    return (
      <div className="col-span-full flex h-48 flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-[var(--color-border)]">
        <p className="text-sm font-medium text-[var(--color-text-primary)]">No products found</p>
        <p className="text-xs text-[var(--color-text-muted)]">Try a different category</p>
      </div>
    )
  }

  return (
    <>
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </>
  )
}

interface Props {
  searchParams: Promise<SearchParams>
}

export default async function ProductsPage({ searchParams }: Props) {
  const params = await searchParams
  const category = typeof params['category'] === 'string' ? params['category'] : undefined

  const categories = await fetchCategories()

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-[var(--color-text-primary)]">
          {category ? `${category.charAt(0).toUpperCase()}${category.slice(1)}` : 'All products'}
        </h1>
      </div>

      {/* Category filter pills */}
      {categories.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-2">
          <FilterPill label="All" href="/products" active={!category} />
          {categories.map((c) => (
            <FilterPill
              key={c.id}
              label={c.name}
              href={`/products?category=${c.slug}`}
              active={category === c.slug}
            />
          ))}
        </div>
      )}

      {/* Product grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        <Suspense
          fallback={Array.from({ length: 8 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        >
          <ProductGrid category={category} />
        </Suspense>
      </div>
    </div>
  )
}

function FilterPill({ label, href, active }: { label: string; href: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={[
        'inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium transition-colors duration-150',
        active
          ? 'border-[var(--color-brand-600)] bg-[var(--color-brand-600)] text-white'
          : 'border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-[var(--color-text-primary)] hover:text-[var(--color-text-primary)]',
      ].join(' ')}
    >
      {label}
    </Link>
  )
}
