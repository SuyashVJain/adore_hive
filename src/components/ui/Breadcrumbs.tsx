import { Link } from 'react-router-dom'

export interface Crumb {
  label: string
  to?: string
}

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center text-xs text-muted">
        {items.map((c, i) => {
          const last = i === items.length - 1
          return (
            <li key={c.label} className="flex items-center">
              {c.to && !last ? (
                <Link to={c.to} className="inline-flex min-h-11 items-center hover:text-ink hover:underline underline-offset-4">{c.label}</Link>
              ) : (
                <span aria-current={last ? 'page' : undefined} className="inline-flex min-h-11 items-center text-ink">{c.label}</span>
              )}
              {!last && <span className="mx-2" aria-hidden="true">/</span>}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
