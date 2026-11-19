import { useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { ChevronDown, Heart, Menu, Search, ShoppingBag, User } from 'lucide-react'
import { mainNav } from '@/data/nav'
import { useBagSummary } from '@/store/bag'
import { useUI } from '@/store/ui'
import { useWishlist } from '@/store/wishlist'
import { Logo } from './Logo'
import { ShopMenu } from './ShopMenu'

const hoverCapable = () => window.matchMedia('(min-width: 1024px) and (hover: hover)').matches
const CLOSE_DELAY = 250

const iconBtn = 'relative grid h-11 w-11 place-items-center rounded-full transition-colors hover:bg-blush active:bg-[#f0cfcf]'

function Count({ n }: { n: number }) {
  if (!n) return null
  return (
    <span aria-hidden="true" className="absolute right-0 top-0 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-ink px-1 text-xs leading-none text-white">
      {n}
    </span>
  )
}

export function Header() {
  const ref = useRef<HTMLElement>(null)
  const [top, setTop] = useState(0)
  const { pathname } = useLocation()
  const { count } = useBagSummary()
  const wishCount = useWishlist((s) => s.ids.length)
  const panel = useUI((s) => s.panel)
  const open = useUI((s) => s.open)

  const close = useUI((s) => s.close)
  const trigger = useRef<HTMLButtonElement>(null)
  const timer = useRef<number>()
  const suppress = useRef(false) // stops focus-restore after Escape from reopening the menu

  const cancel = () => window.clearTimeout(timer.current)
  const openShop = () => {
    cancel()
    if (useUI.getState().panel === 'shop') return
    setTop(ref.current!.getBoundingClientRect().bottom)
    open('shop')
  }
  const closeShop = () => {
    cancel()
    suppress.current = true
    window.setTimeout(() => (suppress.current = false), 300)
    close()
  }
  const scheduleClose = () => {
    cancel()
    timer.current = window.setTimeout(() => useUI.getState().panel === 'shop' && closeShop(), CLOSE_DELAY)
  }
  const tabOut = (dir: 'next' | 'prev') => {
    if (dir === 'prev') return trigger.current?.focus()
    closeShop()
    setTimeout(() => (trigger.current?.nextElementSibling as HTMLElement | null)?.focus(), 0)
  }
  const navCls = (active: boolean) =>
    `inline-flex min-h-11 items-center px-3 text-sm underline-offset-[10px] transition-colors hover:underline decoration-1 ${active ? 'underline' : ''}`

  return (
    <header ref={ref} className="sticky top-0 z-30 border-b border-line bg-page">
      <div className="container-page grid h-[86px] grid-cols-[1fr_auto_1fr] items-center lg:h-[116px]">
        {/* Mobile + tablet: menu button. Desktop: logo */}
        <div className="flex items-center">
          <button type="button" aria-label="Open menu" aria-haspopup="dialog" onClick={() => open('menu')} className={`${iconBtn} -ml-2.5 lg:hidden`}>
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>
          <div className="hidden lg:block"><Logo /></div>
        </div>

        <div className="lg:hidden"><Logo className="h-14" /></div>
        <nav aria-label="Main" className="hidden items-center gap-1 lg:flex xl:gap-3">
          {mainNav.map((n) =>
            'mega' in n ? (
              <button
                key={n.label}
                type="button"
                aria-expanded={panel === 'shop'}
                aria-haspopup="true"
                aria-controls="shop-menu"
                ref={trigger}
                data-shop-trigger
                onClick={openShop}
                onMouseEnter={() => hoverCapable() && openShop()}
                onMouseLeave={() => panel === 'shop' && scheduleClose()}
                onFocus={(e) => !suppress.current && hoverCapable() && e.currentTarget.matches(':focus-visible') && openShop()}
                onBlur={() => panel === 'shop' && scheduleClose()}
                onKeyDown={(e) => {
                  if (e.key === 'Tab' && !e.shiftKey && panel === 'shop') {
                    e.preventDefault()
                    cancel()
                    document.querySelector<HTMLElement>('#shop-menu a[href]')?.focus()
                  }
                }}
                className={`${navCls(pathname.startsWith('/shop'))} gap-1`}
              >
                {n.label}
                <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            ) : (
              <NavLink key={n.label} to={n.to} end className={({ isActive }) => navCls(isActive)}>
                {n.label}
              </NavLink>
            ),
          )}
        </nav>

        <div className="flex items-center justify-end lg:-mr-2.5">
          <button type="button" aria-label="Search" aria-haspopup="dialog" onClick={() => open('search')} className={iconBtn}>
            <Search className="h-[22px] w-[22px]" aria-hidden="true" />
          </button>
          <Link to="/wishlist" aria-label={`Wishlist, ${wishCount} saved`} className={`${iconBtn} hidden lg:grid`}>
            <Heart className="h-[22px] w-[22px]" aria-hidden="true" />
            <Count n={wishCount} />
          </Link>
          <Link to="/account" aria-label="My account" className={`${iconBtn} hidden lg:grid`}>
            <User className="h-[22px] w-[22px]" aria-hidden="true" />
          </Link>
          <button type="button" aria-label={`Open bag, ${count} ${count === 1 ? 'item' : 'items'}`} aria-haspopup="dialog" onClick={() => open('bag')} className={`${iconBtn} -mr-2.5 lg:mr-0`}>
            <ShoppingBag className="h-[22px] w-[22px]" aria-hidden="true" />
            <Count n={count} />
          </button>
        </div>
      </div>
      <ShopMenu top={top} onClose={closeShop} onEnter={cancel} onLeave={scheduleClose} onTabOut={tabOut} />
    </header>
  )
}
