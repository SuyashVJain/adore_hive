import type { ReactNode } from 'react'

// Original line illustrations in the brand palette: ink outline, blush fill, a little gold. All decorative (aria-hidden).
const INK = '#171313'
const BLUSH = '#f8e2e1'
const ROSE = '#f6c9c9'
const GOLD = '#c9a74d'

const base = { stroke: INK, strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' } as const

function Spark({ x, y, s = 5 }: { x: number; y: number; s?: number }) {
  return <path d={`M${x} ${y - s}V${y + s}M${x - s} ${y}H${x + s}`} stroke={GOLD} strokeWidth={1.8} strokeLinecap="round" />
}

export function GiftBoxArt({ className = 'h-28 w-28' }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden="true" focusable="false">
      <ellipse cx="60" cy="108" rx="34" ry="4" fill={ROSE} opacity=".6" />
      <rect x="24" y="56" width="72" height="48" rx="5" fill={BLUSH} {...base} />
      <rect x="18" y="42" width="84" height="16" rx="5" fill="#fff" {...base} />
      <path d="M60 42v62" fill="none" {...base} />
      <path d="M60 42c-6-14-22-16-22-8 0 7 14 8 22 8Zm0 0c6-14 22-16 22-8 0 7-14 8-22 8Z" fill={ROSE} {...base} />
      <Spark x={100} y={26} />
      <Spark x={18} y={30} s={4} />
      <circle cx="104" cy="70" r="1.8" fill={GOLD} />
    </svg>
  )
}

export function HeartArt({ className = 'h-28 w-28' }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden="true" focusable="false">
      <ellipse cx="60" cy="108" rx="26" ry="3.5" fill={ROSE} opacity=".6" />
      <path d="M60 98C26 74 20 52 28 38c8-13 27-12 32 2 5-14 24-15 32-2 8 14 2 36-32 60Z" fill={BLUSH} {...base} />
      <path d="M38 46c2-6 8-8 12-6" fill="none" {...base} strokeWidth={1.6} opacity=".55" />
      <Spark x={98} y={24} />
      <Spark x={22} y={22} s={4} />
      <circle cx="102" cy="66" r="1.8" fill={GOLD} />
    </svg>
  )
}

export function MagnifierArt({ className = 'h-28 w-28' }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden="true" focusable="false">
      <ellipse cx="62" cy="108" rx="30" ry="3.5" fill={ROSE} opacity=".6" />
      <circle cx="52" cy="50" r="30" fill={BLUSH} {...base} />
      <path d="M38 40c3-6 9-9 15-8" fill="none" {...base} strokeWidth={1.6} opacity=".55" />
      <path d="M74 72l26 26" fill="none" {...base} strokeWidth={7} />
      <path d="M74 72l26 26" stroke={ROSE} strokeWidth={3} strokeLinecap="round" />
      <path d="M45 58c4 4 10 4 14 0" fill="none" {...base} strokeWidth={1.8} />
      <Spark x={96} y={28} />
      <Spark x={14} y={80} s={4} />
    </svg>
  )
}

/** Small original bee: striped body, soft wings, a curl of flight path. */
export function BeeMark({ className = 'h-16 w-16' }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true" focusable="false">
      <ellipse cx="18" cy="13" rx="6.5" ry="10" transform="rotate(-25 18 13)" fill="#fff" fillOpacity=".85" {...base} strokeWidth={1.6} />
      <ellipse cx="29" cy="11" rx="6.5" ry="10" transform="rotate(20 29 11)" fill="#fff" fillOpacity=".85" {...base} strokeWidth={1.6} />
      <ellipse cx="25" cy="30" rx="13" ry="9.5" fill="#f2c94c" {...base} strokeWidth={1.8} />
      <path d="M20 21.5v17M26 20.5v19M32 22v16" fill="none" {...base} strokeWidth={2.2} />
      <circle cx="11" cy="30" r="5" fill={INK} />
      <path d="M8 26c-2-3-4-4-6-4M11 25c-1-4-2-6-4-7" fill="none" {...base} strokeWidth={1.6} />
    </svg>
  )
}

/** Faint honeycomb background. Place inside a `relative overflow-hidden` section. */
export function Honeycomb({ className = '' }: { className?: string }) {
  return <div aria-hidden="true" className={`honeycomb pointer-events-none absolute inset-x-0 top-0 h-48 opacity-[0.05] ${className}`} />
}

interface EmptyProps {
  art: ReactNode
  title: string
  text?: string
  children?: ReactNode
}

/** Illustrated empty state: a small line drawing, the heading, a line of copy and the next step. */
export function EmptyState({ art, title, text, children }: EmptyProps) {
  return (
    <div className="rounded-lg bg-surface px-6 py-12 text-center">
      <div className="mb-2 flex justify-center">{art}</div>
      <p className="font-display text-3xl">{title}</p>
      {text && <p className="mx-auto mt-2 max-w-md text-muted">{text}</p>}
      {children && <div className="mt-6 flex flex-wrap justify-center gap-3">{children}</div>}
    </div>
  )
}
