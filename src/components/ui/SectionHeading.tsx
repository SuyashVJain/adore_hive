import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

interface Props {
  eyebrow?: string
  title: string
  subtitle?: string
  align?: 'left' | 'center'
  as?: 'h1' | 'h2'
  action?: { label: string; to: string }
  children?: ReactNode
}

export function SectionHeading({ eyebrow, title, subtitle, align = 'left', as: Tag = 'h2', action }: Props) {
  const center = align === 'center'
  return (
    <div className={`flex items-end justify-between gap-6 ${center ? 'justify-center text-center' : ''}`}>
      <div className={center ? 'w-full' : ''}>
        {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
        <Tag className={`text-4xl leading-tight text-ink ${Tag === 'h1' ? 'md:text-5xl' : ''}`}>{title}</Tag>
        {subtitle && <p className={`mt-3 text-base text-muted ${center ? 'mx-auto max-w-xl' : ''}`}>{subtitle}</p>}
      </div>
      {action && (
        <Link to={action.to} className="inline-flex min-h-11 shrink-0 items-center font-label text-xs font-medium uppercase tracking-[0.14em] hover:underline underline-offset-4">
          {action.label}
        </Link>
      )}
    </div>
  )
}
