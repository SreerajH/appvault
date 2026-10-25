'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { SlidersHorizontal, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AppGrid } from '@/components/apps/app-grid'
import { AppIcon } from '@/components/apps/app-icon'
import { Sidebar } from '@/components/layout/sidebar'
import { CategoryChips } from '@/components/layout/filter-bar'
import { categoryStyle, pad2 } from '@/lib/design'
import type { App, Category } from '@/types'

interface CategoryClientProps {
  category: Category
  apps: App[]
  allCategories: Category[]
  searchParams: Record<string, string | undefined>
}

export function CategoryClient({ category, apps, allCategories, searchParams }: CategoryClientProps) {
  const { bg, fg, Icon } = categoryStyle(category.slug)
  const showcase = apps.slice(0, 4)
  const [filtersOpen, setFiltersOpen] = useState(false)

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      {/* Category banner */}
      <motion.header
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative overflow-hidden rounded-[28px] p-6 sm:p-10"
        style={{ background: bg, color: fg }}
      >
        <Icon aria-hidden className="pointer-events-none absolute -bottom-10 -right-6 h-56 w-56 opacity-[0.07]" strokeWidth={1.25} />
        <div className="relative flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.16em] opacity-75">
              <Icon className="h-4 w-4" strokeWidth={1.75} /> Category
            </div>
            <h1 className="mt-3 font-display text-[44px] font-black leading-[0.95] tracking-[-0.04em] sm:text-[64px]">
              {category.name}
            </h1>
            <p className="mt-3 text-sm font-medium opacity-80">
              <span className="font-mono">{pad2(category._count?.apps ?? apps.length)}</span> apps in this category
            </p>
          </div>
          {showcase.length > 0 && (
            <div className="flex -space-x-3 pl-1">
              {showcase.map((app, i) => (
                <div
                  key={app.id}
                  className="rounded-[22.5%]"
                  style={{ transform: `rotate(${(i - 1.5) * 5}deg)`, boxShadow: `0 0 0 4px ${bg}` }}
                >
                  <AppIcon app={app} size={64} />
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.header>

      <div className="mt-6">
        <CategoryChips categories={allCategories} selected={category.slug} mode="route" />
      </div>

      <div className="mt-4 flex justify-end lg:hidden">
        <Button variant="outline" size="sm" onClick={() => setFiltersOpen(o => !o)} aria-expanded={filtersOpen}>
          {filtersOpen ? <X className="h-3.5 w-3.5" /> : <SlidersHorizontal className="h-3.5 w-3.5" />}
          Sort &amp; filter
        </Button>
      </div>

      <div className="mt-6 flex flex-col gap-8 lg:mt-8 lg:flex-row lg:gap-10">
        <div className={`${filtersOpen ? 'block' : 'hidden'} rounded-2xl bg-sunken/60 p-4 lg:block lg:rounded-none lg:bg-transparent lg:p-0`}>
          <Sidebar
            categories={allCategories}
            selectedCategory={category.slug}
            selectedPrice={searchParams.price}
            selectedRating={searchParams.minRating ? parseFloat(searchParams.minRating) : undefined}
            selectedSort={searchParams.sort}
            groups={['sort', 'price', 'rating']}
          />
        </div>
        <div className="min-w-0 flex-1">
          <AppGrid apps={apps} />
        </div>
      </div>
    </div>
  )
}
