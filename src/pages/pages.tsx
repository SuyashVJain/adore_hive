import { useParams } from 'react-router-dom'
import { StubPage } from './StubPage'

export const About = () => (
  <StubPage crumbs={[{ label: 'About Us' }]} eyebrow="The heart behind the hive" title="About Adore Hive" subtitle="Adore is the feeling. Hive is the little world we build around it." cta={{ label: 'Shop collection', to: '/shop' }} />
)
export const HamperStudio = () => (
  <StubPage crumbs={[{ label: 'Customize Your Gift' }]} eyebrow="Custom hamper studio" title="Make it theirs." subtitle="Build a hamper, little treasure by little treasure." cta={{ label: 'Write a little love letter', to: '/letter-studio' }} />
)
export const LetterStudio = () => (
  <StubPage crumbs={[{ label: 'Customize Your Gift', to: '/hamper-studio' }, { label: 'Handwritten letters' }]} eyebrow="Handwritten letter studio" title="Words From the Heart" subtitle="Turn your words into a handwritten keepsake." cta={{ label: 'Create your own hamper', to: '/hamper-studio' }} />
)
export const Account = () => (
  <StubPage crumbs={[{ label: 'My Account' }]} eyebrow="Welcome back" title="My Account" subtitle="Your details, orders and saved little things." />
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

