import { useEffect, useRef, useState } from 'react'

/** Eases a number to its new value (about 400ms). Reduced motion: jumps straight there. */
export function useCountTo(value: number, ms = 400) {
  const [shown, setShown] = useState(value)
  const from = useRef(value)
  useEffect(() => {
    if (from.current === value) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      from.current = value
      setShown(value)
      return
    }
    const start = from.current
    const t0 = performance.now()
    let raf = 0
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / ms)
      const eased = 1 - Math.pow(1 - p, 3)
      setShown(start + (value - start) * eased)
      if (p < 1) raf = requestAnimationFrame(tick)
      else from.current = value
    }
    raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf)
      from.current = value
    }
  }, [value, ms])
  return Math.round(shown)
}
