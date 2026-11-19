import { Link } from 'react-router-dom'
import { ArrowRight, Heart, Info } from 'lucide-react'
import { getProduct, categoryLabel, type Product } from '@/data/products'
import { formatINR } from '@/lib/format'
import { useUI } from '@/store/ui'
import { useWishlist } from '@/store/wishlist'
import { OptionPicker } from '../product/OptionPicker'
import { StockStatus } from '../product/StockStatus'
import { useConfigurator } from '../product/useConfigurator'
import { Button } from '../ui/Button'
import { Modal } from '../ui/Modal'
import { QuantityStepper } from '../ui/QuantityStepper'

function Body({ product }: { product: Product }) {
  const close = useUI((s) => s.close)
  const c = useConfigurator(product)
  const wished = useWishlist((s) => s.ids.includes(product.id))
  const toggle = useWishlist((s) => s.toggle)
  const total = formatINR(product.price * c.qty)

  return (
    <div className="grid gap-6 md:grid-cols-2 md:gap-8">
      <img src={product.gallery[0]} alt={product.name} width={474} height={570} className="aspect-[474/570] w-full rounded-lg object-cover" />
      <div>
        <p className="eyebrow !text-ink">{categoryLabel(product.category)} / {product.badge}</p>
        <h2 className="mt-2 text-4xl leading-tight md:text-[2.75rem]">{product.name}</h2>
        <p className="mt-3 text-muted">{product.description}</p>
        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-1">
          <p className="text-2xl font-medium">{formatINR(product.price)}</p>
          <StockStatus product={product} />
        </div>
        {product.options.length > 0 && (
          <div className="mt-5">
            <OptionPicker product={product} selected={c.selected} onSelect={c.select} idPrefix="qv" />
            {c.message && <p role="status" id="qv-message" className="mt-3 flex items-start gap-2 text-sm text-muted"><Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" /> {c.message}</p>}
          </div>
        )}
        <div className="mt-5 flex items-center justify-between gap-3">
          <QuantityStepper value={c.qty} onChange={c.setQty} />
          <button type="button" aria-pressed={wished} onClick={() => toggle(product.id)} className={`inline-flex min-h-11 items-center gap-2 rounded-md px-4 text-sm transition-colors ${wished ? 'bg-blush' : 'border border-line-strong hover:bg-blush/60'}`}>
            <Heart className={`h-4 w-4 ${wished ? 'fill-ink' : ''}`} aria-hidden="true" />
            {wished ? 'Saved to wishlist' : 'Save to wishlist'}
          </button>
        </div>
        <Button full disabled={!c.canAdd} aria-describedby={c.message ? 'qv-message' : undefined} className="mt-4" onClick={() => c.add() && close()}>
          {c.soldOut ? 'Out of stock' : `Add to bag · ${total}`}
        </Button>
        <Link to={`/product/${product.id}`} onClick={close} className="mt-4 inline-flex min-h-11 items-center gap-1.5 text-sm underline-offset-4 hover:underline">
          View full product details <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </div>
  )
}

/** Desktop quick view. Opened from the product card; focus returns to it on close. */
export function QuickView() {
  const open = useUI((s) => s.panel === 'quickview')
  const id = useUI((s) => s.quickId)
  const close = useUI((s) => s.close)
  const product = id ? getProduct(id) : undefined
  return (
    <Modal open={open && !!product} onClose={close} label={product ? `Quick view: ${product.name}` : 'Quick view'} className="hidden sm:!mt-10 lg:block">
      {product && <Body key={product.id} product={product} />}
    </Modal>
  )
}
