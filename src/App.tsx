import { Navigate, Route, Routes } from 'react-router-dom'
import { CheckoutLayout, MainLayout } from '@/components/layout/Layouts'
import { Contact } from '@/pages/ContactPage'
import { Home } from '@/pages/Home'
import { About, Account, Checkout, HamperStudio, LetterStudio, NotFound, Policy } from '@/pages/pages'
import { BagPage } from '@/pages/BagPage'
import { ProductPage } from '@/pages/ProductPage'
import { SearchPage } from '@/pages/SearchPage'
import { WishlistPage } from '@/pages/WishlistPage'
import { Category, Shop } from '@/pages/ShopPages'

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="our-story" element={<Navigate to="/about" replace />} />
        <Route path="shop" element={<Shop />} />
        <Route path="shop/:category" element={<Category />} />
        <Route path="product/:id" element={<ProductPage />} />
        <Route path="hamper-studio" element={<HamperStudio />} />
        <Route path="letter-studio" element={<LetterStudio />} />
        <Route path="search" element={<SearchPage />} />
        <Route path="contact" element={<Contact />} />
        <Route path="wishlist" element={<WishlistPage />} />
        <Route path="account" element={<Account />} />
        <Route path="bag" element={<BagPage />} />
        <Route path="policies/:slug" element={<Policy />} />
        <Route path="*" element={<NotFound />} />
      </Route>
      <Route element={<CheckoutLayout />}>
        <Route path="checkout" element={<Checkout />} />
      </Route>
    </Routes>
  )
}
