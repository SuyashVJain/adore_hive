import { Link } from 'react-router-dom'
import { formatINR } from '@/lib/format'
import { useBag, useBagSummary } from '@/store/bag'
import { useUI } from '@/store/ui'
import { Button } from '../ui/Button'
import { Drawer } from '../ui/Drawer'
import { QuantityStepper } from '../ui/QuantityStepper'

export function BagDrawer() {
  const isOpen = useUI((s) => s.panel === 'bag')
  const close = useUI((s) => s.close)
  const setQty = useBag((s) => s.setQty)
  const remove = useBag((s) => s.remove)
  const { lines, count, subtotal } = useBagSummary()

  return (
    <Drawer open={isOpen} onClose={close} label="Your bag">
      <div className="px-5 pt-3 sm:px-7">
        <h2 className="text-[2.5rem] leading-tight">Your bag of lovely things.</h2>
        <p className="mt-3 text-sm text-muted">
          {count} little {count === 1 ? 'treasure' : 'treasures'}
          {count > 0 && <> · <Link to="/bag" onClick={close} className="underline underline-offset-4 hover:text-ink">Edit your bag</Link></>}
        </p>
      </div>

      {lines.length === 0 ? (
        <div className="flex flex-1 flex-col items-start gap-4 px-5 pt-8 sm:px-7">
          <p className="text-muted">Your bag is empty. Find a little something to adore.</p>
          <Button to="/shop" onClick={close}>Shop all</Button>
        </div>
      ) : (
        <>
          <ul className="mt-5 flex-1 divide-y divide-line overflow-y-auto border-t border-line px-5 sm:px-7">
            {lines.map((l) => (
              <li key={l.key} className="flex gap-4 py-5">
                <img src={l.product.image} alt="" className="h-[106px] w-20 shrink-0 rounded-md object-cover" />
                <div className="flex min-w-0 flex-1 flex-col">
                  <Link to={`/product/${l.product.id}`} onClick={close} className="font-product text-lg leading-snug hover:underline underline-offset-4">{l.product.name}</Link>
                  <p className="mt-1 text-sm text-muted">{[l.product.subtitle, l.variant].filter(Boolean).join(' · ')}</p>
                  <p className="mt-1 text-base font-medium">{formatINR(l.product.price * l.qty)}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <QuantityStepper value={l.qty} onChange={(n) => setQty(l.key, n)} label={`${l.product.name} quantity`} />
                    <button type="button" onClick={() => remove(l.key)} aria-label={`Remove ${l.product.name}`} className="inline-flex min-h-11 items-center px-2 text-sm text-muted underline underline-offset-4 hover:text-ink">
                      Remove
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <div className="border-t border-line bg-page px-5 pb-6 pt-5 sm:px-7">
            <div className="flex items-baseline justify-between">
              <span className="eyebrow !text-ink">Subtotal · INR</span>
              <span className="text-2xl font-medium">{formatINR(subtotal)}</span>
            </div>
            <p className="mt-2 text-sm text-muted">Shipping, taxes and personalization to be confirmed.</p>
            <Button to="/checkout" onClick={close} full className="mt-4">Checkout</Button>
            <Button to="/bag" onClick={close} variant="outline" full className="mt-3">View bag</Button>
          </div>
        </>
      )}
    </Drawer>
  )
}
