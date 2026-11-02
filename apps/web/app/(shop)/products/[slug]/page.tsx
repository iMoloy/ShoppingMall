import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { AddToCartButton } from '@/components/product/add-to-cart-button'
import { ProductGallery } from '@/components/product/product-gallery'
import { StockUrgencyTimer } from '@/components/product/stock-urgency-timer'
import { ProductSizePicker } from '@/components/product/product-size-picker'
import { ProductReviews } from '@/components/product/product-reviews'
import { RecentlyViewed } from '@/components/product/recently-viewed'
import type { ApiSuccess, ProductDetail } from '@shoppingmall/shared-types'
import type { PageParams } from '@/types'

const FALLBACK_PRODUCTS: ProductDetail[] = [
  {
    id: 'prod-1',
    name: 'Oversized Double-Breasted Wool Blazer',
    slug: 'oversized-double-breasted-blazer',
    price: '210.00',
    description:
      'Crafted from structured virgin wool blend with peak lapels and horn buttons. Tailored with relaxed shoulders for an architectural, modern silhouette.',
    images: [
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800&auto=format&fit=crop&q=80',
    ],
    stock: 10,
    createdAt: new Date().toISOString(),
    category: { id: 'c1', name: 'Clothing', slug: 'clothing' },
  },
  {
    id: 'prod-2',
    name: 'Croc-Embossed Structured Shoulder Bag',
    slug: 'croc-embossed-shoulder-bag',
    price: '280.00',
    description:
      'Italian croc-embossed calfskin with magnetic flap closure and brushed silver hardware. Fits daily essentials with internal card and phone compartments.',
    images: [
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&auto=format&fit=crop&q=80',
    ],
    stock: 7,
    createdAt: new Date().toISOString(),
    category: { id: 'c2', name: 'Bags', slug: 'bags' },
  },
  {
    id: 'prod-3',
    name: 'Minimalist Automatic Ceramic Watch',
    slug: 'minimalist-automatic-ceramic-watch',
    price: '345.00',
    description:
      'Scratch-resistant matte ceramic case paired with sapphire crystal glass. Features precision Japanese automatic movement with 42-hour power reserve.',
    images: [
      'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
    ],
    stock: 4,
    createdAt: new Date().toISOString(),
    category: { id: 'c3', name: 'Watches', slug: 'watches' },
  },
  {
    id: 'feat-1',
    name: 'Tailored Linen Oversized Blazer',
    slug: 'tailored-linen-oversized-blazer',
    price: '189.00',
    description:
      'Lightweight summer linen blend tailored for breathable comfort. Natural horn buttons and clean interior binding.',
    images: [
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=80',
    ],
    stock: 12,
    createdAt: new Date().toISOString(),
    category: { id: 'c1', name: 'Clothing', slug: 'clothing' },
  },
  {
    id: 'feat-2',
    name: 'Minimalist Italian Leather Tote',
    slug: 'minimalist-italian-leather-tote',
    price: '249.00',
    description:
      'Buttery soft full-grain leather tote with reinforced handles and interior zip pocket. Room for 15-inch laptop and daily essentials.',
    images: [
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80',
    ],
    stock: 8,
    createdAt: new Date().toISOString(),
    category: { id: 'c2', name: 'Bags', slug: 'bags' },
  },
  {
    id: 'feat-3',
    name: 'Heritage Chronograph Watch in Silver',
    slug: 'heritage-chronograph-watch',
    price: '319.00',
    description:
      '316L surgical-grade stainless steel chronograph with anti-reflective sapphire crystal. Water resistant up to 10 ATM.',
    images: [
      'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&auto=format&fit=crop&q=80',
    ],
    stock: 5,
    createdAt: new Date().toISOString(),
    category: { id: 'c3', name: 'Watches', slug: 'watches' },
  },
]

