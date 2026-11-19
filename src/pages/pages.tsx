import { useSeo } from '@/lib/useDocumentTitle'
import { StubPage } from './StubPage'

export function NotFound() {
  useSeo('Page not found', undefined, { noindex: true })
  return <StubPage eyebrow="Page not found" title="We couldn’t find that page." subtitle="It may have moved, or the link may have a typo. Let’s get you back to something lovely." cta={{ label: 'Shop all', to: '/shop' }} />
}
