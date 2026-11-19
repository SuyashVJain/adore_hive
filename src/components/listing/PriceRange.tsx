import { useEffect, useId, useState } from 'react'
import { PRICE_HI, PRICE_LO } from '@/lib/listing'

interface Props {
  min?: number
  max?: number
  onCommit: (min?: number, max?: number) => void
}

const STEP = 50

/** Compact min/max inputs plus a two-thumb slider. Commits on release/blur so the URL isn't spammed. */
export function PriceRange({ min, max, onCommit }: Props) {
  const id = useId()
  const [lo, setLo] = useState(min ?? PRICE_LO)
  const [hi, setHi] = useState(max ?? PRICE_HI)
  useEffect(() => { setLo(min ?? PRICE_LO); setHi(max ?? PRICE_HI) }, [min, max])

  const commit = (a = lo, b = hi) => {
    const x = Math.max(PRICE_LO, Math.min(a, b))
    const y = Math.min(PRICE_HI, Math.max(a, b))
    setLo(x); setHi(y)
    onCommit(x > PRICE_LO ? x : undefined, y < PRICE_HI ? y : undefined)
  }
  const pct = (v: number) => ((v - PRICE_LO) / (PRICE_HI - PRICE_LO)) * 100
  const num = 'h-11 w-full rounded-md border border-line-strong bg-surface px-3 text-sm outline-none hover:border-ink focus:border-ink focus:ring-1 focus:ring-ink'
  const done = { onPointerUp: () => commit(), onKeyUp: () => commit(), onBlur: () => commit() }

  return (
    <div>
      <div className="flex items-center gap-2">
        <label className="flex-1 text-xs text-muted">
          <span className="sr-only">Minimum price in rupees</span>Min ₹
          <input inputMode="numeric" type="number" min={PRICE_LO} max={PRICE_HI} step={STEP} value={lo} className={`${num} mt-1`} onChange={(e) => setLo(Number(e.target.value))} onBlur={() => commit()} onKeyDown={(e) => e.key === 'Enter' && commit()} />
        </label>
        <span className="mt-5 text-muted" aria-hidden="true">–</span>
        <label className="flex-1 text-xs text-muted">
          <span className="sr-only">Maximum price in rupees</span>Max ₹
          <input inputMode="numeric" type="number" min={PRICE_LO} max={PRICE_HI} step={STEP} value={hi} className={`${num} mt-1`} onChange={(e) => setHi(Number(e.target.value))} onBlur={() => commit()} onKeyDown={(e) => e.key === 'Enter' && commit()} />
        </label>
      </div>
      <div className="range-dual relative mt-3 h-11">
        <div className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 rounded bg-line" />
        <div className="absolute top-1/2 h-1 -translate-y-1/2 rounded bg-ink" style={{ left: `${pct(Math.min(lo, hi))}%`, right: `${100 - pct(Math.max(lo, hi))}%` }} />
        <input aria-label="Minimum price" id={`${id}-a`} type="range" min={PRICE_LO} max={PRICE_HI} step={STEP} value={lo} onChange={(e) => setLo(Math.min(Number(e.target.value), hi))} {...done} />
        <input aria-label="Maximum price" id={`${id}-b`} type="range" min={PRICE_LO} max={PRICE_HI} step={STEP} value={hi} onChange={(e) => setHi(Math.max(Number(e.target.value), lo))} {...done} />
      </div>
    </div>
  )
}
