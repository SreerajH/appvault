'use client'
import { useRef, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Grid3X3, ChevronLeft, ChevronRight } from 'lucide-react'
import type { Category } from '@/types'

export function CategoriesSection({ categories }: { categories: Category[] }) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [hovered, setHovered] = useState(false)

  const scroll = (dir: 'left' | 'right') => {
    scrollRef.current?.scrollBy({ left: dir === 'left' ? -280 : 280, behavior: 'smooth' })
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center gap-2 mb-6">
        <Grid3X3 className="h-5 w-5 text-blue-400" />
        <h2 className="text-2xl font-bold text-foreground">Categories</h2>
      </div>

      <div
        className="relative"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Left fade + scroll arrow */}
        <div className="absolute left-0 top-0 bottom-3 w-16 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none rounded-l-xl" />
        <button
          onClick={() => scroll('left')}
          className={`absolute left-1 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center h-8 w-8 rounded-full bg-card border border-border shadow-md text-muted-foreground hover:text-foreground transition-all duration-200 ${hovered ? 'opacity-100' : 'opacity-0'}`}
          aria-label="Scroll left"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {/* Scrollable pills */}
        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto pb-3 scrollbar-hide px-2"
        >
          {categories.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="flex-shrink-0"
            >
              <Link
                href={`/category/${cat.slug}`}
                className="flex items-center gap-2 px-4 py-3 min-w-fit rounded-xl border border-border bg-card hover:bg-blue-500/10 hover:border-blue-500/50 dark:hover:bg-blue-500/10 dark:hover:border-blue-500/50 transition-all group shadow-sm hover:shadow-[0_0_12px_rgba(59,130,246,0.2)]"
              >
                <span className="text-xl">{cat.icon}</span>
                <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground whitespace-nowrap transition-colors">
                  {cat.name}
                </span>
                {cat._count && (
                  <span className="text-xs text-muted-foreground/60 group-hover:text-muted-foreground transition-colors">
                    ({cat._count.apps})
                  </span>
                )}
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Right fade + scroll arrow */}
        <div className="absolute right-0 top-0 bottom-3 w-16 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none rounded-r-xl" />
        <button
          onClick={() => scroll('right')}
          className={`absolute right-1 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center h-8 w-8 rounded-full bg-card border border-border shadow-md text-muted-foreground hover:text-foreground transition-all duration-200 ${hovered ? 'opacity-100' : 'opacity-0'}`}
          aria-label="Scroll right"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </motion.section>
  )
}
