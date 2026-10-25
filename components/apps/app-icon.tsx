import Image from 'next/image'
import { cn } from '@/lib/utils'
import { iconSrc } from '@/lib/design'

interface AppIconProps {
  app: { icon: string; name: string }
  size?: number
  className?: string
}

/* Home-screen style icon: continuous-corner squircle with a hairline edge. */
export function AppIcon({ app, size = 64, className }: AppIconProps) {
  // Two buckets only, so each icon is fetched at most twice across the page
  const fetchSize = size <= 72 ? 160 : 512
  return (
    <div
      className={cn('squircle relative shrink-0 overflow-hidden bg-sunken', className)}
      style={{ width: size, height: size }}
    >
      <Image src={iconSrc(app.icon, fetchSize)} alt={`${app.name} icon`} fill sizes={`${size}px`} className="object-cover" unoptimized />
    </div>
  )
}
