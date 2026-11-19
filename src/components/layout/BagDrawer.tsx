import { GiftBoxArt } from '../art/Art'
import { Link } from 'react-router-dom'
import { useBagSummary } from '@/store/bag'
import { useUI } from '@/store/ui'
import { BagLineItem } from '../bag/BagLineItem'
import { OrderSummary, ShippingHint } from '../bag/OrderSummary'
import { Button } from '../ui/Button'
import { Drawer } from '../ui/Drawer'

export function BagDrawer() {
  const isOpen = useUI((s) => s.panel === 'bag')
  const close = useUI((s) => s.close)
  const { lines, count, ...totals } = useBagSummary()

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
        <div className="flex flex-1 flex-col items-center px-5 pt-8 text-center sm:px-7">
          <GiftBoxArt className="h-24 w-24" />
          <p className="mt-2 font-display text-3xl">Your bag is empty.</p>
          <p className="mt-2 text-muted">Find a little something to adore.</p>
          <Button to="/shop" onClick={close} className="mt-6">Shop all</Button>
        </div>
      ) : (
        <>
          <ul className="mt-5 flex-1 divide-y divide-line overflow-y-auto border-t border-line px-5 sm:px-7">
            {lines.map((l) => <BagLineItem key={l.key} line={l} compact onNavigate={close} />)}
          </ul>
          <div className="space-y-4 border-t border-line bg-page px-5 pb-6 pt-5 sm:px-7">
            <ShippingHint totals={totals} />
            <OrderSummary totals={totals} />
            <Button to="/checkout" onClick={close} full>Checkout</Button>
            <Button to="/bag" onClick={close} variant="outline" full>View bag</Button>
          </div>
        </>
      )}
    </Drawer>
  )
}
