import { Link } from 'react-router-dom'
import { Lock } from 'lucide-react'
import { site } from '@/config/site'
import { helpLinks } from '@/data/nav'
import { Logo } from './Logo'

export function MinimalCheckoutHeader() {
  return (
    <header className="border-b border-line bg-page">
      <div className="container-page grid h-[76px] grid-cols-[1fr_auto_1fr] items-center">
        <Link to="/bag" className="inline-flex min-h-11 items-center text-sm hover:underline underline-offset-4">Back to bag</Link>
        <Logo className="h-14" />
        <p className="flex items-center justify-end gap-1.5 text-sm text-muted">
          <Lock className="h-4 w-4" aria-hidden="true" /> <span className="hidden sm:inline">Secure checkout</span>
          <span className="sr-only sm:hidden">Secure checkout</span>
        </p>
      </div>
    </header>
  )
}

export function MinimalCheckoutFooter() {
  return (
    <footer className="border-t border-line bg-page py-6">
      <div className="container-page flex flex-col items-center justify-between gap-2 text-xs text-muted md:flex-row">
        <ul className="flex flex-wrap justify-center gap-x-5">
          {helpLinks.map((l) => (
            <li key={l.to}><Link to={l.to} className="inline-flex min-h-11 items-center hover:text-ink hover:underline underline-offset-4">{l.label}</Link></li>
          ))}
        </ul>
        <p>© {new Date().getFullYear()} {site.name}</p>
      </div>
    </footer>
  )
}
