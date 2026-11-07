'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'

interface Props {
  images: string[]
  productName: string
  inStock: boolean
}

export function ProductGallery({ images, productName, inStock }: Props) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isZooming, setIsZooming] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 })
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const activeImage = images[selectedIndex] ?? images[0] ?? ''

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setMousePos({ x, y })
  }

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (!lightboxOpen) return
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setLightboxOpen(false)
      if (e.key === 'ArrowRight') setSelectedIndex((i) => (i + 1) % images.length)
      if (e.key === 'ArrowLeft') setSelectedIndex((i) => (i - 1 + images.length) % images.length)
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [lightboxOpen, images.length])

  // Lock scroll when lightbox is open
  useEffect(() => {
    if (lightboxOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [lightboxOpen])

  return (
    <div className="flex flex-col gap-4">
      {/* Main 3:4 Portrait Image Container with Zoom Lens */}
      <div
        ref={containerRef}
        onMouseEnter={() => setIsZooming(true)}
        onMouseLeave={() => setIsZooming(false)}
        onMouseMove={handleMouseMove}
        onClick={() => setLightboxOpen(true)}
        className="group relative aspect-[3/4] w-full cursor-zoom-in overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-raised)]"
      >
        {activeImage ? (
          <Image
            src={activeImage}
            alt={`${productName} view ${selectedIndex + 1}`}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 55vw"
            style={{
              transformOrigin: `${mousePos.x}% ${mousePos.y}%`,
              transform: isZooming ? 'scale(2.2)' : 'scale(1)',
              transition: isZooming ? 'transform 0.08s ease-out' : 'transform 0.25s ease-out',
            }}
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-[var(--color-text-muted)]">
            Studio Archive Photo
          </div>
        )}

        {/* Zoom Hint / Fullscreen trigger pill */}
        <div className="bg-[var(--color-surface)]/85 pointer-events-none absolute bottom-3 right-3 flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-primary)] opacity-0 shadow-sm backdrop-blur-md transition-opacity duration-200 group-hover:opacity-100">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
            <line x1="11" y1="8" x2="11" y2="14" />
            <line x1="8" y1="11" x2="14" y2="11" />
          </svg>
          <span>Tap to expand</span>
        </div>

        {/* Sold out overlay */}
        {!inStock && (
          <div className="bg-[var(--color-surface)]/70 absolute inset-0 flex items-center justify-center backdrop-blur-[2px]">
            <Badge variant="muted" className="text-sm font-semibold uppercase">
              Out of Stock
            </Badge>
          </div>
        )}
      </div>

      {/* Thumbnail Bar */}
      {images.length > 1 && (
        <div className="flex gap-3" aria-label="Product thumbnails">
          {images.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setSelectedIndex(i)}
              aria-label={`Show photo ${i + 1}`}
              className={`relative aspect-[3/4] h-24 overflow-hidden rounded-md border bg-[var(--color-surface-raised)] transition-all ${
                selectedIndex === i
                  ? 'border-[var(--color-text-primary)] ring-2 ring-[var(--color-text-primary)] ring-offset-2'
                  : 'border-[var(--color-border)] opacity-70 hover:opacity-100'
              }`}
            >
              <Image
                src={img}
                alt={`${productName} thumbnail ${i + 1}`}
                fill
                sizes="96px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen High-Resolution Lightbox Modal */}
      {lightboxOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="High-resolution image viewer"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md sm:p-8"
        >
          {/* Close button */}
          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            aria-label="Close fullscreen view"
            className="absolute right-5 top-5 z-20 flex h-10 w-10 items-center justify-center rounded-md bg-white/10 text-white backdrop-blur-md transition-colors hover:bg-white/20"
          >
            ✕
          </button>

          {/* Left Arrow */}
          {images.length > 1 && (
            <button
              type="button"
              onClick={() => setSelectedIndex((i) => (i - 1 + images.length) % images.length)}
              aria-label="Previous photo"
              className="absolute left-4 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-md bg-white/10 text-white backdrop-blur-md transition-colors hover:bg-white/20"
            >
              ←
            </button>
          )}

          {/* Active Large Image */}
          <div className="relative aspect-[3/4] max-h-[88vh] w-full max-w-2xl overflow-hidden rounded-xl border border-white/10">
            {activeImage && (
              <Image
                src={activeImage}
                alt={`${productName} fullscreen`}
                fill
                sizes="100vw"
                className="object-contain"
                priority
              />
            )}
          </div>

          {/* Right Arrow */}
          {images.length > 1 && (
            <button
              type="button"
              onClick={() => setSelectedIndex((i) => (i + 1) % images.length)}
              aria-label="Next photo"
              className="absolute right-4 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-md bg-white/10 text-white backdrop-blur-md transition-colors hover:bg-white/20"
            >
              →
            </button>
          )}

          {/* Image caption footer */}
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-md bg-black/60 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-md">
            <span>
              {String(selectedIndex + 1).padStart(2, '0')} /{' '}
              {String(images.length).padStart(2, '0')}
            </span>
            <span className="mx-2">&bull;</span>
            <span>{productName}</span>
          </div>
        </div>
      )}
    </div>
  )
}
