import { Skeleton } from '@/components/ui/skeleton'

export function AppCardSkeleton() {
  return (
    <div className="rounded-2xl bg-surface p-4 ring-1 ring-line space-y-3">
      <div className="flex items-center gap-3">
        <Skeleton className="h-16 w-16 rounded-[22.5%] flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
        <Skeleton className="h-8 w-16 rounded-full" />
      </div>
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-4/5" />
    </div>
  )
}

export function AppGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => <AppCardSkeleton key={i} />)}
    </div>
  )
}
