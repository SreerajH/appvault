'use client'
import { useState, useEffect, useTransition } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { SlidersHorizontal, X } from 'lucide-react'
import { AppGrid } from '@/components/apps/app-grid'
import { Sidebar } from '@/components/layout/sidebar'
import { CategoryChips, SortTabs } from '@/components/layout/filter-bar'
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
  const [isPending] = useTransition()
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

  const activeCategory = categories.find(c => c.slug === searchParams.category)
  const filterCount = (searchParams.price && searchParams.price !== 'all' ? 1 : 0) + (searchParams.minRating ? 1 : 0)

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      {/* Masthead */}
      <div className="flex flex-col gap-6 border-b border-ink pb-8 md:flex-row md:items-end md:justify-between">
        <div className="min-w-0">
          <p className="font-mono text-xs uppercase tracking-[0.16em] text-ink-3">
            {searchParams.search ? 'Search results' : activeCategory ? 'Explore · Category' : 'Explore'}
          </p>
          <h1 className="mt-2 truncate font-display text-[44px] font-black leading-[0.95] tracking-[-0.04em] text-ink sm:text-[64px]">
            {searchParams.search ? <>&ldquo;{searchParams.search}&rdquo;</> : activeCategory ? activeCategory.name : 'All apps'}
          </h1>
          <p className="mt-3 text-sm text-ink-2">
            <span className="font-mono font-semibold tabular-nums text-ink">{total}</span> {total === 1 ? 'app' : 'apps'}
            {searchParams.search && (
              <> · <Link href="/explore" className="font-semibold text-signal-ink hover:text-ink">Clear search</Link></>
            )}
          </p>
        </div>
        <SearchBar
          key={searchParams.search ?? ''}
          initialQuery={searchParams.search}
          placeholder="Search apps, games, developers"
          size="lg"
          className="w-full md:w-[400px]"
        />
      </div>

      {/* Category rail + sort */}
      <div className="mt-6 space-y-4">
        <CategoryChips categories={categories} selected={searchParams.category} />
        <div className="flex items-center justify-between gap-3">
          <div className="-mx-1 overflow-x-auto px-1 scrollbar-hide">
            <SortTabs selected={searchParams.sort ?? 'popular'} />
          </div>
          <Button
            variant="outline"
            size="sm"
            className="shrink-0 lg:hidden"
            onClick={() => setSidebarOpen(o => !o)}
            aria-expanded={sidebarOpen}
          >
            {sidebarOpen ? <X className="h-3.5 w-3.5" /> : <SlidersHorizontal className="h-3.5 w-3.5" />}
            Filters{filterCount > 0 && ` · ${filterCount}`}
          </Button>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-8 lg:flex-row lg:gap-10">
        <div className={`${sidebarOpen ? 'block' : 'hidden'} rounded-2xl bg-sunken/60 p-4 lg:block lg:rounded-none lg:bg-transparent lg:p-0`}>
          <Sidebar
            categories={categories}
            selectedCategory={searchParams.category}
            selectedPrice={searchParams.price}
            selectedRating={searchParams.minRating ? parseFloat(searchParams.minRating) : undefined}
            selectedSort={searchParams.sort}
            groups={['price', 'rating']}
          />
        </div>

        <div className="min-w-0 flex-1">
          <AppGrid apps={apps} loading={isPending} />

          {page < totalPages && (
            <div className="mt-10 flex flex-col items-center gap-2">
              <Button variant="outline" onClick={loadMore} disabled={loading} className="min-w-40">
                {loading ? 'Loading…' : 'Show more apps'}
              </Button>
              <p className="font-mono text-[11px] text-ink-3">Showing {apps.length} of {total}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
