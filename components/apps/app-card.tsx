'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Star } from 'lucide-react'
import { AppIcon } from '@/components/apps/app-icon'
import { PriceBadge } from '@/components/ui/PriceBadge'
import { formatDownloadCount } from '@/lib/utils'
import type { App } from '@/types'

interface AppCardProps {
  app: App
  index?: number
}

/* Search-result style card: icon, name, meta and the GET pill on one line, a two-line pitch below. */
export function AppCard({ app, index = 0 }: AppCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index, 12) * 0.03 }}
      className="h-full"
    >
      <Link
        href={`/app/${app.id}`}
        className="group flex h-full flex-col rounded-2xl bg-surface p-4 ring-1 ring-line transition-[box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:shadow-lift hover:ring-ink/15"
      >
        <div className="flex items-center gap-3.5">
          <AppIcon app={app} size={64} />
          <div className="min-w-0 flex-1">
            <h3 className="truncate font-semibold leading-tight text-ink">{app.name}</h3>
            <p className="mt-0.5 truncate text-[13px] text-ink-3">{app.category.name} · {app.developer}</p>
            <div className="mt-1.5 flex items-center gap-2 text-xs text-ink-2">
              <span className="inline-flex items-center gap-1 font-semibold text-ink">
                <Star className="h-3 w-3 fill-ink" />
                {app.rating.toFixed(1)}
              </span>
              <span className="h-3 w-px bg-line" />
              <span className="font-mono tabular-nums">{formatDownloadCount(app.downloads)}</span>
            </div>
          </div>
          <PriceBadge price={app.price} />
        </div>
        <p className="mt-3 line-clamp-2 text-[13px] leading-relaxed text-ink-2">{app.description}</p>
      </Link>
    </motion.div>
  )
}
