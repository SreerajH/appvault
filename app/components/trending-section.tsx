'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { TrendingUp, Star, Download } from 'lucide-react'
import { formatDownloadCount } from '@/lib/utils'
import type { App } from '@/types'

export function TrendingSection({ apps }: { apps: App[] }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="h-5 w-5 text-blue-400" />
        <h2 className="text-2xl font-bold text-foreground">Trending Now</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {apps.slice(0, 8).map((app, index) => (
          <motion.div
            key={app.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.06 }}
            whileHover={{ y: -4 }}
          >
            <Link href={`/app/${app.id}`} className="block group cursor-pointer">
              <div className={`flex items-center gap-3 p-3 rounded-xl border transition-all duration-200 shadow-sm hover:shadow-[0_0_16px_rgba(59,130,246,0.2)] hover:border-blue-500/30 ${
                index === 0
                  ? 'border-amber-500/40 bg-amber-500/5 dark:bg-amber-500/5 hover:bg-amber-500/10 dark:hover:bg-amber-500/10'
                  : 'border-border bg-card/50 hover:bg-card'
              }`}>
                {/* Rank badge */}
                <span className={`text-2xl font-bold w-6 text-center flex-shrink-0 ${
                  index === 0
                    ? 'bg-gradient-to-b from-amber-400 to-amber-600 bg-clip-text text-transparent'
                    : 'text-muted-foreground/40'
                }`}>
                  {index + 1}
                </span>
                <div className="relative h-12 w-12 rounded-xl overflow-hidden flex-shrink-0">
                  <Image src={app.icon} alt={app.name} fill className="object-cover" unoptimized />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground text-sm truncate group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors">
                    {app.name}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                    <span className="text-xs text-muted-foreground">{app.rating.toFixed(1)}</span>
                    <Download className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{formatDownloadCount(app.downloadCount)}</span>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.section>
  )
}
