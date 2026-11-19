import { useState } from 'react'
import { ChevronUp } from 'lucide-react'
import { HAMPER_NOTE_PRICE } from '@/config/shop'
import { hamperImage } from '@/data/hamper'
import { formatINR } from '@/lib/format'
import { boxOf, hamperTotals, letterContents, ribbonOf } from '@/lib/hamper'
import { useCountTo } from '@/lib/useCountTo'
import type { HamperDraft } from '@/store/hamper'

function Body({ d, showImage = true }: { d: HamperDraft; showImage?: boolean }) {
  const t = hamperTotals(d)
  const total = useCountTo(t.total)
  const row = 'flex items-baseline justify-between gap-4 text-sm'
  return (
    <div>
      {showImage && <img src={hamperImage} alt="" width={360} height={300} loading="lazy" className="aspect-[6/5] w-full rounded-lg object-cover" />}
      <div className={`${showImage ? 'mt-4 ' : ''}rounded-lg bg-page p-4 text-center`}>
        <p className="font-display text-2xl leading-snug">A little love, for {d.recipient.trim() || 'someone lovely'}</p>
        <p className="mt-1 text-sm text-muted">{d.occasion} · {boxOf(d).label} · {ribbonOf(d).label} ribbon</p>
      </div>

      <h3 className="eyebrow !text-ink mt-5 mb-2">Chosen with love</h3>
      {t.entries.length === 0 && !d.letter ? (
        <p className="text-sm text-muted">Nothing added yet. Pick a few little treasures in step 3.</p>
      ) : (
        <ul className="space-y-1.5 text-sm">
          {t.entries.map((e) => (
            <li key={e.t.id} className={row}><span>{e.t.name}{e.qty > 1 ? ` × ${e.qty}` : ''}</span><span>{formatINR(e.qty * e.t.price)}</span></li>
          ))}
          {d.letter && <li className={row}><span>{letterContents(d.letter).split(':')[0]}</span><span>{formatINR(d.letter.price)}</span></li>}
        </ul>
      )}

      <dl className="mt-4 space-y-2 border-t border-line pt-4">
        <div className={row}><dt className="text-muted">Gift box & ribbon</dt><dd>{formatINR(t.packaging)}</dd></div>
        <div className={row}><dt className="text-muted">Little treasures</dt><dd>{formatINR(t.treasures)}</dd></div>
        {d.note.on && <div className={row}><dt className="text-muted">Handwritten note</dt><dd>{formatINR(HAMPER_NOTE_PRICE)}</dd></div>}
        {d.letter && <div className={row}><dt className="text-muted">Handwritten letter</dt><dd>{formatINR(t.letter)}</dd></div>}
        <div className="flex items-baseline justify-between gap-4 border-t border-line pt-3">
          <dt className="eyebrow !text-ink">Your hamper · INR</dt>
          <dd className="text-2xl font-medium">{formatINR(total)}</dd>
        </div>
      </dl>
      <p className="mt-3 text-xs text-muted">Final details and availability are confirmed with you before we begin.</p>
    </div>
  )
}

/** Tablet and desktop: sticky side card. Totals update live as the draft changes. */
export function HamperSummaryAside({ d }: { d: HamperDraft }) {
  return (
    <aside aria-label="Your hamper summary" className="hidden md:block">
      <div className="sticky top-36 rounded-xl bg-surface p-5 lg:p-6">
        <h2 className="eyebrow !text-ink mb-4">Your little box of love</h2>
        <Body d={d} />
      </div>
    </aside>
  )
}

/** Mobile: collapsible bar fixed to the bottom, so the form is never pushed down by a big card. */
export function HamperSummaryBar({ d }: { d: HamperDraft }) {
  const [open, setOpen] = useState(false)
  const t = hamperTotals(d)
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-page md:hidden">
      <div id="hamper-summary-panel" hidden={!open} className="max-h-[65vh] overflow-y-auto p-5"><Body d={d} showImage={false} /></div>
      <button type="button" aria-expanded={open} aria-controls="hamper-summary-panel" onClick={() => setOpen((o) => !o)} className="flex min-h-16 w-full items-center justify-between gap-3 px-5 py-2 text-left">
        <span>
          <span className="block text-xs text-muted">Your hamper · {t.itemCount} {t.itemCount === 1 ? 'treasure' : 'treasures'}</span>
          <span className="block text-xl font-medium">{formatINR(t.total)}</span>
        </span>
        <span className="flex items-center gap-1 text-sm underline underline-offset-4">{open ? 'Hide' : 'Show'} summary <ChevronUp className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`} aria-hidden="true" /></span>
      </button>
    </div>
  )
}
