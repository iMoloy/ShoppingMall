import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { ProductCard } from '@/components/product/product-card'
import { NewsletterForm } from '@/components/ui/newsletter-form'
import { HeroSlider } from './hero-slider'
import type { ProductListItem } from '@shoppingmall/shared-types'

export const metadata: Metadata = {
  title: 'Shopping Mall | Luxury Fashion & Modern Essentials',
  description:
    'Discover the Summer & Winter Collections 2026. Up to 40% off curated clothing, bags, watches, and modern fashion essentials.',
}

const BRAND_PARTNERS = [
  'ADIDAS',
  'ASOS',
  'BERSHKA',
  'LEVI\'S',
  'NIKE',
  'PULL&BEAR',
  'ZARA',
]

const FEATURED_PRODUCTS: ProductListItem[] = [
  {
    id: 'feat-1',
    name: 'Tailored Linen Oversized Blazer',
    slug: 'tailored-linen-oversized-blazer',
    price: '189.00',
    images: [
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&auto=format&fit=crop&q=80',
    ],
    stock: 12,
    category: { id: 'c1', name: 'Clothing', slug: 'clothing' },
  },
  {
    id: 'feat-2',
    name: 'Minimalist Italian Leather Tote',
    slug: 'minimalist-italian-leather-tote',
    price: '249.00',
    images: [
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop&q=80',
    ],
    stock: 8,
    category: { id: 'c2', name: 'Bags', slug: 'bags' },
  },
  {
    id: 'feat-3',
    name: 'Heritage Chronograph Watch in Silver',
    slug: 'heritage-chronograph-watch',
    price: '319.00',
    images: [
      'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&auto=format&fit=crop&q=80',
    ],
    stock: 5,
    category: { id: 'c3', name: 'Watches', slug: 'watches' },
  },
  {
    id: 'feat-4',
    name: 'Pleated Wide-Leg Summer Trousers',
    slug: 'pleated-wide-leg-summer-trousers',
    price: '129.00',
    images: [
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&auto=format&fit=crop&q=80',
    ],
    stock: 15,
    category: { id: 'c1', name: 'Clothing', slug: 'clothing' },
  },
]

const EDITORIAL_TILES = [
  {
    tag: 'EDITORIAL',
    title: 'Style to the Maximum',
    description: 'Crisp tailoring meets effortless daytime silhouettes.',
    image:
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=80',
    link: '/products?category=clothing',
    cta: 'Explore Tailoring',
  },
  {
    tag: 'NEW ARRIVALS',
    title: 'Modern Leathercraft',
    description: 'Handcrafted genuine leather bags with architectural lines.',
    image:
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&auto=format&fit=crop&q=80',
    link: '/products?category=bags',
    cta: 'Discover Bags',
  },
  {
    tag: 'TIMELESS',
    title: 'Precision Horology',
    description: 'Clean dial designs and surgical-grade stainless steel.',
    image:
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
    link: '/products?category=watches',
    cta: 'View Watches',
  },
]

