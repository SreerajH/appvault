'use client'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { Star, DollarSign, Tag, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import type { Category } from '@/types'

interface SidebarProps {
  categories: Category[]
  selectedCategory?: string
  selectedPrice?: string
  selectedRating?: number
  selectedSort?: string
}

const sortOptions = [
  { value: 'popular', label: 'Most Popular' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'newest', label: 'Newest First' },
  { value: 'name', label: 'Name A-Z' },
]

const priceOptions = [
  { value: 'all', label: 'All Apps' },
  { value: 'free', label: 'Free Only' },
  { value: 'paid', label: 'Paid Only' },
]

export function Sidebar({ categories, selectedCategory, selectedPrice = 'all', selectedRating, selectedSort = 'popular' }: SidebarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const updateParam = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value === null || value === '') {
      params.delete(key)
    } else {
      params.set(key, value)
    }
    params.delete('page')
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <aside className="w-full lg:w-64 flex-shrink-0">
      <div className="sticky top-24 space-y-6">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-4 w-4 text-blue-400" />
            <h2 className="font-semibold text-white">Filters</h2>
          </div>

          {/* Sort */}
          <div className="mb-4">
            <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">Sort By</h3>
            <div className="space-y-1">
              {sortOptions.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => updateParam('sort', opt.value)}
                  className={cn(
                    'w-full text-left px-3 py-2 rounded-lg text-sm transition-colors',
                    selectedSort === opt.value ? 'bg-blue-500/20 text-blue-400' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <Separator className="my-4" />

          {/* Price */}
          <div className="mb-4">
            <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">Price</h3>
            <div className="space-y-1">
              {priceOptions.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => updateParam('price', opt.value)}
                  className={cn(
                    'w-full text-left px-3 py-2 rounded-lg text-sm transition-colors',
                    selectedPrice === opt.value ? 'bg-blue-500/20 text-blue-400' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <Separator className="my-4" />

          {/* Rating */}
          <div className="mb-4">
            <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">Min Rating</h3>
            <div className="space-y-1">
              {[4, 3, 2, 0].map(rating => (
                <button
                  key={rating}
                  onClick={() => updateParam('minRating', rating > 0 ? rating.toString() : null)}
                  className={cn(
                    'w-full text-left flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors',
                    (selectedRating === rating || (!selectedRating && rating === 0)) ? 'bg-blue-500/20 text-blue-400' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  )}
                >
                  {rating > 0 ? (
                    <>
                      <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                      <span>{rating}+ stars</span>
                    </>
                  ) : 'Any Rating'}
                </button>
              ))}
            </div>
          </div>

          <Separator className="my-4" />

          {/* Categories */}
          <div>
            <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">Category</h3>
            <div className="space-y-1">
              <button
                onClick={() => updateParam('category', null)}
                className={cn(
                  'w-full text-left px-3 py-2 rounded-lg text-sm transition-colors',
                  !selectedCategory ? 'bg-blue-500/20 text-blue-400' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                )}
              >
                All Categories
              </button>
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => updateParam('category', cat.slug)}
                  className={cn(
                    'w-full text-left flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors',
                    selectedCategory === cat.slug ? 'bg-blue-500/20 text-blue-400' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  )}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.name}</span>
                  {cat._count && <span className="ml-auto text-xs text-slate-600">{cat._count.apps}</span>}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}
