import type { Metadata } from 'next'
import { Suspense } from 'react'
import Link from 'next/link'
import { ProductCard } from '@/components/product/product-card'
import { ProductCardSkeleton } from '@/components/ui/skeleton'
import { ProductSearchBar } from './product-search-bar'
import type { ApiSuccess, ProductListItem, Category } from '@shoppingmall/shared-types'
import type { SearchParams } from '@/types'

export const metadata: Metadata = {
  title: 'Collection Catalog | Shopping Mall',
  description: 'Browse our runway collection of bags, watches, clothing, and accessories.',
}

const FALLBACK_CATALOG: ProductListItem[] = [
  {
    id: 'prod-1',
    name: 'Oversized Double-Breasted Wool Blazer',
    slug: 'oversized-double-breasted-blazer',
    price: '210.00',
    images: [
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&auto=format&fit=crop&q=80',
    ],
    stock: 10,
    category: { id: 'c1', name: 'Clothing', slug: 'clothing' },
  },
  {
    id: 'prod-2',
    name: 'Croc-Embossed Structured Shoulder Bag',
    slug: 'croc-embossed-shoulder-bag',
    price: '280.00',
    images: [
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop&q=80',
    ],
    stock: 7,
    category: { id: 'c2', name: 'Bags', slug: 'bags' },
  },
  {
    id: 'prod-3',
    name: 'Minimalist Automatic Ceramic Watch',
    slug: 'minimalist-automatic-ceramic-watch',
    price: '345.00',
    images: [
      'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&auto=format&fit=crop&q=80',
    ],
    stock: 4,
    category: { id: 'c3', name: 'Watches', slug: 'watches' },
  },
  {
    id: 'prod-4',
    name: 'Straight-Leg Pleated Tailored Pants',
    slug: 'straight-leg-pleated-pants',
    price: '145.00',
    images: [
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&auto=format&fit=crop&q=80',
    ],
    stock: 14,
    category: { id: 'c1', name: 'Clothing', slug: 'clothing' },
  },
  {
    id: 'prod-5',
    name: 'Signature Monogram Leather Crossbody',
    slug: 'signature-monogram-crossbody',
    price: '225.00',
    images: [
      'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=800&auto=format&fit=crop&q=80',
    ],
    stock: 9,
    category: { id: 'c2', name: 'Bags', slug: 'bags' },
  },
  {
    id: 'prod-6',
    name: 'Chronograph Black Dial Steel Bracelet',
    slug: 'chronograph-black-dial-steel-bracelet',
    price: '390.00',
    images: [
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&auto=format&fit=crop&q=80',
    ],
    stock: 6,
    category: { id: 'c3', name: 'Watches', slug: 'watches' },
  },
  {
    id: 'prod-7',
    name: 'Relaxed Fit Poplin Cotton Shirt',
    slug: 'relaxed-fit-poplin-shirt',
    price: '95.00',
    images: [
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&auto=format&fit=crop&q=80',
    ],
    stock: 20,
    category: { id: 'c1', name: 'Clothing', slug: 'clothing' },
  },
  {
    id: 'prod-8',
    name: 'Smooth Calfskin Envelope Clutch',
    slug: 'smooth-calfskin-envelope-clutch',
    price: '175.00',
    images: [
      'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?w=800&auto=format&fit=crop&q=80',
    ],
    stock: 11,
    category: { id: 'c2', name: 'Bags', slug: 'bags' },
  },
]

const DEFAULT_CATEGORIES: Category[] = [
  { id: 'c1', name: 'Clothing', slug: 'clothing' },
  { id: 'c2', name: 'Bags', slug: 'bags' },
  { id: 'c3', name: 'Watches', slug: 'watches' },
]

async function fetchProducts(category?: string, query?: string, cursor?: string) {
  const params = new URLSearchParams()
  if (category) params.set('category', category)
  if (query) params.set('q', query)
  if (cursor) params.set('cursor', cursor)
  params.set('limit', '12')

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/products?${params}`,
      { next: { revalidate: 60, tags: ['products'] }, signal: AbortSignal.timeout(1200) },
    )

    let items = FALLBACK_CATALOG
    if (res.ok) {
      const json = (await res.json()) as ApiSuccess<ProductListItem[]>
      if (json.data && json.data.length > 0) items = json.data
    }

    if (category) {
      items = items.filter((p) => p.category.slug === category)
    }
    if (query) {
      const q = query.toLowerCase()
      items = items.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.name.toLowerCase().includes(q),
      )
    }

    return { data: items, meta: undefined }
  } catch {
    let items = FALLBACK_CATALOG
    if (category) {
      items = items.filter((p) => p.category.slug === category)
    }
    if (query) {
      const q = query.toLowerCase()
      items = items.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.name.toLowerCase().includes(q),
      )
    }
    return { data: items, meta: undefined }
  }
}

async function fetchCategories(): Promise<Category[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/categories`,
      { next: { revalidate: 3600, tags: ['categories'] }, signal: AbortSignal.timeout(1200) },
    )
    if (!res.ok) return DEFAULT_CATEGORIES
    const json = (await res.json()) as ApiSuccess<Category[]>
    return json.data?.length > 0 ? json.data : DEFAULT_CATEGORIES
  } catch {
    return DEFAULT_CATEGORIES
  }
}

