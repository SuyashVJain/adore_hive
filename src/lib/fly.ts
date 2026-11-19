/**
 * Fly-to-bag: a small copy of the product photo arcs to the bag icon (about 500ms).
 * Plain Web Animations, no library. Skipped under reduced motion or when no bag icon is visible.
 */
export function flyToBag(from: Element | null | undefined, src: string) {
  if (!from || typeof window === 'undefined' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const to = [...document.querySelectorAll<HTMLElement>('[data-bag-target]')].find((e) => e.getBoundingClientRect().width > 0)
  if (!to) return

  const a = from.getBoundingClientRect()
  const b = to.getBoundingClientRect()
  const size = 64
  const sx = a.left + a.width / 2 - size / 2
  const sy = a.top + a.height / 2 - size / 2
  const dx = b.left + b.width / 2 - size / 2 - sx
  const dy = b.top + b.height / 2 - size / 2 - sy

  const wrap = document.createElement('div')
  wrap.setAttribute('aria-hidden', 'true')
  Object.assign(wrap.style, { position: 'fixed', left: `${sx}px`, top: `${sy}px`, width: `${size}px`, height: `${size}px`, zIndex: '90', pointerEvents: 'none' })
  const img = new Image()
  img.alt = ''
  img.src = src
  Object.assign(img.style, { width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px', boxShadow: '0 6px 18px rgba(23,19,19,.25)' })
  wrap.append(img)
  document.body.append(wrap)

  const duration = 500
  // x and y use different easings, so the path bends into an arc
  wrap.animate([{ transform: 'translateX(0)' }, { transform: `translateX(${dx}px)` }], { duration, easing: 'cubic-bezier(.45,.05,.55,.95)', fill: 'forwards' })
  const done = img.animate(
    [{ transform: 'translateY(0) scale(1)', opacity: 1 }, { transform: `translateY(${dy}px) scale(.3)`, opacity: 0.5 }],
    { duration, easing: 'cubic-bezier(.4,-.45,.75,.6)', fill: 'forwards' },
  )
  done.onfinish = () => wrap.remove()
  done.oncancel = () => wrap.remove()
}
