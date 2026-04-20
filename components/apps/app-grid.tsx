'use client'
import { motion } from 'framer-motion'
import { AppCard } from './app-card'
import { AppGridSkeleton } from '@/components/common/loading-skeleton'
import { EmptyState } from '@/components/common/empty-state'
import type { App } from '@/types'

interface AppGridProps {
  apps: App[]
  loading?: boolean
}

export function AppGrid({ apps, loading = false }: AppGridProps) {
  if (loading) return <AppGridSkeleton />
  if (apps.length === 0) return <EmptyState />
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.05 } } }}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
    >
      {apps.map((app, index) => (
        <AppCard key={app.id} app={app} index={index} />
      ))}
    </motion.div>
  )
}
