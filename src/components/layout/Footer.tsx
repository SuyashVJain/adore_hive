import { BeeMark, Honeycomb } from '../art/Art'
import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'
import { site } from '@/config/site'
import { exploreLinks, helpLinks } from '@/data/nav'
import { ContactDetails } from '../ui/ContactDetails'
import { Logo } from './Logo'

const link = 'inline-flex min-h-11 items-center text-sm text-muted transition-colors hover:text-ink hover:underline underline-offset-4'

function Col({ title, children, wide }: { title: string; children: React.ReactNode; wide?: boolean }) {
  return (
    <div className={wide ? 'col-span-2 md:col-span-1' : ''}>
      <h2 className="font-label text-xs font-semibold uppercase tracking-[0.14em] text-ink">{title}</h2>
      <ul className="mt-2">{children}</ul>
    </div>
  )
}

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-blush">
      <Honeycomb className="h-40" />
      <div className="container-page relative border-t border-ink/10 py-12">
        <div className="grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-[220px_1fr_1fr_1fr] md:gap-10">
          <div className="col-span-2 md:col-span-1">
            <Logo className="-ml-3 h-36" />
            <p className="mt-1 font-display text-2xl italic">{site.tagline}</p>
          </div>
          <Col title="Explore Adore">
            {exploreLinks.map((l) => <li key={l.to + l.label}><Link to={l.to} className={link}>{l.label}</Link></li>)}
          </Col>
          <Col title="Here to help">
            {helpLinks.map((l) => <li key={l.to}><Link to={l.to} className={link}>{l.label}</Link></li>)}
          </Col>
          <Col title="Say hello" wide>
            <li><ContactDetails linkClass="text-muted hover:text-ink" /></li>
          </Col>
        </div>
        <p className="mt-10 border-t border-ink/10 pt-6 text-center text-xs text-muted">
          <span className="sr-only">Made with love by {site.name}.</span>
          <span aria-hidden="true">
            Made with <Heart className="inline h-3 w-3 align-[-1px]" /> by {site.name}. <BeeMark className="ml-1 inline h-5 w-5 align-[-5px]" />
          </span>
        </p>
      </div>
    </footer>
  )
}
