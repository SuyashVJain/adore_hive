import { Suspense, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { useUI } from '@/store/ui'
import { AnnouncementBar } from './AnnouncementBar'
import { BagDrawer } from './BagDrawer'
import { Footer } from './Footer'
import { Header } from './Header'
import { MinimalCheckoutFooter, MinimalCheckoutHeader } from './MinimalCheckout'
import { MobileMenu } from './MobileMenu'
import { MobileTabBar, TabBarSpacer } from './MobileTabBar'
import { NewsletterBlock } from './NewsletterBlock'
import { PageLoading } from './PageLoading'
import { PageTransition } from './PageTransition'
import { QuickView } from './QuickView'
import { Toaster } from '../ui/Toaster'
import { SearchOverlay } from './SearchOverlay'

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
      <MobileMenu />
      <SearchOverlay />
      <BagDrawer />
      <QuickView />
      <Toaster />
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
