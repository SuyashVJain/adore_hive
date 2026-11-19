import { MapPin, Phone } from 'lucide-react'
import { addressLine, site } from '@/config/site'
import { Button } from './Button'
import { ExtLink } from './ExtLink'

/** Address, phone, WhatsApp, community and Instagram. Email only renders when configured. */
export function ContactDetails({ className = '', linkClass = 'text-muted hover:text-ink' }: { className?: string; linkClass?: string }) {
  return (
    <ul className={className}>
      <li className="flex min-h-11 items-center gap-2 text-sm text-muted">
        <MapPin className="h-4 w-4 shrink-0" aria-hidden="true" /> {addressLine}
      </li>
      <li>
        <a href={site.phoneHref} className={`inline-flex min-h-11 items-center gap-2 text-sm hover:underline underline-offset-4 ${linkClass}`}>
          <Phone className="h-4 w-4 shrink-0" aria-hidden="true" /> {site.phoneDisplay}
        </a>
      </li>
      {site.email && (
        <li><a href={`mailto:${site.email}`} className={`inline-flex min-h-11 items-center text-sm hover:underline underline-offset-4 ${linkClass}`}>{site.email}</a></li>
      )}
      <li><ExtLink href={site.whatsappUrl} className={`text-sm ${linkClass}`}>Chat on WhatsApp</ExtLink></li>
      <li><ExtLink href={site.whatsappCommunityUrl} className={`text-sm ${linkClass}`}>Join our WhatsApp community</ExtLink></li>
      <li><ExtLink href={site.instagramUrl} className={`text-sm ${linkClass}`}>Instagram {site.instagramHandle}</ExtLink></li>
    </ul>
  )
}

export function WhatsAppButton() {
  return <Button href={site.whatsappUrl} variant="outline">Chat on WhatsApp</Button>
}
