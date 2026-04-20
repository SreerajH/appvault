import { Badge } from '@/components/ui/badge'
import { formatPrice } from '@/lib/utils'

interface PriceBadgeProps {
  price: number | string
  className?: string
}

export function PriceBadge({ price, className }: PriceBadgeProps) {
  const num = typeof price === 'string' ? parseFloat(price) : price
  return (
    <Badge variant={num === 0 ? 'free' : 'paid'} className={className}>
      {formatPrice(num)}
    </Badge>
  )
}
