import { Suspense, lazy, useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { useUI } from '@/store/ui'
import { AnnouncementBar } from './AnnouncementBar'
import { Footer } from './Footer'
import { Header } from './Header'
import { MinimalCheckoutFooter, MinimalCheckoutHeader } from './MinimalCheckout'
import { MobileTabBar, TabBarSpacer } from './MobileTabBar'
import { NewsletterBlock } from './NewsletterBlock'
import { PageLoading } from './PageLoading'
import { PageTransition } from './PageTransition'
import { useToast } from '@/store/toast'

// Overlays are only needed once someone opens them, so their code loads on first use (and is prefetched when the browser is idle).
const loadBag = () => import('./BagDrawer').then((m) => ({ default: m.BagDrawer }))
const loadMenu = () => import('./MobileMenu').then((m) => ({ default: m.MobileMenu }))
const loadQuick = () => import('./QuickView').then((m) => ({ default: m.QuickView }))
const loadSearch = () => import('./SearchOverlay').then((m) => ({ default: m.SearchOverlay }))
const loadToaster = () => import('../ui/Toaster').then((m) => ({ default: m.Toaster }))
const Toaster = lazy(loadToaster)
const BagDrawer = lazy(loadBag)
const MobileMenu = lazy(loadMenu)
const QuickView = lazy(loadQuick)
const SearchOverlay = lazy(loadSearch)

function LazyOverlays() {
  const panel = useUI((s) => s.panel)
  const [seen, setSeen] = useState<Record<string, boolean>>({})
  useEffect(() => {
    if (panel && !seen[panel]) setSeen((s) => ({ ...s, [panel]: true }))
  }, [panel, seen])
  useEffect(() => {
    const t = setTimeout(() => { void loadBag(); void loadMenu(); void loadSearch() }, 4000)
    return () => clearTimeout(t)
  }, [])
  return (
    <Suspense fallback={null}>
      {seen.menu && <MobileMenu />}
      {seen.search && <SearchOverlay />}
      {seen.bag && <BagDrawer />}
      {seen.quickview && <QuickView />}
    </Suspense>
  )
}

/** The toast code loads when the first toast is shown, then stays mounted so toasts can animate out. */
function ToastHost() {
  const has = useToast((s) => s.toast !== null)
  const [seen, setSeen] = useState(false)
  useEffect(() => { if (has) setSeen(true) }, [has])
  return seen ? <Suspense fallback={null}><Toaster /></Suspense> : null
}

function SkipLink() {
  return (
    <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[60] focus:rounded focus:bg-ink focus:px-4 focus:py-3 focus:text-sm focus:text-white">
      Skip to content
    </a>
  )
}

/** Close any open overlay and reset scroll on every navigation. */
function useOnNavigate() {
  const { key, pathname, hash } = useLocation()
  const close = useUI((s) => s.close)
  useEffect(() => {
    close()
  }, [key, close])
  useEffect(() => {
    if (!hash) window.scrollTo(0, 0)
  }, [pathname, hash])
}

export function MainLayout() {
  useOnNavigate()
  return (
    <>
      <SkipLink />
      <AnnouncementBar />
      <Header />
      <main id="main" tabIndex={-1} className="outline-none">
        <PageTransition>
          <Suspense fallback={<PageLoading />}>
            <Outlet />
          </Suspense>
        </PageTransition>
      </main>
      <NewsletterBlock />
      <Footer />
      <TabBarSpacer />
      <MobileTabBar />
      <LazyOverlays />
      <ToastHost />
    </>
  )
}

/** No announcement bar, nav, newsletter or full footer: keeps checkout focused. */
export function CheckoutLayout() {
  useOnNavigate()
  return (
    <>
      <SkipLink />
      <MinimalCheckoutHeader />
      <main id="main" tabIndex={-1} className="outline-none">
        <PageTransition>
          <Suspense fallback={<PageLoading />}>
            <Outlet />
          </Suspense>
        </PageTransition>
      </main>
      <MinimalCheckoutFooter />
    </>
  )
}
