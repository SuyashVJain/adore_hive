import { useCallback, useEffect, useRef, useState, type PointerEvent as RPointerEvent } from 'react'
import { m } from 'framer-motion'
import { ChevronLeft, ChevronRight, Minus, Plus, RotateCcw, X } from 'lucide-react'
import { dialog } from '@/lib/motion'
import { Overlay } from '../ui/Overlay'

interface Props {
  images: string[]
  name: string
  index: number
  onIndex: (i: number) => void
  onClose: () => void
}

const MIN = 1
const MAX = 4
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v))

const btn = 'grid h-11 w-11 place-items-center rounded-full bg-white/90 text-ink outline-none transition-colors hover:bg-white focus-visible:ring-2 focus-visible:ring-white disabled:opacity-40 disabled:hover:bg-white/90'

/**
 * Full-screen photo viewer. Zoom with the buttons, the wheel, a double click or a two-finger pinch; pan when zoomed;
 * arrows, thumbnails or a swipe change photo; Escape closes; focus stays inside (Overlay) and returns to the photo you opened.
 */
export function Lightbox({ images, name, index, onIndex, onClose }: Props) {
  const stage = useRef<HTMLDivElement>(null)
  const [z, setZ] = useState(1)
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const pointers = useRef(new Map<number, { x: number; y: number }>())
  const start = useRef<{ x: number; y: number; px: number; py: number; pinch?: number; z0?: number } | null>(null)

  const limit = useCallback((x: number, y: number, zoom: number) => {
    const r = stage.current?.getBoundingClientRect()
    if (!r) return { x, y }
    const mx = (r.width * (zoom - 1)) / 2
    const my = (r.height * (zoom - 1)) / 2
    return { x: clamp(x, -mx, mx), y: clamp(y, -my, my) }
  }, [])

  const zoomTo = useCallback((next: number) => {
    const nz = clamp(next, MIN, MAX)
    setZ(nz)
    setPos((p) => (nz === 1 ? { x: 0, y: 0 } : limit(p.x, p.y, nz)))
  }, [limit])

  const go = useCallback((d: number) => {
    if (images.length < 2) return
    onIndex((index + d + images.length) % images.length)
  }, [images.length, index, onIndex])

  // a new photo starts unzoomed
  useEffect(() => { setZ(1); setPos({ x: 0, y: 0 }) }, [index])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1) }
      else if (e.key === 'ArrowRight') { e.preventDefault(); go(1) }
      else if (e.key === '+' || e.key === '=') { e.preventDefault(); zoomTo(z + 0.5) }
      else if (e.key === '-') { e.preventDefault(); zoomTo(z - 0.5) }
      else if (e.key === '0') { e.preventDefault(); zoomTo(1) }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [go, zoomTo, z])

  // Non-passive wheel listener, so the page does not scroll while zooming
  useEffect(() => {
    const el = stage.current
    if (!el) return
    const wheel = (e: WheelEvent) => { e.preventDefault(); zoomTo(z * (e.deltaY < 0 ? 1.15 : 1 / 1.15)) }
    el.addEventListener('wheel', wheel, { passive: false })
    return () => el.removeEventListener('wheel', wheel)
  }, [z, zoomTo])

  const dist = () => {
    const [a, b] = [...pointers.current.values()]
    return Math.hypot(a.x - b.x, a.y - b.y)
  }

  const down = (e: RPointerEvent) => {
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY })
    start.current = { x: e.clientX, y: e.clientY, px: pos.x, py: pos.y, pinch: pointers.current.size === 2 ? dist() : undefined, z0: z }
  }
  const move = (e: RPointerEvent) => {
    if (!pointers.current.has(e.pointerId) || !start.current) return
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY })
    if (pointers.current.size === 2 && start.current.pinch) {
      zoomTo((start.current.z0 ?? 1) * (dist() / start.current.pinch))
    } else if (z > 1) {
      setPos(limit(start.current.px + e.clientX - start.current.x, start.current.py + e.clientY - start.current.y, z))
    }
  }
  const up = (e: RPointerEvent) => {
    const s = start.current
    pointers.current.delete(e.pointerId)
    if (s && z === 1 && pointers.current.size === 0) {
      const dx = e.clientX - s.x
      const dy = e.clientY - s.y
      if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) go(dx < 0 ? 1 : -1) // swipe
    }
    if (pointers.current.size === 0) start.current = null
  }

  return (
    <Overlay onClose={onClose} scrimClass="bg-ink/90">
      <m.div role="dialog" aria-modal="true" aria-label={`${name} photos`} className="absolute inset-0 flex flex-col" {...dialog}>
        <div className="flex items-center justify-between gap-3 p-3 sm:p-4">
          <p className="rounded-full bg-white/90 px-3 py-1.5 text-sm" aria-live="polite">Photo {index + 1} of {images.length}</p>
          <div className="flex items-center gap-2" role="group" aria-label="Zoom">
            <button type="button" className={btn} aria-label="Zoom out" disabled={z <= MIN} onClick={() => zoomTo(z - 0.5)}><Minus className="h-5 w-5" aria-hidden="true" /></button>
            <button type="button" className={btn} aria-label="Zoom in" disabled={z >= MAX} onClick={() => zoomTo(z + 0.5)}><Plus className="h-5 w-5" aria-hidden="true" /></button>
            <button type="button" className={btn} aria-label="Reset zoom" disabled={z === 1} onClick={() => zoomTo(1)}><RotateCcw className="h-4 w-4" aria-hidden="true" /></button>
            <button type="button" data-autofocus className={`${btn} ml-1`} aria-label="Close photo viewer" onClick={onClose}><X className="h-5 w-5" aria-hidden="true" /></button>
          </div>
        </div>

        <div className="relative min-h-0 flex-1">
          <div
            ref={stage}
            onPointerDown={down}
            onPointerMove={move}
            onPointerUp={up}
            onPointerCancel={up}
            onDoubleClick={() => zoomTo(z > 1 ? 1 : 2)}
            className={`absolute inset-0 touch-none select-none overflow-hidden ${z > 1 ? 'cursor-grab active:cursor-grabbing' : 'cursor-zoom-in'}`}
          >
            <img
              src={images[index]}
              alt={index === 0 ? name : `${name}, photo ${index + 1}`}
              draggable={false}
              className="h-full w-full object-contain will-change-transform motion-safe:transition-transform motion-safe:duration-100"
              style={{ transform: `translate(${pos.x}px, ${pos.y}px) scale(${z})` }}
            />
          </div>
          {images.length > 1 && (
            <>
              <button type="button" className={`${btn} absolute left-3 top-1/2 -translate-y-1/2`} aria-label="Previous photo" onClick={() => go(-1)}><ChevronLeft className="h-5 w-5" aria-hidden="true" /></button>
              <button type="button" className={`${btn} absolute right-3 top-1/2 -translate-y-1/2`} aria-label="Next photo" onClick={() => go(1)}><ChevronRight className="h-5 w-5" aria-hidden="true" /></button>
            </>
          )}
        </div>

        {images.length > 1 && (
          <ul className="flex justify-center gap-2 p-3 sm:p-4" aria-label="Photo thumbnails">
            {images.map((src, n) => (
              <li key={src}>
                <button type="button" aria-label={`Show photo ${n + 1}`} aria-current={n === index} onClick={() => onIndex(n)} className={`block h-14 w-14 overflow-hidden rounded-md border-2 outline-none transition-opacity focus-visible:ring-2 focus-visible:ring-white sm:h-16 sm:w-16 ${n === index ? 'border-white' : 'border-transparent opacity-60 hover:opacity-100'}`}>
                  <img src={src} alt="" width={64} height={64} className="h-full w-full object-cover" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </m.div>
    </Overlay>
  )
}
