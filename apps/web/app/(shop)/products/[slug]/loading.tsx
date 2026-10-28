import { Skeleton } from '@/components/ui/skeleton'

export default function ProductDetailLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <Skeleton className="mb-6 h-4 w-64" />
      <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
        <Skeleton className="aspect-square w-full rounded-lg" />
        <div className="flex flex-col gap-4">
          <Skeleton className="h-5 w-24 rounded-full" />
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-10 w-28" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-11 w-full rounded-md" />
        </div>
      </div>
    </div>
  )
}
