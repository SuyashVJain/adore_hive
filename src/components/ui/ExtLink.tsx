import type { ReactNode } from 'react'
import { ExternalLink } from 'lucide-react'

/** The only place the external-link icon is used: real links that leave the site. */
export function ExtLink({ href, children, className = '' }: { href: string; children: ReactNode; className?: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex min-h-11 items-center gap-1.5 hover:underline underline-offset-4 ${className}`}
    >
      {children}
      <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
      <span className="sr-only">(opens in a new tab)</span>
    </a>
  )
}
