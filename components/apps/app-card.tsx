'use client'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Star, Download } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { PriceBadge } from '@/components/ui/PriceBadge'
import { formatDownloadCount } from '@/lib/utils'
import type { App } from '@/types'

interface AppCardProps {
  app: App
  index?: number
}

export function AppCard({ app, index = 0 }: AppCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="cursor-pointer"
    >
      <Link href={`/app/${app.id}`} className="block group h-full">
        <div className="flex flex-col justify-between min-h-[280px] p-4 rounded-2xl border border-border bg-card/50 hover:bg-card hover:border-blue-500/30 transition-all duration-200 shadow-sm hover:shadow-[0_0_20px_rgba(59,130,246,0.25)] dark:shadow-sm dark:hover:shadow-[0_0_20px_rgba(59,130,246,0.25)] h-full">
          <div>
            {/* Icon row */}
            <div className="flex items-start gap-3 mb-3">
              <div className="relative h-16 w-16 rounded-2xl overflow-hidden flex-shrink-0 shadow-lg">
                <Image src={app.icon} alt={app.name} fill className="object-cover" unoptimized />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground truncate group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors">
                  {app.name}
                </h3>
                <p className="text-sm text-muted-foreground truncate">{app.developer}</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                    <span className="text-xs text-amber-400 font-medium">{app.rating.toFixed(1)}</span>
                  </div>
                  <span className="text-muted-foreground/40">•</span>
                  <div className="flex items-center gap-1">
                    <Download className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{formatDownloadCount(app.downloadCount)}</span>
                  </div>
                </div>
              </div>
              <PriceBadge price={app.price} className="flex-shrink-0" />
            </div>

            {/* Description */}
            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed min-h-[2.5rem]">
              {app.description}
            </p>
          </div>

          {/* Category badge pinned to bottom */}
          <div className="mt-3">
            <Badge variant="default" className="text-xs">{app.category.name}</Badge>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
