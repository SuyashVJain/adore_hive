import { useRef, type ReactNode } from 'react'
import { useLocation } from 'react-router-dom'

/** Short fade between routes (CSS, opacity only). The first render is not animated so it never delays the first paint. */
export function PageTransition({ children }: { children: ReactNode }) {
  const { pathname } = useLocation()
  const first = useRef(true)
  const animate = !first.current
  first.current = false
  return <div key={pathname} className={animate ? 'animate-fade' : undefined}>{children}</div>
}
