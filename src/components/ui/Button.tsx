import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ExternalLink } from 'lucide-react'

type Variant = 'primary' | 'outline' | 'text'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  full?: boolean
  /** Internal route */
  to?: string
  /** External URL: opens in a new tab and shows the external icon */
  href?: string
  children: ReactNode
}

const base =
  'inline-flex min-h-[46px] whitespace-nowrap items-center justify-center gap-2 rounded px-6 py-2 font-label text-xs font-semibold uppercase tracking-[0.14em] transition-colors select-none disabled:cursor-not-allowed disabled:opacity-45 aria-disabled:cursor-not-allowed aria-disabled:opacity-45'
const variants: Record<Variant, string> = {
  primary: 'bg-ink text-white hover:bg-[#3a3030] active:bg-black disabled:hover:bg-ink',
  outline: 'border border-ink bg-surface text-ink hover:bg-blush active:bg-[#f0cfcf] disabled:hover:bg-surface',
  text: 'min-h-11 px-2 text-ink underline-offset-4 hover:underline active:opacity-70',
}

export function Button({ variant = 'primary', full, to, href, className = '', children, type = 'button', ...rest }: Props) {
  const cls = `${base} ${variants[variant]} ${full ? 'w-full' : ''} ${className}`
  if (to) return <Link to={to} className={cls} onClick={rest.onClick as never} aria-label={rest['aria-label']}>{children}</Link>
  if (href)
    return (
      <a href={href} className={cls} target="_blank" rel="noopener noreferrer" aria-label={rest['aria-label']}>
        {children}
        <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
        <span className="sr-only">(opens in a new tab)</span>
      </a>
    )
  return <button type={type} className={cls} {...rest}>{children}</button>
}
