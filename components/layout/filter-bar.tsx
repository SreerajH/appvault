'use client'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { categoryStyle } from '@/lib/design'
import { sortOptions, useParamUpdater } from '@/components/layout/sidebar'
import type { Category } from '@/types'

/* Horizontal category chips (Play Store pattern). `route` mode links to /category/*; `param` mode sets ?category=. */
export function CategoryChips({
  categories,
  selected,
  mode = 'param',
}: {
  categories: Category[]
  selected?: string
  mode?: 'param' | 'route'
}) {
  const updateParam = useParamUpdater()
  const chip = (active: boolean) =>
    cn(
      'inline-flex h-9 shrink-0 items-center gap-2 rounded-full px-4 text-sm font-medium transition-colors',
      active ? 'bg-ink text-paper' : 'bg-surface text-ink-2 ring-1 ring-line hover:text-ink hover:ring-ink/25'
    )

  return (
    <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 scrollbar-hide sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0">
      {mode === 'route' ? (
        <Link href="/explore" className={chip(false)}>All apps</Link>
      ) : (
        <button onClick={() => updateParam('category', null)} className={chip(!selected)}>All</button>
      )}
      {categories.map(cat => {
        const { Icon } = categoryStyle(cat.slug)
        const active = selected === cat.slug
        return mode === 'route' ? (
          <Link key={cat.id} href={`/category/${cat.slug}`} className={chip(active)}>
            <Icon className="h-4 w-4" strokeWidth={1.75} /> {cat.name}
          </Link>
        ) : (
          <button key={cat.id} onClick={() => updateParam('category', cat.slug)} className={chip(active)} aria-pressed={active}>
            <Icon className="h-4 w-4" strokeWidth={1.75} /> {cat.name}
          </button>
        )
      })}
    </div>
  )
}

export function SortTabs({ selected = 'popular' }: { selected?: string }) {
  const updateParam = useParamUpdater()
  return (
    <div className="inline-flex rounded-full bg-sunken p-1" role="radiogroup" aria-label="Sort">
      {sortOptions.map(opt => (
        <button
          key={opt.value}
          role="radio"
          aria-checked={selected === opt.value}
          onClick={() => updateParam('sort', opt.value)}
          className={cn(
            'rounded-full px-3 py-1.5 text-[13px] font-semibold transition-colors sm:px-3.5',
            selected === opt.value ? 'bg-surface text-ink shadow-sm' : 'text-ink-2 hover:text-ink'
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}
