'use client'
import { motion } from 'framer-motion'
import { SearchX } from 'lucide-react'

interface EmptyStateProps {
  title?: string
  description?: string
  icon?: React.ReactNode
}

export function EmptyState({ title = 'Nothing matches that', description = 'Try a different search, or loosen a filter or two.', icon }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-ink/20 px-6 py-20 text-center"
    >
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-sunken text-ink-2">
        {icon ?? <SearchX className="h-6 w-6" />}
      </div>
      <h3 className="font-display text-xl font-bold text-ink">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-ink-2">{description}</p>
    </motion.div>
  )
}
