import type { Transition, Variants } from 'framer-motion'

// One place to tune motion. Soft and subtle: short durations, a gentle ease-out, no bounce.
// Reduced motion is handled globally by <MotionConfig reducedMotion="user"> in main.tsx:
// transforms are dropped and only opacity changes remain.

export const ease = [0.22, 1, 0.36, 1] as const

export const dur = { fast: 0.2, base: 0.35, slow: 0.5 } as const

export const tween = (duration: number = dur.base, delay = 0): Transition => ({ duration, ease, delay })

/** Section reveal: a short rise and fade. Transform and opacity only, so it never shifts layout. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: tween(dur.slow) },
}

export const fade: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: tween(dur.base) },
}

/** Parent variant that staggers its children (hero text). */
export const stagger = (gap = 0.07, delay = 0.04): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: gap, delayChildren: delay } },
})

export const overlayFade = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: tween(dur.base) },
  exit: { opacity: 0, transition: tween(dur.fast) },
}

export const panel = {
  right: { initial: { x: '100%' }, animate: { x: 0, transition: tween(dur.slow) }, exit: { x: '100%', transition: tween(dur.base) } },
  left: { initial: { x: '-100%' }, animate: { x: 0, transition: tween(dur.slow) }, exit: { x: '-100%', transition: tween(dur.base) } },
  bottom: { initial: { y: '100%' }, animate: { y: 0, transition: tween(dur.slow) }, exit: { y: '100%', transition: tween(dur.base) } },
}

export const dialog = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0, transition: tween(dur.base) },
  exit: { opacity: 0, y: 8, transition: tween(dur.fast) },
}

export const toast = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: tween(dur.base) },
  exit: { opacity: 0, y: 8, transition: tween(dur.fast) },
}

export const collapse = {
  initial: { height: 0, opacity: 0 },
  animate: { height: 'auto', opacity: 1, transition: tween(dur.base) },
  exit: { height: 0, opacity: 0, transition: tween(dur.fast) },
}
