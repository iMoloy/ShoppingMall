import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { AddToCartButton } from '@/components/product/add-to-cart-button'
import type { ApiSuccess, ProductDetail } from '@shoppingmall/shared-types'
import type { PageParams } from '@/types'

async function fetchProduct(slug: string): Promise<ProductDetail | null> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/products/${slug}`,
    { next: { revalidate: 60, tags: [`product-${slug}`] } },
  )
  if (res.status === 404) return null
  if (!res.ok) return null
  const json = (await res.json()) as ApiSuccess<ProductDetail>
  return json.data
}

interface Props {
  params: Promise<PageParams>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const product = await fetchProduct(slug ?? '')
  if (!product) return { title: 'Product not found' }
  return {
    title: product.name,
    description: product.description.slice(0, 160),
  }
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params
  const product = await fetchProduct(slug ?? '')
  if (!product) notFound()

  const inStock = product.stock > 0
  const mainImage = product.images[0] ?? null

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs text-[var(--color-text-muted)]">
        <Link href="/" className="hover:text-[var(--color-text-primary)]">Home</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-[var(--color-text-primary)]">Products</Link>
        <span>/</span>
        <Link href={`/products?category=${product.category.slug}`} className="hover:text-[var(--color-text-primary)]">{product.category.name}</Link>
        <span>/</span>
        <span className="text-[var(--color-text-primary)]">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-raised)]">
          {mainImage ? (
            <Image
              src={mainImage}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              priority
            />
          ) : (
            <div className="flex h-full items-center justify-center text-[var(--color-text-muted)]">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                <circle cx="9" cy="9" r="2" />
                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
              </svg>
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex flex-col gap-4">
          <div className="flex items-start gap-3">
            <Badge variant="muted">{product.category.name}</Badge>
            <Badge variant={inStock ? 'success' : 'error'}>
              {inStock ? `${product.stock} in stock` : 'Out of stock'}
            </Badge>
          </div>

          <h1 className="text-2xl font-semibold text-[var(--color-text-primary)]">
            {product.name}
          </h1>

          <p className="text-3xl font-semibold text-[var(--color-text-primary)]">
            ${parseFloat(product.price).toFixed(2)}
          </p>

          <p className="text-sm leading-relaxed text-[var(--color-text-muted)]">
            {product.description}
          </p>

          {/* Additional images thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-2">
              {product.images.slice(0, 4).map((img, i) => (
                <div key={i} className="relative h-16 w-16 overflow-hidden rounded-md border border-[var(--color-border)] bg-[var(--color-surface-raised)]">
                  <Image src={img} alt={`${product.name} view ${i + 1}`} fill sizes="64px" className="object-cover" />
                </div>
              ))}
            </div>
          )}

          <div className="mt-2">
            <AddToCartButton product={product} disabled={!inStock} />
          </div>
        </div>
      </div>
    </div>
  )
}
