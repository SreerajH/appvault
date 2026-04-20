'use client'
import { useState, useEffect, useCallback, useTransition } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { Search, SlidersHorizontal } from 'lucide-react'
import { AppGrid } from '@/components/apps/app-grid'
import { Sidebar } from '@/components/layout/sidebar'
import { Button } from '@/components/ui/button'
import { SearchBar } from '@/components/search/search-bar'
import type { App, Category } from '@/types'

interface ExploreClientProps {
  initialApps: App[]
  initialTotal: number
  initialPage: number
  initialTotalPages: number
  categories: Category[]
  searchParams: Record<string, string | undefined>
}

export function ExploreClient({
  initialApps,
  initialTotal,
  initialPage,
  initialTotalPages,
  categories,
  searchParams,
}: ExploreClientProps) {
  const [apps, setApps] = useState(initialApps)
  const [total, setTotal] = useState(initialTotal)
  const [page, setPage] = useState(initialPage)
  const [totalPages, setTotalPages] = useState(initialTotalPages)
  const [loading, setLoading] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const urlSearchParams = useSearchParams()

  useEffect(() => {
    setApps(initialApps)
    setTotal(initialTotal)
    setPage(initialPage)
    setTotalPages(initialTotalPages)
  }, [initialApps, initialTotal, initialPage, initialTotalPages])

  const loadMore = async () => {
    if (page >= totalPages) return
    setLoading(true)
    const params = new URLSearchParams(urlSearchParams.toString())
    params.set('page', (page + 1).toString())
    params.set('limit', '20')
    try {
      const res = await fetch(`/api/apps?${params.toString()}`)
      const data = await res.json()
      setApps(prev => [...prev, ...data.apps])
      setPage(data.page)
      setTotalPages(data.totalPages)
    } catch {}
    setLoading(false)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">
            {searchParams.search ? `Results for "${searchParams.search}"` : 'Explore Apps'}
          </h1>
          <p className="text-slate-400 text-sm mt-1">{total} apps found</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:block w-64">
            <SearchBar initialQuery={searchParams.search} placeholder="Search..." />
          </div>
          <Button
            variant="outline"
            size="sm"
            className="lg:hidden flex items-center gap-2"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </Button>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Sidebar — desktop always visible, mobile toggle */}
        <div className={`${sidebarOpen ? 'block' : 'hidden'} lg:block`}>
          <Sidebar
            categories={categories}
            selectedCategory={searchParams.category}
            selectedPrice={searchParams.price}
            selectedRating={searchParams.minRating ? parseFloat(searchParams.minRating) : undefined}
            selectedSort={searchParams.sort}
          />
        </div>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          <AppGrid apps={apps} loading={isPending} />

          {/* Load more */}
          {page < totalPages && (
            <div className="flex justify-center mt-8">
              <Button
                variant="outline"
                onClick={loadMore}
                disabled={loading}
                className="min-w-32"
              >
                {loading ? 'Loading...' : 'Load More'}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
