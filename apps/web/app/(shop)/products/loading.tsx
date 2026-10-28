import { ProductCardSkeleton } from '@/components/ui/skeleton'

export default function ProductsLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="h-7 w-36 animate-pulse rounded bg-[var(--color-surface-raised)]" />
        <div className="h-9 w-32 animate-pulse rounded-md bg-[var(--color-surface-raised)]" />
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}
