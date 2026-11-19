import { StubPage } from './StubPage'

export const HamperStudio = () => (
  <StubPage crumbs={[{ label: 'Customize Your Gift' }]} eyebrow="Custom hamper studio" title="Make it theirs." subtitle="Build a hamper, little treasure by little treasure." cta={{ label: 'Write a little love letter', to: '/letter-studio' }} />
)
export const LetterStudio = () => (
  <StubPage crumbs={[{ label: 'Customize Your Gift', to: '/hamper-studio' }, { label: 'Handwritten letters' }]} eyebrow="Handwritten letter studio" title="Words From the Heart" subtitle="Turn your words into a handwritten keepsake." cta={{ label: 'Create your own hamper', to: '/hamper-studio' }} />
)

export function NotFound() {
  return <StubPage eyebrow="Page not found" title="We couldn’t find that page." subtitle="It may have moved, or the link may have a typo. Let’s get you back to something lovely." cta={{ label: 'Shop all', to: '/shop' }} products={[]} />
}
