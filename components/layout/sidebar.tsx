'use client'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import Link from 'next/link'
import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'
import { categoryStyle } from '@/lib/design'
import type { Category } from '@/types'

type Group = 'sort' | 'price' | 'rating' | 'category'

interface SidebarProps {
  categories: Category[]
  selectedCategory?: string
  selectedPrice?: string
  selectedRating?: number
  selectedSort?: string
  /** Which filter groups to render. Defaults to all of them. */
  groups?: Group[]
}

export const sortOptions = [
  { value: 'popular', label: 'Popular' },
  { value: 'rating', label: 'Top rated' },
  { value: 'newest', label: 'Newest' },
  { value: 'name', label: 'A–Z' },
]

const priceOptions = [
  { value: 'all', label: 'Free & paid' },
  { value: 'free', label: 'Free only' },
  { value: 'paid', label: 'Paid only' },
]

/* Shared helper: merge one search param into the current URL. */
export function useParamUpdater() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  return (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value === null || value === '') params.delete(key)
    else params.set(key, value)
    params.delete('page')
    const qs = params.toString()
    router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
  }
}

function Option({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm transition-colors',
        active ? 'bg-surface font-semibold text-ink ring-1 ring-line' : 'text-ink-2 hover:bg-sunken hover:text-ink'
      )}
    >
      <span className={cn('flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border', active ? 'border-ink' : 'border-ink/25')}>
        {active && <span className="h-1.5 w-1.5 rounded-full bg-ink" />}
      </span>
      {children}
    </button>
  )
}

function GroupTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="mb-2 px-2.5 font-mono text-[10px] uppercase tracking-[0.16em] text-ink-3">{children}</h3>
}

export function Sidebar({
  categories,
  selectedCategory,
  selectedPrice = 'all',
  selectedRating,
  selectedSort = 'popular',
  groups = ['sort', 'price', 'rating', 'category'],
}: SidebarProps) {
  const updateParam = useParamUpdater()
  const pathname = usePathname()
  const onCategoryRoute = pathname.startsWith('/category/')

  return (
    <aside className="w-full flex-shrink-0 lg:w-56">
      <div className="space-y-7 lg:sticky lg:top-24">
        {groups.includes('sort') && (
          <div>
            <GroupTitle>Sort by</GroupTitle>
            <div className="space-y-0.5">
              {sortOptions.map(opt => (
                <Option key={opt.value} active={selectedSort === opt.value} onClick={() => updateParam('sort', opt.value)}>
                  {opt.label}
                </Option>
              ))}
            </div>
          </div>
        )}

        {groups.includes('price') && (
          <div>
            <GroupTitle>Price</GroupTitle>
            <div className="space-y-0.5">
              {priceOptions.map(opt => (
                <Option key={opt.value} active={selectedPrice === opt.value} onClick={() => updateParam('price', opt.value === 'all' ? null : opt.value)}>
                  {opt.label}
                </Option>
              ))}
            </div>
          </div>
        )}

        {groups.includes('rating') && (
          <div>
            <GroupTitle>Rating</GroupTitle>
            <div className="space-y-0.5">
              {[4.5, 4, 3, 0].map(rating => (
                <Option
                  key={rating}
                  active={selectedRating === rating || (!selectedRating && rating === 0)}
                  onClick={() => updateParam('minRating', rating > 0 ? rating.toString() : null)}
                >
                  {rating > 0 ? (
                    <span className="inline-flex items-center gap-1">
                      <Star className="h-3 w-3 fill-ink text-ink" /> {rating} &amp; up
                    </span>
                  ) : 'Any rating'}
                </Option>
              ))}
            </div>
          </div>
        )}

        {groups.includes('category') && (
          <div>
            <GroupTitle>Category</GroupTitle>
            <div className="space-y-0.5">
              {!onCategoryRoute && (
                <Option active={!selectedCategory} onClick={() => updateParam('category', null)}>All categories</Option>
              )}
              {categories.map(cat => {
                const { Icon } = categoryStyle(cat.slug)
                const active = selectedCategory === cat.slug
                const body = (
                  <>
                    <Icon className="h-4 w-4 shrink-0" strokeWidth={1.75} />
                    <span className="flex-1 truncate">{cat.name}</span>
                    {cat._count && <span className="font-mono text-[11px] text-ink-3">{cat._count.apps}</span>}
                  </>
                )
                const cls = cn(
                  'flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm transition-colors',
                  active ? 'bg-surface font-semibold text-ink ring-1 ring-line' : 'text-ink-2 hover:bg-sunken hover:text-ink'
                )
                // On /category/* pages, switching category means switching route
                return onCategoryRoute ? (
                  <Link key={cat.id} href={`/category/${cat.slug}`} className={cls}>{body}</Link>
                ) : (
                  <button key={cat.id} onClick={() => updateParam('category', cat.slug)} className={cls} aria-pressed={active}>{body}</button>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </aside>
  )
}
