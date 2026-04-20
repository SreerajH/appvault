'use client'
import { motion } from 'framer-motion'
import { SearchX } from 'lucide-react'

interface EmptyStateProps {
  title?: string
  description?: string
  icon?: React.ReactNode
}

export function EmptyState({ title = 'No results found', description = 'Try adjusting your search or filters', icon }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-20 text-center"
    >
      <div className="mb-4 p-4 rounded-2xl bg-slate-800/50 text-slate-400">
        {icon ?? <SearchX className="h-12 w-12" />}
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-slate-400 max-w-sm">{description}</p>
    </motion.div>
  )
}
