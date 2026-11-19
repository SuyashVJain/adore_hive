import type { ReactNode } from 'react'
import { m } from 'framer-motion'
import { fadeUp, fade } from '@/lib/motion'

/** Fades a block up once as it scrolls into view. Not for content above the fold. */
export function Reveal({ children, className, as: Tag = 'div', delay = 0, plain, labelledBy, label }: { children: ReactNode; className?: string; as?: 'div' | 'section' | 'li' | 'ul'; delay?: number; plain?: boolean; labelledBy?: string; label?: string }) {
  const M = m[Tag]
  return (
    <M className={className} aria-labelledby={labelledBy} aria-label={label} initial="hidden" whileInView="show" viewport={{ once: true, margin: '0px 0px -8% 0px' }} variants={plain ? fade : fadeUp} transition={delay ? { delay } : undefined}>
      {children}
    </M>
  )
}
