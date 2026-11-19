import { lazy } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { CheckoutLayout, MainLayout } from '@/components/layout/Layouts'

// Each page is its own chunk, loaded when the route is first visited
const named = <T extends Record<string, unknown>, K extends keyof T>(load: () => Promise<T>, key: K) =>
  lazy(() => load().then((m) => ({ default: m[key] as React.ComponentType })))

const loadHome = () => import('@/pages/Home')
const Home = named(loadHome, 'Home')
const loadShop = () => import('@/pages/ShopPages')
const ShopAll = named(loadShop, 'Shop')
const Category = named(loadShop, 'Category')
const loadProduct = () => import('@/pages/ProductPage')
const ProductPage = named(loadProduct, 'ProductPage')
const SearchPage = named(() => import('@/pages/SearchPage'), 'SearchPage')
const WishlistPage = named(() => import('@/pages/WishlistPage'), 'WishlistPage')
const BagPage = named(() => import('@/pages/BagPage'), 'BagPage')
const loadCheckout = () => import('@/pages/CheckoutPage')
const CheckoutPage = named(loadCheckout, 'CheckoutPage')
const OrderConfirmation = named(() => import('@/pages/OrderConfirmation'), 'OrderConfirmation')
const AccountPage = named(() => import('@/pages/AccountPage'), 'AccountPage')
const AboutPage = named(() => import('@/pages/AboutPage'), 'AboutPage')
const Contact = named(() => import('@/pages/ContactPage'), 'Contact')
const PolicyPage = named(() => import('@/pages/policies/PolicyPage'), 'PolicyPage')
const GiftFinder = named(() => import('@/pages/GiftFinder'), 'GiftFinder')
const HamperStudioPage = named(() => import('@/pages/HamperStudio'), 'HamperStudioPage')
const LetterStudioPage = named(() => import('@/pages/LetterStudio'), 'LetterStudioPage')
const NotFound = named(() => import('@/pages/pages'), 'NotFound')

// Kick off the chunk for the first route right away, so it downloads alongside the app shell instead of after it
const first = window.location.pathname
if (first === '/') void loadHome()
else if (first.startsWith('/shop')) void loadShop()
else if (first.startsWith('/product/')) void loadProduct()
else if (first === '/checkout') void loadCheckout()

export default function App() {
  return (
    <>
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="our-story" element={<Navigate to="/about" replace />} />
          <Route path="shop" element={<ShopAll />} />
          <Route path="shop/:category" element={<Category />} />
          <Route path="product/:id" element={<ProductPage />} />
          <Route path="hamper-studio" element={<HamperStudioPage />} />
          <Route path="gift-finder" element={<GiftFinder />} />
          <Route path="letter-studio" element={<LetterStudioPage />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="order-confirmation/:id" element={<OrderConfirmation />} />
          <Route path="contact" element={<Contact />} />
          <Route path="wishlist" element={<WishlistPage />} />
          <Route path="account" element={<AccountPage />} />
          <Route path="bag" element={<BagPage />} />
          <Route path="policies/:slug" element={<PolicyPage />} />
          <Route path="*" element={<NotFound />} />
        </Route>
        <Route element={<CheckoutLayout />}>
          <Route path="checkout" element={<CheckoutPage />} />
        </Route>
      </Routes>
    </>
  )
}
