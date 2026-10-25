import Link from 'next/link'
import { cn } from '@/lib/utils'

/* Four-tile mark: a home-screen grid with one tile "picked" in signal orange. */
export function LogoMark({ className, inverted = false }: { className?: string; inverted?: boolean }) {
  const base = inverted ? '#F3F0E8' : '#14120F'
  const tile = inverted ? '#14120F' : '#F3F0E8'
  return (
    <svg viewBox="0 0 32 32" className={cn('h-8 w-8', className)} aria-hidden="true">
      <rect width="32" height="32" rx="9" fill={base} />
      <rect x="8" y="8" width="7" height="7" rx="2" fill={tile} />
      <rect x="17" y="8" width="7" height="7" rx="3.5" fill="#F04A16" />
      <rect x="8" y="17" width="7" height="7" rx="2" fill={tile} />
      <rect x="17" y="17" width="7" height="7" rx="2" fill={tile} />
    </svg>
  )
}

export function Logo({ className, inverted = false }: { className?: string; inverted?: boolean }) {
  return (
    <Link href="/" className={cn('flex shrink-0 items-center gap-2.5', className)} aria-label="AppVault home">
      <LogoMark inverted={inverted} />
      <span className={cn('font-display text-[19px] font-extrabold tracking-[-0.03em]', inverted ? 'text-paper' : 'text-ink')}>
        AppVault
      </span>
    </Link>
  )
}
