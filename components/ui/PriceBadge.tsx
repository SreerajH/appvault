import { cn, formatPrice } from '@/lib/utils'

interface PriceBadgeProps {
  price: number | string
  className?: string
  tone?: 'light' | 'dark' | 'onColor'
}

/* App-store style "GET" / price pill. Rendered as a span so it can sit inside card links. */
export function PriceBadge({ price, className, tone = 'light' }: PriceBadgeProps) {
  const num = typeof price === 'string' ? parseFloat(price) : price
  return (
    <span
      className={cn(
        'inline-flex h-8 min-w-[64px] items-center justify-center rounded-full px-4 text-[13px] font-bold uppercase tracking-wide tabular-nums transition-colors',
        tone === 'light' && 'bg-sunken text-signal-ink group-hover:bg-ink group-hover:text-paper',
        tone === 'dark' && 'bg-white/10 text-paper group-hover:bg-paper group-hover:text-ink',
        tone === 'onColor' && 'bg-white/90 text-ink',
        className
      )}
    >
      {num === 0 ? 'Get' : formatPrice(num)}
    </span>
  )
}
