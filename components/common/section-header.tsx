import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SectionHeaderProps {
  title: string
  sub?: string
  href?: string
  hrefLabel?: string
  action?: React.ReactNode
  tone?: 'light' | 'dark'
  className?: string
}

/* Editorial section opener: a full-width ink rule, title left, "See all" right. */
export function SectionHeader({ title, sub, href, hrefLabel = 'See all', action, tone = 'light', className }: SectionHeaderProps) {
  const dark = tone === 'dark'
  return (
    <div className={cn('mb-6 flex items-end justify-between gap-4 border-t pt-4', dark ? 'border-paper/70' : 'border-ink', className)}>
      <div className="min-w-0">
        <h2 className={cn('font-display text-[26px] sm:text-[30px] font-extrabold leading-none tracking-[-0.02em]', dark ? 'text-paper' : 'text-ink')}>
          {title}
        </h2>
        {sub && <p className={cn('mt-2 text-sm', dark ? 'text-paper/60' : 'text-ink-2')}>{sub}</p>}
      </div>
      <div className="flex shrink-0 items-center gap-2">
        {action}
        {href && (
          <Link
            href={href}
            className={cn(
              'group inline-flex items-center gap-0.5 text-sm font-semibold transition-colors',
              dark ? 'text-paper/80 hover:text-paper' : 'text-signal-ink hover:text-ink'
            )}
          >
            {hrefLabel}
            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        )}
      </div>
    </div>
  )
}
