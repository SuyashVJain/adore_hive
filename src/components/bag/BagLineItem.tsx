import { Link } from 'react-router-dom'
import { giftWrapById } from '@/config/shop'
import { formatINR } from '@/lib/format'
import { lineTotal, optionsLabel } from '@/lib/bag'
import { useBag, type ResolvedLine } from '@/store/bag'
import { QuantityStepper } from '../ui/QuantityStepper'

interface Props {
  line: ResolvedLine
  /** Drawer layout: smaller image, tighter spacing */
  compact?: boolean
  onNavigate?: () => void
}

/** One bag line. Used by both the drawer and the bag page so they never drift apart. */
export function BagLineItem({ line, compact, onNavigate }: Props) {
  const setQty = useBag((s) => s.setQty)
  const remove = useBag((s) => s.remove)
  const { product } = line
  const wrap = line.gift ? giftWrapById(line.gift.wrap) : undefined
  const detail = [product.subtitle, optionsLabel(line.options)].filter(Boolean).join(' · ')

  return (
    <li className={`flex gap-4 ${compact ? 'py-5' : 'py-6 md:gap-6'}`}>
      <img src={product.image} alt="" width={118} height={148} loading="lazy" className={`shrink-0 rounded-md object-cover ${compact ? 'h-[106px] w-20' : 'h-[118px] w-[94px] md:h-[148px] md:w-[118px]'}`} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Link to={product.href} onClick={onNavigate} className={`font-product leading-snug underline-offset-4 hover:underline ${compact ? 'text-lg' : 'text-xl'}`}>{product.name}</Link>
        <p className="mt-1 text-sm text-muted">{detail}</p>
        {line.custom && (
          <ul className="mt-1 space-y-0.5 text-sm text-muted">
            {line.custom.contents.map((c, i) => <li key={i}>{c}</li>)}
          </ul>
        )}
        {wrap && (
          <p className="mt-1 text-sm text-muted">
            Gift: {wrap.label}{line.gift?.note ? <> · Note: “{line.gift.note}”</> : null}
          </p>
        )}
        <p className="mt-1 text-base font-medium">{formatINR(lineTotal(line))}</p>
        <div className="mt-3 flex items-center justify-between gap-3">
          <QuantityStepper value={line.qty} onChange={(n) => setQty(line.key, n)} label={`${product.name} quantity`} />
          <button type="button" onClick={() => remove(line.key)} aria-label={`Remove ${product.name}`} className="inline-flex min-h-11 items-center px-2 text-sm text-muted underline underline-offset-4 hover:text-ink">
            Remove
          </button>
        </div>
      </div>
    </li>
  )
}
