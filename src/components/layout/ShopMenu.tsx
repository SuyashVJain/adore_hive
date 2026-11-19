import { useEffect, useRef, type KeyboardEvent } from 'react'
import { AnimatePresence, m } from 'framer-motion'
import { Link } from 'react-router-dom'
import { images } from '@/data/images'
import { shopMenu } from '@/data/nav'
import { overlayFade } from '@/lib/motion'
import { useUI } from '@/store/ui'
import { Button } from '../ui/Button'
import { Overlay } from '../ui/Overlay'

interface Props {
  top: number
  onClose: () => void
  onEnter: () => void
  onLeave: () => void
  /** Tab past either end of the panel */
  onTabOut: (dir: 'next' | 'prev') => void
}

/** Desktop mega-dropdown, opened by hover, focus or click. Dims the page but lets the pointer through. */
export function ShopMenu({ top, onClose, onEnter, onLeave, onTabOut }: Props) {
  const open = useUI((s) => s.panel === 'shop')
  const panel = useRef<HTMLDivElement>(null)

  // Touch/click outside closes it (the dim layer doesn't catch clicks)
  useEffect(() => {
    if (!open) return
    const down = (e: PointerEvent) => {
      const t = e.target as Element
      if (!panel.current?.contains(t) && !t.closest('[data-shop-trigger]')) onClose()
    }
    document.addEventListener('pointerdown', down)
    return () => document.removeEventListener('pointerdown', down)
  }, [open, onClose])

  const onKey = (e: KeyboardEvent) => {
    if (e.key !== 'Tab') return
    const links = panel.current!.querySelectorAll<HTMLElement>('a[href]')
    if (e.shiftKey && document.activeElement === links[0]) { e.preventDefault(); onTabOut('prev') }
    else if (!e.shiftKey && document.activeElement === links[links.length - 1]) { e.preventDefault(); onTabOut('next') }
  }

  return (
    <AnimatePresence>
      {open && (
    <Overlay key="shop" onClose={onClose} trap={false} autoFocus={false} passThrough>
      <m.div
        {...overlayFade}
        ref={panel}
        id="shop-menu"
        role="dialog"
        aria-label="Shop"
        style={{ top }}
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
        onFocus={onEnter}
        onKeyDown={onKey}
        className="pointer-events-auto absolute left-1/2 hidden w-[calc(100%-4rem)] max-w-[1280px] -translate-x-1/2 rounded-b-xl bg-panel p-9 pt-8 lg:block"
      >
        <div className="mb-7 flex items-center justify-between">
          <p className="eyebrow !text-ink">Find your little lovely</p>
          <Link to="/shop" className="inline-flex min-h-11 items-center font-label text-xs font-semibold uppercase tracking-[0.14em] hover:underline underline-offset-4">
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
            <img src={images.lifestyle.hamper} alt="" width={560} height={460} className="aspect-[3/2] w-full rounded-md object-cover" />
            <p className="mt-3 font-display text-3xl leading-tight">Made for their kind of lovely.</p>
            <Button to="/hamper-studio" className="mt-4">Build a hamper</Button>
          </div>
        </div>
      </m.div>
    </Overlay>
      )}
    </AnimatePresence>
  )
}
