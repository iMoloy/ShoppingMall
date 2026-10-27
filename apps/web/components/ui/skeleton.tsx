interface SkeletonProps {
  className?: string
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={[
        'animate-pulse rounded-md bg-[var(--color-surface-raised)]',
        className,
      ].join(' ')}
    />
  )
}

// Pre-built card skeleton for product grid
export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-[var(--color-border)] p-4">
      <Skeleton className="aspect-square w-full rounded-md" />
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="h-3 w-1/3" />
      <Skeleton className="h-9 w-full" />
    </div>
  )
}
