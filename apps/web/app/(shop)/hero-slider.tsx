'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface SlideData {
  id: string
  seasonTag: string
  discountBadge: string
  title: string
  description: string
  primaryCta: { label: string; href: string }
  secondaryCta: { label: string; href: string }
  image: string
  imageAlt: string
  badgeTag: string
  badgeTitle: string
}

const SLIDES: SlideData[] = [
  {
    id: 'summer-2026',
    seasonTag: 'Summer Collection 2026',
    discountBadge: 'Up to 35% Off',
    title: "Summer Women's & Men's Signature Drop",
    description:
      'Curated runway fashion, architectural leather accessories, and precision timepieces. Designed with uncompromising craft.',
    primaryCta: { label: 'Shop The Collection', href: '/products' },
    secondaryCta: { label: 'Explore Bags', href: '/products?category=bags' },
    image:
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&auto=format&fit=crop&q=80',
    imageAlt: 'Runway Summer Collection Editorial',
    badgeTag: 'Runway Exclusive',
    badgeTitle: 'Linen Suit & Minimalist Leather',
  },
  {
    id: 'winter-2026',
    seasonTag: 'Winter Collection 2026',
    discountBadge: 'Up to 40% Off',
    title: "Winter Wool, Cashmere & Overcoat Drop",
    description:
      'Architectural virgin wool trench coats, heavy gauge cashmere knitwear, and structured winter silhouettes crafted for cold-weather elegance.',
    primaryCta: { label: 'Shop Winter Drop', href: '/products?category=clothing' },
    secondaryCta: { label: 'Explore Overcoats', href: '/products' },
    image:
      'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800&auto=format&fit=crop&q=80',
    imageAlt: 'Runway Winter Collection Editorial',
    badgeTag: 'Winter Capsule',
    badgeTitle: 'Structured Wool & Double-Breasted Silhouette',
  },
]

export function HeroSlider() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    if (isPaused) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % SLIDES.length)
    }, 5500)

    return () => clearInterval(interval)
  }, [isPaused])

  const currentSlide = SLIDES[currentIndex] ?? SLIDES[0]!

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-6 sm:p-8"
      aria-roledescription="carousel"
      aria-label="Editorial Seasonal Drops"
    >
      {/* Editorial Slide Track */}
      <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-12">
        {/* Left Side: Dynamic Text & Actions */}
        <div className="md:col-span-7">
          {/* Seasonal Tag & Discount Badge */}
          <div className="mb-3 inline-flex items-center gap-2 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[var(--color-brand-600)] transition-all duration-700">
            <span>{currentSlide.seasonTag}</span>
            <span className="h-1 w-1 rounded-sm bg-[var(--color-brand-600)]" />
            <span>{currentSlide.discountBadge}</span>
          </div>

          {/* Heading with smooth crossfade */}
          <div className="min-h-[72px] sm:min-h-[110px] lg:min-h-[130px] flex items-center">
            <h1
              key={currentSlide.id}
              className="animate-in fade-in slide-in-from-bottom-2 duration-700 font-serif text-2xl font-extrabold uppercase leading-[1.12] tracking-tight text-[var(--color-text-primary)] sm:text-4xl lg:text-5xl"
            >
              {currentSlide.title}
            </h1>
          </div>

          {/* Description */}
          <p
            key={`desc-${currentSlide.id}`}
            className="animate-in fade-in duration-700 mt-3 text-xs leading-relaxed text-[var(--color-text-muted)] sm:text-sm"
          >
            {currentSlide.description}
          </p>

          {/* Action Buttons */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Button asChild variant="primary" size="lg">
              <Link href={currentSlide.primaryCta.href}>{currentSlide.primaryCta.label}</Link>
            </Button>
            <Button asChild variant="secondary" size="lg">
              <Link href={currentSlide.secondaryCta.href}>{currentSlide.secondaryCta.label}</Link>
            </Button>
          </div>
        </div>

        {/* Right Side: Crossfading Editorial Image Tile */}
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-[var(--color-border)] sm:aspect-[3/4] md:col-span-5">
          {SLIDES.map((slide, idx) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                idx === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              <Image
                src={slide.image}
                alt={slide.imageAlt}
                fill
                priority={idx === 0}
                sizes="(max-width: 768px) 100vw, 30vw"
                className="object-cover"
              />
              <div className="absolute bottom-2.5 left-2.5 right-2.5 rounded-lg bg-[var(--color-surface)]/85 p-2 backdrop-blur-md">
                <p className="text-[9px] font-bold uppercase tracking-widest text-[var(--color-brand-600)]">
                  {slide.badgeTag}
                </p>
                <p className="text-[11px] font-semibold text-[var(--color-text-primary)] truncate">
                  {slide.badgeTitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Stats Inside Main Hero */}
      <div className="mt-6 grid grid-cols-3 border-t border-[var(--color-border)]/70 pt-5 text-center sm:text-left">
        <div>
          <p className="text-lg font-bold text-[var(--color-text-primary)] sm:text-xl">38+</p>
          <p className="text-[10px] font-medium uppercase tracking-wider text-[var(--color-text-muted)]">
            Curated Styles
          </p>
        </div>
        <div>
          <p className="text-lg font-bold text-[var(--color-text-primary)] sm:text-xl">100%</p>
          <p className="text-[10px] font-medium uppercase tracking-wider text-[var(--color-text-muted)]">
            Authentic Craft
          </p>
        </div>
        <div>
          <p className="text-lg font-bold text-[var(--color-text-primary)] sm:text-xl">48h</p>
          <p className="text-[10px] font-medium uppercase tracking-wider text-[var(--color-text-muted)]">
            Fast Delivery
          </p>
        </div>
      </div>
    </div>
  )
}
