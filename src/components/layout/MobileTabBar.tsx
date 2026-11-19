import { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { Heart, House, ShoppingBag, Store, User } from 'lucide-react'
import { useBagSummary } from '@/store/bag'
import { useUI } from '@/store/ui'
import { useWishlist } from '@/store/wishlist'

/** True while the on-screen keyboard is up, or a dialog, drawer or menu has locked page scroll. */
function useHidden() {
  const panel = useUI((s) => s.panel)
  const [keyboard, setKeyboard] = useState(false)
  const [locked, setLocked] = useState(false)

  useEffect(() => {
    const typing = () => {
      const a = document.activeElement
      setKeyboard(!!a && (a.tagName === 'TEXTAREA' || (a.tagName === 'INPUT' && !['checkbox', 'radio', 'range', 'button', 'submit'].includes((a as HTMLInputElement).type))))
    }
    const vv = window.visualViewport
    const resize = () => vv && setKeyboard((k) => k || window.innerHeight - vv.height > 140)
    document.addEventListener('focusin', typing)
    document.addEventListener('focusout', () => setTimeout(typing, 50))
    vv?.addEventListener('resize', resize)
    // Radix menus and our overlays lock page scroll while open
    const sync = () => setLocked(document.body.style.overflow === 'hidden' || document.body.hasAttribute('data-scroll-locked'))
    const mo = new MutationObserver(sync)
    mo.observe(document.body, { attributes: true, attributeFilter: ['style', 'data-scroll-locked'] })
    sync()
    return () => { document.removeEventListener('focusin', typing); vv?.removeEventListener('resize', resize); mo.disconnect() }
  }, [])

  return keyboard || locked || panel !== null
}

const item = 'relative flex h-14 flex-1 flex-col items-center justify-center gap-0.5 text-xs outline-none transition-colors focus-visible:bg-blush'

export function MobileTabBar() {
  const hidden = useHidden()
  const { pathname } = useLocation()
  const { count } = useBagSummary()
  const wish = useWishlist((s) => s.ids.length)

  const tabs = [
    { to: '/', label: 'Home', icon: House, active: pathname === '/' },
    { to: '/shop', label: 'Shop', icon: Store, active: pathname.startsWith('/shop') || pathname.startsWith('/product') },
    { to: '/wishlist', label: 'Wishlist', icon: Heart, active: pathname === '/wishlist', badge: wish },
    { to: '/bag', label: 'Bag', icon: ShoppingBag, active: pathname === '/bag', badge: count, bagTarget: true },
    { to: '/account', label: 'Account', icon: User, active: pathname === '/account' },
  ]

  return (
    <nav
      aria-label="Main tabs"
      aria-hidden={hidden || undefined}
      {...(hidden ? ({ inert: '' } as object) : {})}
      className={`fixed inset-x-0 bottom-0 z-30 border-t border-line bg-page/95 pb-[env(safe-area-inset-bottom)] backdrop-blur transition-transform duration-200 md:hidden motion-reduce:transition-none ${hidden ? 'translate-y-full' : ''}`}
    >
      <ul className="flex">
        {tabs.map((t) => (
          <li key={t.to} className="flex-1">
            <NavLink to={t.to} aria-current={t.active ? 'page' : undefined} data-bag-target={t.bagTarget || undefined} className={`${item} ${t.active ? 'text-ink' : 'text-muted'}`}>
              <span className="relative">
                <t.icon className="h-[22px] w-[22px]" strokeWidth={t.active ? 2.2 : 1.6} aria-hidden="true" />
                {!!t.badge && <span aria-hidden="true" className="absolute -right-2.5 -top-1.5 grid h-[16px] min-w-[16px] place-items-center rounded-full bg-ink px-1 text-[0.75rem] leading-none text-white">{t.badge}</span>}
              </span>
              <span className={t.active ? 'font-medium' : ''}>{t.label}</span>
              {t.active && <span aria-hidden="true" className="absolute inset-x-6 top-0 h-0.5 rounded-full bg-ink" />}
              {!!t.badge && <span className="sr-only">, {t.badge} {t.badge === 1 ? 'item' : 'items'}</span>}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}

/** Keeps page content clear of the fixed tab bar. */
export const TabBarSpacer = () => <div aria-hidden="true" className="h-[calc(3.5rem+env(safe-area-inset-bottom))] md:hidden" />
