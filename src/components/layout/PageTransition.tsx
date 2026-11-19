import { useRef, type ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import { m } from 'framer-motion'
import { tween, dur } from '@/lib/motion'

/** Short fade between routes. Opacity only, so nothing moves. */
export function PageTransition({ children }: { children: ReactNode }) {
  const { pathname } = useLocation()
  const first = useRef(true)
  const initial = first.current ? false : { opacity: 0 }
  first.current = false
  return (
    <m.div key={pathname} initial={initial} animate={{ opacity: 1 }} transition={tween(dur.base)}>
      {children}
    </m.div>
  )
}
