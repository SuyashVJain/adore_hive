import { useEffect, useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { m } from 'framer-motion'
import { overlayFade } from '@/lib/motion'

const FOCUSABLE =
  'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])'

interface Props {
  onClose: () => void
  children: ReactNode
  /** Keep Tab inside the overlay. Off for the hover/focus-opened mega menu. */
  trap?: boolean
  /** Move focus into the overlay on open. */
  autoFocus?: boolean
  /** Dim only: pointer events pass through to the page (hover-opened mega menu) */
  passThrough?: boolean
  /** Scrim colour classes (the lightbox wants it darker) */
  scrimClass?: string
}

/**
 * Full-viewport layer: dims the whole page (header included), locks scroll, traps focus,
 * closes on Escape and restores focus on unmount. Mount it inside <AnimatePresence> so it can animate out.
 */
export function Overlay({ onClose, children, trap = true, autoFocus = true, passThrough, scrimClass = 'bg-ink/45' }: Props) {
  const root = useRef<HTMLDivElement>(null)
  const close = useRef(onClose)
  close.current = onClose

  useEffect(() => {
    const el = root.current!
    const prev = document.activeElement as HTMLElement | null
    // lock scroll without the page jumping when the scrollbar disappears
    document.body.style.paddingRight = `${window.innerWidth - document.documentElement.clientWidth}px`
    document.body.style.overflow = 'hidden'
    const items = () => Array.from(el.querySelectorAll<HTMLElement>(FOCUSABLE))
    if (autoFocus) (el.querySelector<HTMLElement>('[data-autofocus]') ?? items()[0])?.focus()

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') return close.current()
      if (e.key !== 'Tab' || !trap) return
      const f = items()
      if (!f.length) return
      const first = f[0]
      const last = f[f.length - 1]
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
      document.body.style.paddingRight = ''
      prev?.focus?.()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return createPortal(
    <div ref={root} className={`fixed inset-0 z-50 ${passThrough ? 'pointer-events-none' : ''}`}>
      <m.div className={`absolute inset-0 ${scrimClass}`} aria-hidden="true" onClick={onClose} {...overlayFade} />
      {children}
    </div>,
    document.body,
  )
}
