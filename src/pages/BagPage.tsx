import { useLocation } from 'react-router-dom'
import { BagLineItem } from '@/components/bag/BagLineItem'
import { OrderSummary, ShippingHint } from '@/components/bag/OrderSummary'
import { Breadcrumbs, Button, Field, ProductCard, SectionHeading } from '@/components/ui'
import { products } from '@/data/products'
import { formatINR } from '@/lib/format'
import { useSeo } from '@/lib/useDocumentTitle'
import { useBag, useBagSummary } from '@/store/bag'

export function BagPage() {
  useSeo('Your bag', 'Review the lovely things in your bag.', { noindex: true })
  const { lines, count, ...totals } = useBagSummary()
  const message = (useLocation().state as { message?: string } | null)?.message
  const note = useBag((s) => s.note)
  const setNote = useBag((s) => s.setNote)
  const inBag = new Set(lines.map((l) => l.productId))
  // never suggest something already in the bag, or something sold out
  const extras = products.filter((p) => !inBag.has(p.id) && p.stock !== 'out').slice(0, 4)
  const gifted = lines.find((l) => l.gift)

  return (
    <div className="container-page pb-24 pt-5 md:pb-16 md:pt-6">
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Your bag' }]} />
      <div className="py-8 md:py-12">
        <SectionHeading as="h1" align="center" eyebrow="Chosen with a little love" title="Your bag of lovely things." subtitle="A few favourites for you. A little something for someone special." />
      </div>

      {message && lines.length === 0 && <p role="status" className="mb-6 rounded-lg bg-blush p-4 text-center text-sm">{message}</p>}

      {lines.length === 0 ? (
        <div className="rounded-lg bg-surface px-6 py-14 text-center">
          <p className="font-display text-3xl">Your bag is empty.</p>
          <p className="mt-2 text-muted">Find a little something to adore.</p>
          <Button to="/shop" className="mt-6">Shop all</Button>
        </div>
      ) : (
        <div className="grid gap-10 lg:grid-cols-[1fr_380px] lg:gap-12">
          <div>
            <p className="eyebrow !text-ink mb-2">{count} little {count === 1 ? 'treasure' : 'treasures'}</p>
            <ul className="divide-y divide-line border-y border-line">
              {lines.map((l) => <BagLineItem key={l.key} line={l} />)}
            </ul>
            <div className="mt-6">
              <Field multiline label="A note for your order (optional)" name="order-note" maxLength={300} value={note} onChange={(e) => setNote(e.target.value)} />
            </div>
            <Button to="/shop" variant="outline" className="mt-6">Continue shopping</Button>
          </div>

          <aside className="space-y-5 lg:sticky lg:top-36 lg:self-start" aria-label="Order summary">
            <div className="rounded-lg bg-surface p-6">
              <h2 className="font-display text-3xl">Your little lovely things</h2>
              <div className="mt-5 space-y-5">
                <ShippingHint totals={totals} />
                <OrderSummary totals={totals} />
                <p className="text-xs text-muted">Final amount is confirmed at checkout.</p>
                <Button to="/checkout" full className="max-md:hidden">Proceed to checkout</Button>
              </div>
            </div>
            {gifted && (
              <div className="rounded-lg bg-blush p-6">
                <h2 className="font-display text-3xl">Sending a little love?</h2>
                <p className="mt-2 text-sm text-muted">Your gift wrap and note are included with your gifted items.</p>
                <Button to={gifted.product.href} variant="outline" full className="mt-4">Edit your personal touches</Button>
              </div>
            )}
          </aside>
        </div>
      )}

      {extras.length > 0 && (
        <section aria-labelledby="extra-h" className="mt-14 md:mt-20">
          <h2 id="extra-h" className="text-[2rem] md:text-5xl">A little extra lovely.</h2>
          <ul className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5 lg:grid-cols-4">
            {extras.map((p, i) => <li key={p.id} className={i === 3 ? 'md:max-lg:hidden' : ''}><ProductCard product={p} /></li>)}
          </ul>
        </section>
      )}

      {lines.length > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-30 flex items-center gap-4 border-t border-line bg-page px-5 py-3 md:hidden">
          <div className="min-w-0 flex-1">
            <p className="text-xs text-muted">Total</p>
            <p className="text-xl font-medium">{formatINR(totals.total)}</p>
          </div>
          <Button to="/checkout" className="shrink-0">Proceed to checkout</Button>
        </div>
      )}
    </div>
  )
}
