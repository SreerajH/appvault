'use client'
import { AppCard } from './app-card'
import { AppGridSkeleton } from '@/components/common/loading-skeleton'
import { EmptyState } from '@/components/common/empty-state'
import { cn } from '@/lib/utils'
import type { App } from '@/types'

interface AppGridProps {
  apps: App[]
  loading?: boolean
  className?: string
}

export function AppGrid({ apps, loading = false, className }: AppGridProps) {
  if (loading) return <AppGridSkeleton />
  if (apps.length === 0) return <EmptyState />
  return (
    <div className={cn('grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4', className)}>
      {apps.map((app, index) => (
        <AppCard key={app.id} app={app} index={index} />
      ))}
    </div>
  )
}
