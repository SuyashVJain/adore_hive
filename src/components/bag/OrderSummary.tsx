import { FREE_SHIPPING_OVER } from '@/config/shop'
import { formatINR } from '@/lib/format'
import type { computeTotals } from '@/lib/bag'

type Totals = ReturnType<typeof computeTotals>

export function ShippingHint({ totals }: { totals: Totals }) {
  const reached = totals.freeShippingGap === 0
  const pct = Math.min(100, Math.round((totals.subtotal / FREE_SHIPPING_OVER) * 100))
  return (
    <div>
      <p className="text-sm">{reached ? 'You’ve unlocked free shipping.' : <>Spend <strong className="font-medium">{formatINR(totals.freeShippingGap)}</strong> more for free shipping.</>}</p>
      <div role="progressbar" aria-label="Progress to free shipping" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct} className="mt-2 h-1.5 overflow-hidden rounded-full bg-line">
        <div className="h-full rounded-full bg-ink transition-[width]" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

/** Subtotal / gift wrap / shipping / total. Same maths everywhere via computeTotals. */
export function OrderSummary({ totals }: { totals: Totals }) {
  const row = 'flex items-baseline justify-between gap-4 text-sm'
  return (
    <dl className="space-y-3">
      <div className={row}><dt className="text-muted">Subtotal</dt><dd>{formatINR(totals.subtotal)}</dd></div>
      {totals.giftFees > 0 && <div className={row}><dt className="text-muted">Gift wrap</dt><dd>{formatINR(totals.giftFees)}</dd></div>}
      <div className={row}><dt className="text-muted">Shipping</dt><dd>{totals.shipping === 0 ? 'Free' : formatINR(totals.shipping)}</dd></div>
      <div className="flex items-baseline justify-between gap-4 border-t border-line pt-4">
        <dt className="eyebrow !text-ink">Total · INR</dt>
        <dd className="text-2xl font-medium">{formatINR(totals.total)}</dd>
      </div>
    </dl>
  )
}
