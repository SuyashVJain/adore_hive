import { useParams } from 'react-router-dom'
import { getProduct, categoryLabel } from '@/data/products'
import { StubPage } from './StubPage'

const shop = { label: 'Shop', to: '/shop' }

export function Product() {
  const p = getProduct(useParams().id ?? '')
  if (!p) return <NotFound />
  return (
    <StubPage
      crumbs={[shop, { label: categoryLabel(p.category), to: `/shop/${p.category}` }, { label: p.name }]}
      eyebrow={categoryLabel(p.category)}
      title={p.name}
      subtitle={p.description}
      products={[p]}
    />
  )
}

export const About = () => (
  <StubPage crumbs={[{ label: 'About Us' }]} eyebrow="The heart behind the hive" title="About Adore Hive" subtitle="Adore is the feeling. Hive is the little world we build around it." cta={{ label: 'Shop collection', to: '/shop' }} />
)
export const HamperStudio = () => (
  <StubPage crumbs={[{ label: 'Customize Your Gift' }]} eyebrow="Custom hamper studio" title="Make it theirs." subtitle="Build a hamper, little treasure by little treasure." cta={{ label: 'Write a little love letter', to: '/letter-studio' }} />
)
export const LetterStudio = () => (
  <StubPage crumbs={[{ label: 'Customize Your Gift', to: '/hamper-studio' }, { label: 'Handwritten letters' }]} eyebrow="Handwritten letter studio" title="Words From the Heart" subtitle="Turn your words into a handwritten keepsake." cta={{ label: 'Create your own hamper', to: '/hamper-studio' }} />
)
export const Wishlist = () => (
  <StubPage crumbs={[{ label: 'Wishlist' }]} eyebrow="Saved for later" title="Your Wishlist" subtitle="The little things you’ve fallen for." cta={{ label: 'Shop all', to: '/shop' }} />
)
export const Account = () => (
  <StubPage crumbs={[{ label: 'My Account' }]} eyebrow="Welcome back" title="My Account" subtitle="Your details, orders and saved little things." />
)
export const Bag = () => (
  <StubPage crumbs={[{ label: 'Your Bag' }]} eyebrow="Your bag" title="Your bag of lovely things." subtitle="Review your little treasures before checkout." cta={{ label: 'Checkout', to: '/checkout' }} />
)
export const Checkout = () => (
  <StubPage eyebrow="Bag → Details → A little love on its way" title="Make it yours." subtitle="Add your details and review your lovely little order." />
)

const policies: Record<string, string> = {
  shipping: 'Shipping Policy',
  returns: 'Return and Exchange Policy',
  privacy: 'Privacy Policy',
  terms: 'Terms and Conditions',
}
export function Policy() {
  const title = policies[useParams().slug ?? '']
  if (!title) return <NotFound />
  return <StubPage crumbs={[{ label: title }]} eyebrow="Here to help" title={title} subtitle="How we look after you and your little treasures." />
}

export function NotFound() {
  return <StubPage eyebrow="Page not found" title="We couldn’t find that page." subtitle="It may have moved. Let’s get you back to something lovely." cta={{ label: 'Shop all', to: '/shop' }} />
}

