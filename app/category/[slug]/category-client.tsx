'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { AppGrid } from '@/components/apps/app-grid'
import { Sidebar } from '@/components/layout/sidebar'
import type { App, Category } from '@/types'

interface CategoryClientProps {
  category: Category
  apps: App[]
  allCategories: Category[]
  searchParams: Record<string, string | undefined>
}

export function CategoryClient({ category, apps, allCategories, searchParams }: CategoryClientProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <Link
          href="/explore"
          className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-white transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          All Categories
        </Link>
        <div className="flex items-center gap-4">
          <div className="text-5xl">{category.icon}</div>
          <div>
            <h1 className="text-3xl font-bold text-white">{category.name}</h1>
            <p className="text-slate-400 mt-1">
              {category._count?.apps ?? apps.length} apps in this category
            </p>
          </div>
        </div>
      </motion.div>

      <div className="flex gap-8">
        <Sidebar
          categories={allCategories}
          selectedCategory={category.slug}
          selectedPrice={searchParams.price}
          selectedRating={searchParams.minRating ? parseFloat(searchParams.minRating) : undefined}
          selectedSort={searchParams.sort}
        />
        <div className="flex-1 min-w-0">
          <AppGrid apps={apps} />
        </div>
      </div>
    </div>
  )
}
