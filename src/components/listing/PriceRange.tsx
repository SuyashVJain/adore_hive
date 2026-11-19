import { useEffect, useId, useState } from 'react'
import * as Slider from '@radix-ui/react-slider'
import { labelCls } from '@/components/ui/controls'
import { formatINR } from '@/lib/format'
import { PRICE_HI, PRICE_LO } from '@/lib/listing'

interface Props {
  min?: number
  max?: number
  onCommit: (min?: number, max?: number) => void
}

const STEP = 50

/** Min and max inputs plus a Radix two-thumb slider. Commits on release, Enter or blur so the URL isn't spammed. */
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
  const parse = (t: string | undefined, fallback: number, bound: number) => (t === undefined ? fallback : t.trim() === '' ? bound : Number(t))

  const field = (which: 'lo' | 'hi', label: string, value: number) => (
    <div className="min-w-0 flex-1">
      <label htmlFor={`${id}-${which}`} className={labelCls}>{label}</label>
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted" aria-hidden="true">₹</span>
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
          onBlur={() => commit(which === 'lo' ? parse(typed.lo, lo, PRICE_LO) : lo, which === 'hi' ? parse(typed.hi, hi, PRICE_HI) : hi)}
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), (e.target as HTMLInputElement).blur())}
          className="h-12 w-full rounded-md border border-edge bg-white pl-7 pr-2 text-base text-ink outline-none hover:border-line-strong focus-visible:border-ink focus-visible:ring-1 focus-visible:ring-ink"
        />
      </div>
    </div>
  )

  const thumb =
    'relative block h-5 w-5 rounded-full border-[1.5px] border-ink bg-white shadow-thumb outline-none transition-transform duration-150 before:absolute before:-inset-3.5 before:content-[\'\'] hover:scale-110 focus-visible:ring-[3px] focus-visible:ring-rose motion-reduce:transition-none motion-reduce:hover:scale-100'

  return (
    <div>
      <div className="flex items-end gap-2">
        {field('lo', 'Min', lo)}
        <span className="mb-[23px] h-px w-3 shrink-0 bg-line-strong" aria-hidden="true" />
        {field('hi', 'Max', hi)}
      </div>
      {/* 16px of side padding keeps the end handles clear of neighbouring controls */}
      <div className="px-4 pt-5">
        <Slider.Root
          className="relative flex h-11 w-full touch-none select-none items-center"
          min={PRICE_LO}
          max={PRICE_HI}
          step={STEP}
          minStepsBetweenThumbs={0}
          value={[Math.min(lo, hi), Math.max(lo, hi)]}
          onValueChange={([a, b]) => { setLo(a); setHi(b); setTyped({}) }}
          onValueCommit={([a, b]) => commit(a, b)}
        >
          <Slider.Track className="relative h-0.5 grow rounded-full bg-line">
            <Slider.Range className="absolute h-full rounded-full bg-ink" />
          </Slider.Track>
          <Slider.Thumb className={thumb} aria-label="Minimum price" aria-valuetext={formatINR(Math.min(lo, hi))} />
          <Slider.Thumb className={thumb} aria-label="Maximum price" aria-valuetext={formatINR(Math.max(lo, hi))} />
        </Slider.Root>
      </div>
    </div>
  )
}
