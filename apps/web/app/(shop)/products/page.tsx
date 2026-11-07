import type { Metadata } from 'next'
import { Suspense } from 'react'
import Link from 'next/link'
import { ProductCard } from '@/components/product/product-card'
import { ProductSearchBar } from './product-search-bar'
import { CatalogFilters } from './catalog-filters'
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
  {
    id: 'prod-9',
    name: 'Solar-Powered Minimal Field Watch',
    slug: 'solar-powered-minimal-field-watch',
    price: '290.00',
    images: [
      'https://images.unsplash.com/photo-1508057198894-247b23fe5ade?w=800&auto=format&fit=crop&q=80',
    ],
    stock: 8,
    category: { id: 'c3', name: 'Watches', slug: 'watches' },
  },
  {
    id: 'prod-10',
    name: 'Cashmere-Blend Knit Mock Neck',
    slug: 'cashmere-blend-knit-mock-neck',
    price: '185.00',
    images: [
      'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&auto=format&fit=crop&q=80',
    ],
    stock: 12,
    category: { id: 'c1', name: 'Clothing', slug: 'clothing' },
  },
  {
    id: 'prod-11',
    name: 'Woven Raffia Summer Tote',
    slug: 'woven-raffia-summer-tote',
    price: '195.00',
    images: [
      'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80',
    ],
    stock: 5,
    category: { id: 'c2', name: 'Bags', slug: 'bags' },
  },
  {
    id: 'prod-12',
    name: 'Heritage Leather-Strap Skeleton Watch',
    slug: 'heritage-leather-strap-skeleton-watch',
    price: '450.00',
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
    ],
    stock: 3,
    category: { id: 'c3', name: 'Watches', slug: 'watches' },
  },
]

const DEFAULT_CATEGORIES: Category[] = [
  { id: 'c1', name: 'Clothing', slug: 'clothing' },
  { id: 'c2', name: 'Bags', slug: 'bags' },
  { id: 'c3', name: 'Watches', slug: 'watches' },
]

interface FilterOptions {
  category?: string
  query?: string
  sort?: string
  price?: string
  inStock?: boolean
}

function applyCatalogFilters(items: ProductListItem[], opts: FilterOptions): ProductListItem[] {
  let result = [...items]

  // Category filter
  if (opts.category) {
    result = result.filter((p) => p.category.slug === opts.category)
  }

  // Search query filter
  if (opts.query) {
    const q = opts.query.toLowerCase()
    result = result.filter(
      (p) => p.name.toLowerCase().includes(q) || p.category.name.toLowerCase().includes(q),
    )
  }

  // In Stock Only filter
  if (opts.inStock) {
    result = result.filter((p) => p.stock > 0)
  }

  // Price tier filter
  if (opts.price === 'under-150') {
    result = result.filter((p) => parseFloat(p.price) < 150)
  } else if (opts.price === '150-300') {
    result = result.filter((p) => parseFloat(p.price) >= 150 && parseFloat(p.price) <= 300)
  } else if (opts.price === 'above-300') {
    result = result.filter((p) => parseFloat(p.price) > 300)
  }

  // Sorting
  if (opts.sort === 'price-asc') {
    result.sort((a, b) => parseFloat(a.price) - parseFloat(b.price))
  } else if (opts.sort === 'price-desc') {
    result.sort((a, b) => parseFloat(b.price) - parseFloat(a.price))
  } else if (opts.sort === 'newest') {
    result.reverse()
  }

  return result
}

async function fetchProducts(opts: FilterOptions): Promise<{
  data: ProductListItem[]
  meta?: { total: number; limit: number; nextCursor?: string }
}> {
  try {
    const params = new URLSearchParams()
    if (opts.category) params.set('category', opts.category)
    if (opts.query) params.set('q', opts.query)

    const qs = params.toString() ? `?${params.toString()}` : ''
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products${qs}`, {
      next: { revalidate: 60, tags: ['products'] },
      signal: AbortSignal.timeout(1200),
    })
    if (!res.ok) {
      return { data: applyCatalogFilters(FALLBACK_CATALOG, opts), meta: undefined }
    }
    const json = (await res.json()) as ApiSuccess<ProductListItem[]>
    const items = json.data?.length > 0 ? json.data : FALLBACK_CATALOG
    return { data: applyCatalogFilters(items, opts), meta: json.meta }
  } catch {
    return { data: applyCatalogFilters(FALLBACK_CATALOG, opts), meta: undefined }
  }
}

async function fetchCategories(): Promise<Category[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`, {
      next: { revalidate: 3600, tags: ['categories'] },
      signal: AbortSignal.timeout(1200),
    })
    if (!res.ok) return DEFAULT_CATEGORIES
    const json = (await res.json()) as ApiSuccess<Category[]>
    return json.data?.length > 0 ? json.data : DEFAULT_CATEGORIES
  } catch {
    return DEFAULT_CATEGORIES
  }
}

interface Props {
  searchParams: Promise<SearchParams>
}

export default async function ProductsPage({ searchParams }: Props) {
  const params = await searchParams
  const category = typeof params['category'] === 'string' ? params['category'] : undefined
  const query = typeof params['q'] === 'string' ? params['q'] : undefined
  const sort = typeof params['sort'] === 'string' ? params['sort'] : undefined
  const price = typeof params['price'] === 'string' ? params['price'] : undefined
  const inStock = params['inStock'] === 'true'

  const filterOpts: FilterOptions = { category, query, sort, price, inStock }

  const categories = await fetchCategories()
  const { data: products } = await fetchProducts(filterOpts)

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
        <Suspense
          fallback={
            <div className="h-10 w-full max-w-md rounded-md bg-[var(--color-surface-raised)]" />
          }
        >
          <ProductSearchBar initialQuery={query} />
        </Suspense>
      </div>

      {/* Active Search Query Notice */}
      {query && (
        <div className="mb-6 inline-flex items-center gap-2 rounded-md border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-3 py-1 text-xs">
          <span className="text-[var(--color-text-muted)]">Showing results for:</span>
          <span className="font-semibold text-[var(--color-text-primary)]">
            &ldquo;{query}&rdquo;
          </span>
          <Link
            href={category ? `/products?category=${category}` : '/products'}
            className="ml-1 text-[var(--color-brand-600)] hover:underline"
          >
            Clear
          </Link>
        </div>
      )}

      {/* Interactive Faceted Filter Toolbar */}
      <Suspense
        fallback={<div className="mb-8 h-12 w-full rounded-md bg-[var(--color-surface-raised)]" />}
      >
        <CatalogFilters categories={categories} totalCount={products.length} />
      </Suspense>

      {/* 3:4 Fashion Product Grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4">
        {products.length === 0 ? (
          <div className="col-span-full flex h-64 flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-[var(--color-border)] p-8 text-center">
            <p className="text-base font-semibold text-[var(--color-text-primary)]">
              No matching pieces found
            </p>
            <p className="text-xs text-[var(--color-text-muted)]">
              {query
                ? `No products matched "${query}" under current filters.`
                : 'Try adjusting your price range or category filter.'}
            </p>
            <Link
              href="/products"
              className="mt-4 rounded-md bg-[var(--color-text-primary)] px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[var(--color-surface)]"
            >
              Reset All Filters
            </Link>
          </div>
        ) : (
          products.map((p) => <ProductCard key={p.id} product={p} />)
        )}
      </div>
    </div>
  )
}
