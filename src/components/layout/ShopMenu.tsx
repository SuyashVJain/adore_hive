import { Link } from 'react-router-dom'
import { images } from '@/data/images'
import { shopMenu } from '@/data/nav'
import { useUI } from '@/store/ui'
import { Button } from '../ui/Button'
import { Overlay } from '../ui/Overlay'

/** Desktop mega-dropdown. Rendered in a portal under the dimmed header. */
export function ShopMenu({ top }: { top: number }) {
  const open = useUI((s) => s.panel === 'shop')
  const close = useUI((s) => s.close)
  if (!open) return null
  return (
    <Overlay onClose={close}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Shop"
        style={{ top }}
        className="absolute left-1/2 hidden w-[calc(100%-4rem)] max-w-[1280px] -translate-x-1/2 animate-rise rounded-b-xl bg-panel p-9 pt-8 lg:block"
      >
        <div className="mb-7 flex items-center justify-between">
          <p className="eyebrow !text-ink">Find your little lovely</p>
          <Link to="/shop" data-autofocus className="inline-flex min-h-11 items-center font-label text-xs font-semibold uppercase tracking-[0.14em] hover:underline underline-offset-4">
            Shop all
          </Link>
        </div>
        <div className="grid grid-cols-[repeat(4,1fr)_minmax(220px,1fr)] gap-8">
          {shopMenu.map((c) => (
            <div key={c.to}>
              <h2 className="border-b border-line pb-3 font-product text-xl">
                <Link to={c.to} className="hover:underline underline-offset-4">{c.label}</Link>
              </h2>
              <ul className="mt-3">
                {c.items.map((i) => (
                  <li key={i.to}>
                    <Link to={i.to} className="inline-flex min-h-11 items-center text-sm text-muted transition-colors hover:text-ink hover:underline underline-offset-4">
                      {i.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div>
            <img src={images.lifestyle.hamper} alt="" className="aspect-[3/2] w-full rounded-md object-cover" />
            <p className="mt-3 font-display text-3xl leading-tight">Made for their kind of lovely.</p>
            <Button to="/hamper-studio" className="mt-4">Build a hamper</Button>
          </div>
        </div>
      </div>
    </Overlay>
  )
}