async function fetchProduct(slug: string): Promise<ProductDetail | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/products/${slug}`,
      { next: { revalidate: 60, tags: [`product-${slug}`] }, signal: AbortSignal.timeout(1200) },
    )
    if (res.status === 404) {
      return FALLBACK_PRODUCTS.find((p) => p.slug === slug) ?? null
    }
    if (!res.ok) {
      return FALLBACK_PRODUCTS.find((p) => p.slug === slug) ?? null
    }
    const json = (await res.json()) as ApiSuccess<ProductDetail>
    return json.data ?? (FALLBACK_PRODUCTS.find((p) => p.slug === slug) ?? null)
  } catch {
    return FALLBACK_PRODUCTS.find((p) => p.slug === slug) ?? null
  }
}

interface Props {
  params: Promise<PageParams>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const product = await fetchProduct(slug ?? '')
  if (!product) return { title: 'Product not found' }
  return {
    title: `${product.name} | Shopping Mall`,
    description: product.description.slice(0, 160),
  }
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params
  const product = await fetchProduct(slug ?? '')
  if (!product) notFound()

  const inStock = product.stock > 0

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
      {/* Breadcrumb Navigation */}
      <nav
        aria-label="Breadcrumb"
        className="mb-8 flex items-center gap-2 text-[11px] font-medium uppercase tracking-wider text-[var(--color-text-muted)]"
      >
        <Link href="/" className="hover:text-[var(--color-text-primary)]">
          Home
        </Link>
        <span>/</span>
        <Link href="/products" className="hover:text-[var(--color-text-primary)]">
          Catalog
        </Link>
        <span>/</span>
        <Link
          href={`/products?category=${product.category.slug}`}
          className="hover:text-[var(--color-text-primary)]"
        >
          {product.category.name}
        </Link>
        <span>/</span>
        <span className="truncate text-[var(--color-text-primary)]">{product.name}</span>
      </nav>

      {/* Product Display Grid (Figma style 3:4 portrait layout) */}
      <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-16">
        {/* Left Side: 3:4 Portrait Fashion Media Gallery with Zoom & Lightbox */}
        <div className="flex flex-col gap-4 lg:col-span-7">
          <ProductGallery
            images={product.images}
            productName={product.name}
            inStock={inStock}
          />
        </div>

        {/* Right Side: Product Details & Purchase Actions */}
        <div className="flex flex-col gap-6 lg:col-span-5">
          {/* Header & Badges */}
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-widest text-[var(--color-brand-600)]">
                {product.category.name}
              </span>
              <span className="text-[var(--color-border)]">•</span>
              <span className="text-xs font-medium text-[var(--color-text-muted)]">
                Ref. #{product.slug.slice(0, 8).toUpperCase()}
              </span>
            </div>

            <h1 className="text-2xl font-bold uppercase tracking-tight text-[var(--color-text-primary)] sm:text-3xl">
              {product.name}
            </h1>

            {/* Price display */}
            <div className="mt-3 flex items-baseline gap-3">
              <span className="text-2xl font-extrabold text-[var(--color-text-primary)]">
                ${parseFloat(product.price).toFixed(2)}
              </span>
              <span className="text-sm text-[var(--color-text-muted)] line-through">
                ${(parseFloat(product.price) * 1.25).toFixed(2)}
              </span>
              <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                Save 25%
              </span>
            </div>
          </div>

          {/* Real-time stock status & same-day dispatch countdown */}
          <StockUrgencyTimer stock={product.stock} />

          {/* Description */}
          <p className="text-sm leading-relaxed text-[var(--color-text-muted)]">
            {product.description}
          </p>

          {/* Interactive Size Selector & Find My Size Calculator */}
          <ProductSizePicker productName={product.name} />

          {/* Add to Cart Actions */}
          <div className="border-t border-[var(--color-border)] pt-4">
            <AddToCartButton product={product} disabled={!inStock} />
          </div>

          {/* Delivery & Service Perks (Figma style icons) */}
          <div className="space-y-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-5 text-xs">
            <div className="flex items-start gap-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mt-0.5 text-[var(--color-brand-600)]"
              >
                <rect width="20" height="14" x="2" y="5" rx="2" />
                <line x1="2" x2="22" y1="10" y2="10" />
              </svg>
              <div>
                <p className="font-semibold text-[var(--color-text-primary)]">
                  Fast Shipping in 48-72 Hours
                </p>
                <p className="text-[var(--color-text-muted)]">
                  Express worldwide tracking included with every order.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mt-0.5 text-[var(--color-brand-600)]"
              >
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                <path d="M3 3v5h5" />
              </svg>
              <div>
                <p className="font-semibold text-[var(--color-text-primary)]">
                  Complimentary 30-Day Returns
                </p>
                <p className="text-[var(--color-text-muted)]">
                  Return or exchange without hassle. Return label included.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mt-0.5 text-[var(--color-brand-600)]"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
              </svg>
              <div>
                <p className="font-semibold text-[var(--color-text-primary)]">
                  100% Guaranteed Authenticity
                </p>
                <p className="text-[var(--color-text-muted)]">
                  Direct from certified fashion houses and master artisans.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Verified Client Reviews & Ratings Breakdown */}
      <ProductReviews productName={product.name} />

      {/* Recently Viewed Shelf */}
      <RecentlyViewed currentProduct={product} />
    </div>
  )
}
