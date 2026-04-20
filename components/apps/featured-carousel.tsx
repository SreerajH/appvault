'use client'
import { useRef } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Star, Download, ChevronLeft, ChevronRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { PriceBadge } from '@/components/ui/PriceBadge'
import { Button } from '@/components/ui/button'
import { formatDownloads } from '@/lib/utils'
import type { App } from '@/types'

export function FeaturedCarousel({ apps }: { apps: App[] }) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (dir: 'left' | 'right') => {
    scrollRef.current?.scrollBy({ left: dir === 'left' ? -320 : 320, behavior: 'smooth' })
  }

  return (
    <div className="relative group">
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory"
      >
        {apps.map((app, index) => (
          <motion.div
            key={app.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex-shrink-0 w-72 snap-start cursor-pointer"
          >
            <Link href={`/app/${app.id}`} className="block group/card">
              <div className="rounded-2xl border border-border bg-card overflow-hidden hover:border-blue-500/50 transition-all duration-300 shadow-sm hover:shadow-[0_0_20px_rgba(59,130,246,0.25)]">
                <div className="relative h-36 bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                  <Image src={app.icon} alt={app.name} width={80} height={80} className="rounded-2xl shadow-2xl" unoptimized />
                  {/* Bottom gradient overlay */}
                  <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-card to-transparent" />
                  {app.featured && (
                    <div className="absolute top-2 right-2">
                      <Badge variant="default" className="text-xs">Featured</Badge>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-foreground group-hover/card:text-blue-500 dark:group-hover/card:text-blue-400 transition-colors truncate">
                    {app.name}
                  </h3>
                  <p className="text-sm text-muted-foreground truncate">{app.developer}</p>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2">
                      <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                      <span className="text-sm text-amber-400">{app.rating.toFixed(1)}</span>
                      <span className="text-muted-foreground text-xs">({formatDownloads(app.downloads)})</span>
                    </div>
                    <PriceBadge price={app.price} />
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      <Button
        variant="secondary"
        size="icon"
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 opacity-0 group-hover:opacity-100 transition-opacity shadow-xl"
        onClick={() => scroll('left')}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <Button
        variant="secondary"
        size="icon"
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 opacity-0 group-hover:opacity-100 transition-opacity shadow-xl"
        onClick={() => scroll('right')}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}
