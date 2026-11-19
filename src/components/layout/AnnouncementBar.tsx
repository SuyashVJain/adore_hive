import { useEffect, useState } from 'react'
import { Heart, Pause, Play } from 'lucide-react'
import { FREE_SHIPPING_OVER } from '@/config/shop'
import { formatINR } from '@/lib/format'

const messages = [
  'Little things, lovely feelings',
  `Free shipping above ${formatINR(FREE_SHIPPING_OVER)}`,
  'Personalised gifts made with love',
]
const EVERY = 5000

/** True when the visitor asks for reduced motion. */
function useReducedMotion() {
  const [reduce, setReduce] = useState(() => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const f = () => setReduce(mq.matches)
    mq.addEventListener('change', f)
    return () => mq.removeEventListener('change', f)
  }, [])
  return reduce
}

/**
 * Three short messages that fade every five seconds. They sit stacked in one grid cell, so the bar never changes height.
 * Rotation pauses on hover and focus, has a visible pause button, and does not run at all under reduced motion.
 * The current message is announced politely through a live region; the visual stack is hidden from assistive tech.
 */
export function AnnouncementBar() {
  const reduce = useReducedMotion()
  const [i, setI] = useState(0)
  const [hold, setHold] = useState(false) // hover or focus
  const [paused, setPaused] = useState(false) // pause button

  const rotating = !reduce && !hold && !paused
  useEffect(() => {
    if (!rotating) return
    const t = setInterval(() => setI((n) => (n + 1) % messages.length), EVERY)
    return () => clearInterval(t)
  }, [rotating])

  return (
    <div
      role="region"
      aria-label="Announcement"
      onMouseEnter={() => setHold(true)}
      onMouseLeave={() => setHold(false)}
      onFocus={() => setHold(true)}
      onBlur={() => setHold(false)}
      className="relative flex min-h-8 items-center justify-center bg-rose px-12 py-1.5 text-center text-xs text-ink"
    >
      <span className="sr-only" aria-live="polite" aria-atomic="true">{messages[i]}</span>
      <div className="grid" aria-hidden="true">
        {messages.map((t, n) => (
          <span key={t} className={`col-start-1 row-start-1 transition-opacity duration-500 ease-out motion-reduce:transition-none ${n === i ? 'opacity-100' : 'opacity-0'}`}>
            {t} {n === 0 && <Heart className="inline h-3 w-3 align-[-1px]" />}
          </span>
        ))}
      </div>
      {!reduce && (
        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          aria-label={paused ? 'Resume announcements' : 'Pause announcements'}
          className="absolute right-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full outline-none before:absolute before:-inset-1.5 before:content-[''] hover:bg-ink/10 focus-visible:bg-ink/10 focus-visible:ring-1 focus-visible:ring-ink"
        >
          {paused ? <Play className="h-3.5 w-3.5" aria-hidden="true" /> : <Pause className="h-3.5 w-3.5" aria-hidden="true" />}
        </button>
      )}
    </div>
  )
}
