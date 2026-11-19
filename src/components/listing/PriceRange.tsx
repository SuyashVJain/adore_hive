import { useEffect, useId, useState } from 'react'
import { PRICE_HI, PRICE_LO } from '@/lib/listing'
import { formatINR } from '@/lib/format'

interface Props {
  min?: number
  max?: number
  onCommit: (min?: number, max?: number) => void
}

const STEP = 50

/** Min and max inputs plus a two-thumb slider. Commits on release or blur so the URL isn't spammed. */
export function PriceRange({ min, max, onCommit }: Props) {
  const id = useId()
  const [lo, setLo] = useState(min ?? PRICE_LO)
  const [hi, setHi] = useState(max ?? PRICE_HI)
  // Text typed in an input before it is committed, so the field can be briefly empty or partial
  const [typed, setTyped] = useState<{ lo?: string; hi?: string }>({})
  useEffect(() => { setLo(min ?? PRICE_LO); setHi(max ?? PRICE_HI); setTyped({}) }, [min, max])

  /** Clamp to the catalogue range, keep min <= max, and fall back to the old value for junk input. */
  const commit = (a: number = lo, b: number = hi) => {
    const na = Number.isFinite(a) ? a : lo
    const nb = Number.isFinite(b) ? b : hi
    const x = Math.max(PRICE_LO, Math.min(PRICE_HI, Math.round(Math.min(na, nb))))
    const y = Math.max(PRICE_LO, Math.min(PRICE_HI, Math.round(Math.max(na, nb))))
    setLo(x); setHi(y); setTyped({})
    onCommit(x > PRICE_LO ? x : undefined, y < PRICE_HI ? y : undefined)
  }
  const pct = (v: number) => ((v - PRICE_LO) / (PRICE_HI - PRICE_LO)) * 100
  const done = { onPointerUp: () => commit(), onKeyUp: () => commit(), onBlur: () => commit() }

  const parse = (t: string, fallback: number) => (t.trim() === '' ? fallback : Number(t))
  const field = (which: 'lo' | 'hi', label: string, value: number) => (
    <div className="min-w-0 flex-1">
      <label htmlFor={`${id}-${which}`} className="mb-1 block text-xs text-muted">{label}</label>
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-base text-ink" aria-hidden="true">₹</span>
        <input
          id={`${id}-${which}`}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          autoComplete="off"
          aria-label={`${label} price in rupees`}
          value={typed[which] ?? String(value)}
          onChange={(e) => {
            const t = e.target.value.replace(/[^\d]/g, '')
            setTyped((s) => ({ ...s, [which]: t }))
            if (t !== '') (which === 'lo' ? setLo : setHi)(Number(t))
          }}
          onBlur={() => commit(which === 'lo' ? parse(typed.lo ?? String(lo), PRICE_LO) : lo, which === 'hi' ? parse(typed.hi ?? String(hi), PRICE_HI) : hi)}
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), (e.target as HTMLInputElement).blur())}
          className="h-14 w-full rounded-md border border-line-strong bg-surface pl-8 pr-2 text-base text-ink outline-none hover:border-ink focus:border-ink focus:ring-1 focus:ring-ink"
        />
      </div>
    </div>
  )

  const left = Math.min(lo, hi)
  const right = Math.max(lo, hi)
  return (
    <div>
      <div className="flex items-end gap-2">
        {field('lo', 'Min', lo)}
        <span className="pb-4 text-muted" aria-hidden="true">–</span>
        {field('hi', 'Max', hi)}
      </div>
      <div className="range-dual relative mt-3 h-11">
        <div className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-line" />
        <div className="absolute top-1/2 h-1 -translate-y-1/2 rounded-full bg-ink" style={{ left: `${pct(left)}%`, right: `${100 - pct(right)}%` }} />
        <input aria-label="Minimum price" aria-valuetext={formatINR(lo)} type="range" min={PRICE_LO} max={PRICE_HI} step={STEP} value={lo} style={{ zIndex: lo > (PRICE_LO + PRICE_HI) / 2 ? 3 : 2 }} onChange={(e) => setLo(Math.min(Number(e.target.value), hi))} {...done} />
        <input aria-label="Maximum price" aria-valuetext={formatINR(hi)} type="range" min={PRICE_LO} max={PRICE_HI} step={STEP} value={hi} style={{ zIndex: 2 }} onChange={(e) => setHi(Math.max(Number(e.target.value), lo))} {...done} />
      </div>
    </div>
  )
}
