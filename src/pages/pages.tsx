import { useParams, useSearchParams } from 'react-router-dom'
import { categories, getProduct, products, searchProducts, categoryLabel } from '@/data/products'
import { StubPage } from './StubPage'

const shop = { label: 'Shop', to: '/shop' }

export const Home = () => (
  <StubPage
    eyebrow="A little adore. A little every day."
    title="A Little Love in Every Detail."
    subtitle="Discover thoughtfully curated accessories, handmade treasures and personalized gifts."
    cta={{ label: 'Shop collection', to: '/shop' }}
    products={products.slice(0, 4)}
  />
)

export function Shop() {
  const q = useSearchParams()[0].get('q') ?? ''
  const list = q ? searchProducts(q) : products
  return (
    <StubPage
      crumbs={[{ label: 'Shop' }]}
      eyebrow={q ? 'Search results' : 'The Adore collection'}
      title={q ? `“${q}”` : 'Shop All'}
      subtitle={q ? `${list.length} lovely ${list.length === 1 ? 'find' : 'finds'}` : 'Little treasures, thoughtfully chosen. Find the pieces that feel like you.'}
      products={list}
    />
  )
}

export function Category() {
  const { category } = useParams()
  const c = categories.find((x) => x.slug === category)
  if (!c) return <NotFound />
  return (
    <StubPage
      crumbs={[shop, { label: c.label }]}
      eyebrow="The Adore collection"
      title={c.label}
      subtitle={c.blurb}
      products={products.filter((p) => p.category === c.slug)}
    />
  )
}

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
export const OurStory = () => (
  <StubPage crumbs={[{ label: 'Our Story' }]} eyebrow="The heart behind the hive" title="Our Story" subtitle="Self-expression lives in the details: a bow in your hair, a handmade bloom on your desk, a gift chosen just for someone." cta={{ label: 'Shop collection', to: '/shop' }} />
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