export default function HomePage() {
  return (
    <div className="flex flex-col gap-16 pb-16 sm:gap-24">
      {/* Editorial Fashion Hero Section */}
      <section className="relative border-b border-[var(--color-border)] bg-[var(--color-surface)]">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-16">
          <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-12">
            {/* Left Column (8 Cols): Main Hero Card + 2 Standalone Spotlight Cards */}
            <div className="flex flex-col gap-6 lg:col-span-8">
              {/* Standalone Main Hero Showcase Card with Smooth Seasonal Slider */}
              <HeroSlider />

              {/* 2 Standalone Spotlight Cards (Separated just like the right side cards) */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {/* Standalone Card 1: Curated Tailoring */}
                <div className="group relative flex flex-1 flex-col justify-between overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-6 transition-colors hover:border-[var(--color-brand-600)]">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-brand-600)]">
                      Curated Tailoring
                    </span>
                    <h3 className="mt-2 text-xl font-bold uppercase text-[var(--color-text-primary)]">
                      Monochrome Resort
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-[var(--color-text-muted)]">
                      Structured virgin wool and breathable Italian linen silhouettes.
                    </p>
                  </div>
                  <div className="relative mt-4 aspect-[16/9] w-full overflow-hidden rounded-lg">
                    <Image
                      src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop&q=80"
                      alt="Tailoring Edit"
                      fill
                      sizes="(max-width: 768px) 100vw, 25vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <Link
                    href="/products?category=clothing"
                    className="mt-4 inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-[var(--color-text-primary)] hover:underline"
                  >
                    <span>Shop Tailoring</span>
                    <span>→</span>
                  </Link>
                </div>

                {/* Standalone Card 2: Signature Accents */}
                <div className="group relative flex flex-1 flex-col justify-between overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-6 transition-colors hover:border-[var(--color-brand-600)]">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-brand-600)]">
                      Signature Accents
                    </span>
                    <h3 className="mt-2 text-xl font-bold uppercase text-[var(--color-text-primary)]">
                      Modern Accessories
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-[var(--color-text-muted)]">
                      Sculptural leather belts, eyewear, and crafted hardware accents.
                    </p>
                  </div>
                  <div className="relative mt-4 aspect-[16/9] w-full overflow-hidden rounded-lg">
                    <Image
                      src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&auto=format&fit=crop&q=80"
                      alt="Accessories Edit"
                      fill
                      sizes="(max-width: 768px) 100vw, 25vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <Link
                    href="/products"
                    className="mt-4 inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-[var(--color-text-primary)] hover:underline"
                  >
                    <span>View Accessories</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Right Column (4 Cols): 2 Stacked Standalone Cards */}
            <div className="flex flex-col gap-6 lg:col-span-4">
              {/* Standalone Card 3: Featured Category - Bespoke Bags */}
              <div className="group relative flex flex-1 flex-col justify-between overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-6 transition-colors hover:border-[var(--color-brand-600)]">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-brand-600)]">
                    Featured Category
                  </span>
                  <h3 className="mt-2 text-xl font-bold uppercase text-[var(--color-text-primary)]">
                    Bespoke Bags
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-[var(--color-text-muted)]">
                    Full-grain leather and structured canvas silhouettes tailored for daily movement.
                  </p>
                </div>
                <div className="relative mt-4 aspect-[16/9] w-full overflow-hidden rounded-lg">
                  <Image
                    src="https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&auto=format&fit=crop&q=80"
                    alt="Leather Bags"
                    fill
                    sizes="(max-width: 1024px) 100vw, 25vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <Link
                  href="/products?category=bags"
                  className="mt-4 inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-[var(--color-text-primary)] hover:underline"
                >
                  <span>Shop Bags</span>
                  <span>→</span>
                </Link>
              </div>

              {/* Standalone Card 4: Boutique Horology - Classic Watches */}
              <div className="group relative flex flex-1 flex-col justify-between overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-6 transition-colors hover:border-[var(--color-brand-600)]">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-brand-600)]">
                    Boutique Horology
                  </span>
                  <h3 className="mt-2 text-xl font-bold uppercase text-[var(--color-text-primary)]">
                    Classic Watches
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-[var(--color-text-muted)]">
                    Minimalist dial engineering with sapphire crystal and automatic movement.
                  </p>
                </div>
                <div className="relative mt-4 aspect-[16/9] w-full overflow-hidden rounded-lg">
                  <Image
                    src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&auto=format&fit=crop&q=80"
                    alt="Classic Watches"
                    fill
                    sizes="(max-width: 1024px) 100vw, 25vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <Link
                  href="/products?category=watches"
                  className="mt-4 inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-[var(--color-text-primary)] hover:underline"
                >
                  <span>Shop Watches</span>
                  <span>→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Partner Logo Strip */}
      <section className="mx-auto w-full max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col items-center gap-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[var(--color-text-muted)]">
            Official Stockists &amp; Heritage Labels
          </p>
          <div className="flex w-full flex-wrap items-center justify-center gap-8 border-y border-[var(--color-border)] py-6 sm:gap-14">
            {BRAND_PARTNERS.map((brand) => (
              <span
                key={brand}
                className="text-xs font-extrabold tracking-[0.2em] text-[var(--color-text-muted)] opacity-70 transition-opacity hover:opacity-100 sm:text-sm"
              >
                {brand}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products (3:4 Portrait Ratio Cards) */}
      <section className="mx-auto w-full max-w-7xl px-4 sm:px-6">
        <div className="mb-8 flex flex-col justify-between gap-4 border-b border-[var(--color-border)] pb-4 sm:flex-row sm:items-end">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-brand-600)]">
              Curated Selection
            </span>
            <h2 className="text-2xl font-bold uppercase tracking-tight text-[var(--color-text-primary)] sm:text-3xl">
              Trending This Season
            </h2>
          </div>
          <Link
            href="/products"
            className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-primary)] underline underline-offset-4 hover:text-[var(--color-brand-600)]"
          >
            View All Products ({FEATURED_PRODUCTS.length}+) →
          </Link>
        </div>

        {/* 4-column 3:4 aspect ratio fashion grid */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 sm:gap-6">
          {FEATURED_PRODUCTS.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Editorial Magazine Lookbook Section (with high-res fashion imagery) */}
      <section className="mx-auto w-full max-w-7xl px-4 sm:px-6">
        <div className="mb-8 text-center sm:text-left">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-brand-600)]">
            Inspiration &amp; Concepts
          </span>
          <h2 className="text-2xl font-bold uppercase tracking-tight text-[var(--color-text-primary)] sm:text-3xl">
            Ideas For The Modern Wardrobe
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {EDITORIAL_TILES.map((tile) => (
            <div
              key={tile.title}
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] transition-colors duration-200 hover:border-[var(--color-brand-600)]"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-[var(--color-surface)]">
                <Image
                  src={tile.image}
                  alt={tile.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute left-3 top-3 rounded bg-[var(--color-surface)]/90 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-primary)] shadow-sm backdrop-blur-sm">
                  {tile.tag}
                </div>
              </div>

              <div className="flex flex-1 flex-col justify-between p-6">
                <div>
                  <h3 className="text-lg font-bold uppercase text-[var(--color-text-primary)]">
                    {tile.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-[var(--color-text-muted)]">
                    {tile.description}
                  </p>
                </div>

                <div className="mt-6 border-t border-[var(--color-border)] pt-4">
                  <Link
                    href={tile.link}
                    className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[var(--color-text-primary)] group-hover:text-[var(--color-brand-600)]"
                  >
                    <span>{tile.cta}</span>
                    <span className="transition-transform group-hover:translate-x-1">→</span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Trust & Service Perks Bar */}
      <section className="border-y border-[var(--color-border)] bg-[var(--color-surface)] py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-primary)]">
                Free Worldwide Shipping
              </span>
              <span className="text-xs text-[var(--color-text-muted)]">
                Complimentary delivery on all orders over $120.
              </span>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-primary)]">
                30-Day Easy Returns
              </span>
              <span className="text-xs text-[var(--color-text-muted)]">
                No questions asked refund and exchange policy.
              </span>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-primary)]">
                Encrypted Checkout
              </span>
              <span className="text-xs text-[var(--color-text-muted)]">
                Protected by 256-bit SSL banking-grade encryption.
              </span>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-primary)]">
                Direct Concierge
              </span>
              <span className="text-xs text-[var(--color-text-muted)]">
                24/7 dedicated support via phone, email, and live chat.
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Signup (Figma Style VIP Club) */}
      <section className="mx-auto w-full max-w-7xl px-4 sm:px-6">
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-8 sm:p-14">
          <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
            <span className="rounded-md bg-[var(--color-brand-600)]/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[var(--color-brand-600)]">
              Exclusive Access
            </span>
            <h2 className="mt-4 text-2xl font-bold uppercase tracking-tight text-[var(--color-text-primary)] sm:text-4xl">
              Get -15% On Your First Purchase
            </h2>
            <p className="mt-3 text-xs leading-relaxed text-[var(--color-text-muted)] sm:text-sm">
              Subscribe to receive private invitations to runway sales, limited drops, and
              curated styling edits directly to your inbox.
            </p>
            <div className="mt-8 w-full max-w-md">
              <NewsletterForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
