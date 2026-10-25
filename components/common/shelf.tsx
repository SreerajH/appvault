'use client'
import { useCallback, useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { SectionHeader } from '@/components/common/section-header'
import { cn } from '@/lib/utils'

interface ShelfProps {
  title: string
  sub?: string
  href?: string
  tone?: 'light' | 'dark'
  trackClassName?: string
  children: React.ReactNode
}

/* Horizontal shelf with paging arrows in the header, as on store front pages. */
export function Shelf({ title, sub, href, tone = 'light', trackClassName, children }: ShelfProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [atStart, setAtStart] = useState(true)
  const [atEnd, setAtEnd] = useState(false)

  const update = useCallback(() => {
    const el = ref.current
    if (!el) return
    setAtStart(el.scrollLeft <= 4)
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 4)
  }, [])

  useEffect(() => {
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [update])

  const page = (dir: 1 | -1) => {
    const el = ref.current
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: 'smooth' })
  }

  const dark = tone === 'dark'
  const arrow = cn(
    'flex h-9 w-9 items-center justify-center rounded-full border transition-colors disabled:opacity-30 disabled:pointer-events-none',
    dark ? 'border-paper/25 text-paper hover:bg-paper/10' : 'border-ink/15 text-ink hover:bg-sunken'
  )

  return (
    <section>
      <SectionHeader
        title={title}
        sub={sub}
        href={href}
        tone={tone}
        action={
          <div className="mr-2 hidden items-center gap-1.5 sm:flex">
            <button type="button" className={arrow} onClick={() => page(-1)} disabled={atStart} aria-label="Scroll back">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button type="button" className={arrow} onClick={() => page(1)} disabled={atEnd} aria-label="Scroll forward">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        }
      />
      <div
        ref={ref}
        onScroll={update}
        className={cn(
          '-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-4 px-4 pb-2 scrollbar-hide sm:-mx-6 sm:scroll-px-6 sm:px-6 lg:mx-0 lg:scroll-px-0 lg:px-0',
          trackClassName
        )}
      >
        {children}
      </div>
    </section>
  )
}