async function ProductGrid({ category, query }: { category?: string; query?: string }) {
  const { data: products } = await fetchProducts(category, query)

  if (products.length === 0) {
    return (
      <div className="col-span-full flex h-64 flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-[var(--color-border)] p-8 text-center">
        <p className="text-base font-semibold text-[var(--color-text-primary)]">
          No items found
        </p>
        <p className="text-xs text-[var(--color-text-muted)]">
          {query
            ? `No products matched "${query}". Try searching with a different term.`
            : 'Explore all our curated pieces or check back soon for the next drop.'}
        </p>
        <Link
          href="/products"
          className="mt-4 rounded-md bg-[var(--color-text-primary)] px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[var(--color-surface)]"
        >
          View All Products
        </Link>
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
  const query = typeof params['q'] === 'string' ? params['q'] : undefined

  const categories = await fetchCategories()

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      {/* Breadcrumb Navigation */}
      <nav
        aria-label="Breadcrumb"
        className="mb-4 flex items-center gap-2 text-[11px] font-medium uppercase tracking-wider text-[var(--color-text-muted)]"
      >
        <Link href="/" className="hover:text-[var(--color-text-primary)]">
          Home
        </Link>
        <span>/</span>
        <Link href="/products" className="hover:text-[var(--color-text-primary)]">
          Catalog
        </Link>
        {category && (
          <>
            <span>/</span>
            <span className="text-[var(--color-text-primary)]">{category}</span>
          </>
        )}
      </nav>

      {/* Page Title & Search Header */}
      <div className="mb-6 flex flex-col justify-between gap-4 border-b border-[var(--color-border)] pb-6 lg:flex-row lg:items-end">
        <div>
          <h1 className="text-2xl font-bold uppercase tracking-tight text-[var(--color-text-primary)] sm:text-4xl">
            {category ? `${category}` : 'All Products & Essentials'}
          </h1>
          <p className="mt-1 text-xs font-medium uppercase tracking-wider text-[var(--color-text-muted)]">
            Curated Runway Edit • Handcrafted Quality
          </p>
        </div>

        {/* Search input component */}
        <Suspense fallback={<div className="h-10 w-full max-w-md rounded-md bg-[var(--color-surface-raised)]" />}>
          <ProductSearchBar initialQuery={query} />
        </Suspense>
      </div>

      {/* Filter and active query status */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <FilterPill label="All Items" href="/products" active={!category} />
          {categories.map((c) => (
            <FilterPill
              key={c.id}
              label={c.name}
              href={`/products?category=${c.slug}${query ? `&q=${encodeURIComponent(query)}` : ''}`}
              active={category === c.slug}
            />
          ))}
        </div>

        {/* Active search filter reset */}
        {query && (
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-3 py-1 text-xs">
            <span className="text-[var(--color-text-muted)]">Showing results for:</span>
            <span className="font-semibold text-[var(--color-text-primary)]">&ldquo;{query}&rdquo;</span>
            <Link
              href={category ? `/products?category=${category}` : '/products'}
              className="ml-1 text-[var(--color-brand-600)] hover:underline"
            >
              Clear
            </Link>
          </div>
        )}
      </div>

      {/* 3:4 Fashion Product Grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 sm:gap-6">
        <Suspense
          fallback={Array.from({ length: 8 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        >
          <ProductGrid category={category} query={query} />
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
        'inline-flex items-center rounded-full border px-4 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors duration-150',
        active
          ? 'border-[var(--color-text-primary)] bg-[var(--color-text-primary)] text-[var(--color-surface)]'
          : 'border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-[var(--color-text-primary)] hover:text-[var(--color-text-primary)]',
      ].join(' ')}
    >
      {label}
    </Link>
  )
}
