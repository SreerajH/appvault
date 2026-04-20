import { Skeleton } from '@/components/ui/skeleton'

export function AppCardSkeleton() {
  return (
    <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900/50 space-y-3">
      <div className="flex items-start gap-3">
        <Skeleton className="h-16 w-16 rounded-2xl flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
          <Skeleton className="h-3 w-1/3" />
        </div>
      </div>
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-4/5" />
    </div>
  )
}

export function AppGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => <AppCardSkeleton key={i} />)}
    </div>
  )
}
