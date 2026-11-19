import type { ReactNode } from 'react'

export function Badge({ children, tone = 'plain' }: { children: ReactNode; tone?: 'plain' | 'blush' | 'ink' }) {
  const t = { plain: 'text-eyebrow', blush: 'bg-blush text-ink px-2 py-0.5 rounded-sm', ink: 'bg-ink text-white px-2 py-0.5 rounded-sm' }[tone]
  return <span className={`font-label text-xs font-medium uppercase tracking-[0.14em] ${t}`}>{children}</span>
}
