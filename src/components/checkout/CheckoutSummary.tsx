import { giftWrapById } from '@/config/shop'
import { formatINR } from '@/lib/format'
import { lineTotal, optionsLabel } from '@/lib/bag'
import type { ResolvedLine } from '@/store/bag'
import type { computeTotals } from '@/lib/bag'
import { OrderSummary } from '../bag/OrderSummary'

export function CheckoutSummary({ lines, totals }: { lines: ResolvedLine[]; totals: ReturnType<typeof computeTotals> }) {
  return (
    <div>
      <ul className="divide-y divide-line">
        {lines.map((l) => {
          const wrap = l.gift ? giftWrapById(l.gift.wrap) : undefined
          const detail = optionsLabel(l.options)
          return (
            <li key={l.key} className="flex gap-3 py-4 first:pt-0">
              <img src={l.product.image} alt="" width={64} height={80} loading="lazy" className="h-20 w-16 shrink-0 rounded-md object-cover" />
              <div className="min-w-0 flex-1">
                <p className="font-product text-base leading-snug">{l.product.name}</p>
                <p className="mt-0.5 text-sm text-muted">Quantity {l.qty}{detail ? ` · ${detail}` : ''}</p>
                {wrap && <p className="text-sm text-muted">Gift: {wrap.label}</p>}
              </div>
              <p className="shrink-0 text-sm font-medium">{formatINR(lineTotal(l))}</p>
            </li>
          )
        })}
      </ul>
      <div className="mt-4 border-t border-line pt-4"><OrderSummary totals={totals} /></div>
    </div>
  )
}
