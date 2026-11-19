import { Navigate, Route, Routes } from 'react-router-dom'
import { CheckoutLayout, MainLayout } from '@/components/layout/Layouts'
import { Contact } from '@/pages/ContactPage'
import { Home } from '@/pages/Home'
import { About, Account, Bag, Checkout, HamperStudio, LetterStudio, NotFound, Policy, Product, Wishlist } from '@/pages/pages'
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
        <Route path="product/:id" element={<Product />} />
        <Route path="hamper-studio" element={<HamperStudio />} />
        <Route path="letter-studio" element={<LetterStudio />} />
        <Route path="contact" element={<Contact />} />
        <Route path="wishlist" element={<Wishlist />} />
        <Route path="account" element={<Account />} />
        <Route path="bag" element={<Bag />} />
        <Route path="policies/:slug" element={<Policy />} />
        <Route path="*" element={<NotFound />} />
      </Route>
      <Route element={<CheckoutLayout />}>
        <Route path="checkout" element={<Checkout />} />
      </Route>
    </Routes>
  )
}
