'use client'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { SectionHeader } from '@/components/common/section-header'
import { categoryStyle, pad2 } from '@/lib/design'
import type { Category } from '@/types'

export function CategoriesSection({ categories }: { categories: Category[] }) {
  return (
    <section id="categories">
      <SectionHeader title="Browse by category" href="/explore" hrefLabel="All apps" />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {categories.map(cat => {
          const { bg, fg, Icon } = categoryStyle(cat.slug)
          return (
            <Link
              key={cat.id}
              href={`/category/${cat.slug}`}
              className="group relative flex h-[128px] flex-col justify-between overflow-hidden rounded-2xl p-4 transition-transform duration-200 hover:-translate-y-0.5 sm:h-[148px] sm:p-5"
              style={{ background: bg, color: fg }}
            >
              <div className="flex items-start justify-between">
                <Icon className="h-6 w-6" strokeWidth={1.75} />
                {cat._count && (
                  <span className="font-mono text-[11px] uppercase tracking-[0.12em] opacity-70">
                    {pad2(cat._count.apps)} apps
                  </span>
                )}
              </div>
              <div className="flex items-end justify-between gap-2">
                <span className="font-display text-lg font-extrabold leading-tight tracking-[-0.02em] sm:text-xl">
                  {cat.name}
                </span>
                <ArrowUpRight className="h-5 w-5 shrink-0 -translate-x-1 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100" />
              </div>
              {/* Oversized icon watermark */}
              <Icon aria-hidden className="pointer-events-none absolute -bottom-6 -right-4 h-24 w-24 opacity-[0.07] transition-transform duration-300 group-hover:scale-110" strokeWidth={1.5} />
            </Link>
          )
        })}
      </div>
    </section>
  )
}
