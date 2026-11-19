import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Check, Plus } from 'lucide-react'
import { HamperSummaryAside, HamperSummaryBar } from '@/components/studio/HamperSummary'
import { RequestForm } from '@/components/studio/RequestForm'
import { StepIndicator } from '@/components/studio/StepIndicator'
import { Breadcrumbs, Button, Checkbox, Chip, Field, QuantityStepper } from '@/components/ui'
import { DateField } from '@/components/ui/DateField'
import { SelectField } from '@/components/ui/SelectField'
import { HAMPER_NOTE_PRICE, NOTE_MAX, hamperBoxes, hamperOccasions, hamperRibbons } from '@/config/shop'
import { hamperImage, treasureGroups, treasures, type Treasure } from '@/data/hamper'
import { formatINR } from '@/lib/format'
import { hamperContents, hamperToCustomLine, hamperTotals, letterContents, maxStep, stepErrors, summaryText } from '@/lib/hamper'
import { useSeo } from '@/lib/useDocumentTitle'
import { meta } from '@/seo/routes'
import { useBag } from '@/store/bag'
import { useHamper } from '@/store/hamper'
import { useToast } from '@/store/toast'

const eyebrowCls = 'eyebrow !text-ink mb-2'
const h2Cls = 'text-[2rem] leading-tight md:text-5xl'

export function HamperStudioPage() {
  useSeo(meta.hamper.title, meta.hamper.description)
  const [sp, setSp] = useSearchParams()
  const draft = useHamper((s) => s.draft)
  const max = maxStep(draft)
  const requested = Number(sp.get('step')) || 1
  const step = Math.min(Math.max(1, requested), max)
  const [tried, setTried] = useState(false)
  const [confirmReset, setConfirmReset] = useState(false)
  const [added, setAdded] = useState(false)
  const [showRequest, setShowRequest] = useState(false)

  // A locked step in the URL falls back to the furthest valid one
  useEffect(() => {
    if (requested !== step) setSp({ step: String(step) }, { replace: true })
  }, [requested, step, setSp])

  const errors = stepErrors(draft, step)
  const go = (n: number) => {
    setTried(false)
    setSp({ step: String(n) })
    requestAnimationFrame(() => { window.scrollTo({ top: 0 }); document.getElementById('studio-h')?.focus() })
  }
  const next = () => {
    const first = Object.keys(errors)[0]
    if (first) {
      setTried(true)
      requestAnimationFrame(() => document.getElementById(`hs-${first}`)?.focus())
      return
    }
    go(step + 1)
  }
  const shown = (k: string) => (tried ? errors[k] : undefined)

  const startOver = () => {
    useHamper.getState().reset()
    setConfirmReset(false); setAdded(false); setShowRequest(false); setTried(false)
    setSp({ step: '1' })
  }

  const addToBag = () => {
    useBag.getState().addCustom(hamperToCustomLine(draft))
    useToast.getState().show('Hamper added to bag')
    useHamper.getState().reset()
    setAdded(true)
  }

  return (
    <div className="container-page pb-32 pt-5 md:pb-16 md:pt-6">
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Customize Your Gift' }]} />
      <header className="py-6 text-center md:py-10">
        <p className="eyebrow mb-3">The Adore personalization studio</p>
        <h1 className="text-[2.5rem] leading-tight md:text-6xl">Made Especially for You</h1>
        <p className="mx-auto mt-3 max-w-xl text-muted">A gift with their name on it, and your heart in every detail. Build a lovely little hamper, one thoughtful choice at a time.</p>
      </header>

      {added ? (
        <div role="status" className="mx-auto max-w-xl rounded-xl bg-blush p-8 text-center">
          <p className="flex items-center justify-center gap-2 font-display text-4xl"><Check className="h-7 w-7" aria-hidden="true" /> Added to your bag.</p>
          <p className="mt-3 text-muted">Your hamper is in your bag with everything you chose.</p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Button to="/bag">View bag</Button>
            <Button variant="outline" onClick={startOver}>Start another hamper</Button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-end justify-between gap-4">
            <div className="min-w-0 flex-1"><StepIndicator current={step} max={max} onGo={go} /></div>
            <div className="shrink-0 text-right">
              {confirmReset ? (
                <span className="flex items-center gap-2 text-sm">
                  Clear everything?
                  <button type="button" onClick={startOver} className="inline-flex min-h-11 items-center underline underline-offset-4">Yes, start over</button>
                  <button type="button" onClick={() => setConfirmReset(false)} className="inline-flex min-h-11 items-center text-muted underline underline-offset-4">Keep it</button>
                </span>
              ) : (
                <button type="button" onClick={() => setConfirmReset(true)} className="inline-flex min-h-11 items-center text-sm text-muted underline underline-offset-4 hover:text-ink">Start over</button>
              )}
            </div>
          </div>

          <div className="mt-8 grid gap-8 md:grid-cols-[1fr_300px] lg:grid-cols-[1fr_380px] lg:gap-12">
            <section aria-labelledby="studio-h" className="min-w-0">
              {step === 1 && <Occasion shown={shown} />}
              {step === 2 && <Packaging />}
              {step === 3 && <Treasures shown={shown} />}
              {step === 4 && <NoteStep shown={shown} />}
              {step === 5 && <Review go={go} onAdd={addToBag} showRequest={showRequest} setShowRequest={setShowRequest} />}

              <div className="mt-10 flex flex-col-reverse gap-3 border-t border-line pt-6 sm:flex-row sm:justify-between">
                {step > 1 ? <Button variant="outline" onClick={() => go(step - 1)}>Previous</Button> : <span />}
                {step < 5 && <Button onClick={next}>Save & continue</Button>}
              </div>
            </section>
            <HamperSummaryAside d={draft} />
          </div>
          <HamperSummaryBar d={draft} />
        </>
      )}
    </div>
  )
}

type Shown = (k: string) => string | undefined

function Occasion({ shown }: { shown: Shown }) {
  const d = useHamper((s) => s.draft)
  const patch = useHamper((s) => s.patch)
  const today = new Date().toISOString().slice(0, 10)
  return (
    <div>
      <p className={eyebrowCls}>01 / The reason to celebrate</p>
      <h2 id="studio-h" tabIndex={-1} className={`${h2Cls} outline-none`}>Who are we making smile?</h2>
      <p className="mt-3 text-muted">Big milestones, small moments: every reason is a lovely one.</p>
      <div role="group" aria-label="Occasion" className="mt-6 flex flex-wrap gap-2">
        {hamperOccasions.map((o) => <Chip key={o} selected={d.occasion === o} onClick={() => patch({ occasion: o })}>{o}</Chip>)}
      </div>
      <div className="mt-6 space-y-4">
        <Field id="hs-recipient" label="Recipient name" name="recipient" autoComplete="off" required maxLength={80} value={d.recipient} onChange={(e) => patch({ recipient: e.target.value })} error={shown('recipient')} />
        <DateField id="hs-date" label="Occasion date (optional)" name="date" min={today} value={d.date} onChange={(iso) => patch({ date: iso })} error={shown('date')} hint="Type dd-mm-yyyy or use the calendar. If you need it by a particular day, tell us here." />
      </div>
    </div>
  )
}

function Packaging() {
  const d = useHamper((s) => s.draft)
  const patch = useHamper((s) => s.patch)
  return (
    <div>
      <p className={eyebrowCls}>02 / The first little impression</p>
      <h2 id="studio-h" tabIndex={-1} className={`${h2Cls} outline-none`}>Wrapped in a little lovely.</h2>
      <p className="mt-3 text-muted">Choose a home for your thoughtful little treasures.</p>
      <img src={hamperImage} alt="" width={560} height={300} className="mt-6 aspect-[16/8] w-full rounded-xl object-cover" />
      <div role="group" aria-label="Box" className="mt-6">
        <p className={eyebrowCls}>Box</p>
        <div className="flex flex-wrap gap-2">
          {hamperBoxes.map((b) => <Chip key={b.id} selected={d.box === b.id} onClick={() => patch({ box: b.id })}>{`${b.label} · ${formatINR(b.price)}`}</Chip>)}
        </div>
      </div>
      <div role="group" aria-label="Ribbon and finish" className="mt-6">
        <p className={eyebrowCls}>Ribbon & finish</p>
        <div className="flex flex-wrap gap-2">
          {hamperRibbons.map((r) => <Chip key={r.id} selected={d.ribbon === r.id} onClick={() => patch({ ribbon: r.id })}>{`${r.label} · ${formatINR(r.price)}`}</Chip>)}
        </div>
      </div>
    </div>
  )
}

function TreasureRow({ t }: { t: Treasure }) {
  const item = useHamper((s) => s.draft.items[t.id])
  const setItem = useHamper((s) => s.setItem)
  const add = () => setItem(t.id, { qty: 1, options: Object.fromEntries(t.options.map((o) => [o.name, o.values[0]])) })
  return (
    <li className={`rounded-lg border p-3 ${item ? 'border-ink bg-surface' : 'border-line bg-surface'}`}>
      <div className="flex gap-4">
        <img src={t.image} alt="" width={85} height={96} loading="lazy" className="h-24 w-[85px] shrink-0 rounded-md object-cover" />
        <div className="min-w-0 flex-1">
          <h3 className="font-product text-lg leading-snug">{t.name}</h3>
          <p className="text-sm text-muted">{t.subtitle}</p>
          <p className="mt-1 text-sm font-medium">{formatINR(t.price)}</p>
        </div>
      </div>
      {item ? (
        <div className="mt-3 space-y-3">
          {t.options.length > 0 && (
            <div className="grid gap-3 sm:grid-cols-2">
              {t.options.map((o) => (
                <SelectField key={o.name} label={o.name} options={o.values} value={item.options[o.name]} onChange={(e) => setItem(t.id, { ...item, options: { ...item.options, [o.name]: e.target.value } })} />
              ))}
            </div>
          )}
          <div className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-1.5 text-sm"><Check className="h-4 w-4" aria-hidden="true" /> Added</span>
            <QuantityStepper value={item.qty} onChange={(n) => setItem(t.id, { ...item, qty: n })} label={`${t.name} quantity`} />
            <button type="button" onClick={() => setItem(t.id, null)} aria-label={`Remove ${t.name} from hamper`} className="inline-flex min-h-11 items-center px-2 text-sm text-muted underline underline-offset-4 hover:text-ink">Remove</button>
          </div>
        </div>
      ) : (
        <Button variant="outline" full className="mt-3" onClick={add} aria-label={`Add ${t.name} to hamper`}>Add <Plus className="h-3.5 w-3.5" aria-hidden="true" /></Button>
      )}
    </li>
  )
}

function Treasures({ shown }: { shown: Shown }) {
  const [group, setGroup] = useState<string>('All')
  const list = group === 'All' ? treasures : treasures.filter((t) => t.group === group)
  const err = shown('items')
  return (
    <div>
      <p className={eyebrowCls}>03 / Fill it with their favourites</p>
      <h2 id="studio-h" tabIndex={-1} className={`${h2Cls} outline-none`}>Little things. Lovely together.</h2>
      <div role="group" aria-label="Filter treasures" className="mt-6 flex flex-wrap gap-2">
        {['All', ...treasureGroups].map((g) => <Chip key={g} selected={group === g} onClick={() => setGroup(g)}>{g}</Chip>)}
      </div>
      <p id="hs-items" tabIndex={-1} role={err ? 'alert' : undefined} className={`mt-4 min-h-6 text-sm outline-none ${err ? 'text-error' : 'text-muted'}`}>{err ?? 'Add one or more little treasures.'}</p>
      <ul className="mt-2 space-y-3">{list.map((t) => <TreasureRow key={t.id} t={t} />)}</ul>
    </div>
  )
}

function NoteStep({ shown }: { shown: Shown }) {
  const d = useHamper((s) => s.draft)
  const patchNote = useHamper((s) => s.patchNote)
  const patch = useHamper((s) => s.patch)
  const n = d.note
  // Start the note addressed to the recipient
  useEffect(() => {
    if (!n.to && d.recipient) patchNote({ to: d.recipient })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <div>
      <p className={eyebrowCls}>04 / Say it your way</p>
      <h2 id="studio-h" tabIndex={-1} className={`${h2Cls} outline-none`}>The part only you can add.</h2>
      <div role="group" aria-label="Handwritten note" className="mt-6 flex flex-wrap gap-2">
        <Chip selected={n.on} onClick={() => patchNote({ on: true })}>{`Add a handwritten note · ${formatINR(HAMPER_NOTE_PRICE)}`}</Chip>
        <Chip selected={!n.on} onClick={() => patchNote({ on: false })}>No note</Chip>
      </div>
      <div className="mt-5 space-y-4">
        {n.on && (
          <>
            <Field id="hs-to" label="To / recipient name" name="to" required maxLength={80} value={n.to} onChange={(e) => patchNote({ to: e.target.value })} error={shown('to')} />
            <div>
              <Field multiline id="hs-message" label="Your personalized message" name="message" required value={n.message} onChange={(e) => patchNote({ message: e.target.value })} error={shown('message')} />
              <p id="hs-count" aria-live="polite" className={`mt-1 text-right text-xs ${n.message.length > NOTE_MAX ? 'text-error' : 'text-muted'}`}>{n.message.length}/{NOTE_MAX}</p>
            </div>
            <Field id="hs-from" label="From / signature" name="from" required maxLength={80} value={n.from} onChange={(e) => patchNote({ from: e.target.value })} error={shown('from')} />
          </>
        )}
        <Field multiline id="hs-instructions" label="Special instructions (optional)" name="instructions" value={n.instructions} onChange={(e) => patchNote({ instructions: e.target.value })} hint="Favourite colours, preferred combinations, or anything we should know." />
        <div>
          <Checkbox checked={n.includePrices} onChange={(e) => patchNote({ includePrices: e.target.checked })}>Include prices in the hamper</Checkbox>
          <Checkbox checked={n.surprise} onChange={(e) => patchNote({ surprise: e.target.checked })}>Keep it a surprise (we’ll contact only you)</Checkbox>
        </div>
        <div className="rounded-lg bg-blush p-4 text-sm">
          {d.letter ? (
            <p>Your handwritten letter to {d.letter.to} is attached. <button type="button" onClick={() => patch({ letter: null })} className="underline underline-offset-4">Remove it</button></p>
          ) : (
            <p>Want something longer than a note? <Link to="/letter-studio" className="underline underline-offset-4">Write a handwritten letter</Link> and add it to this hamper.</p>
          )}
        </div>
      </div>
    </div>
  )
}

function Review({ go, onAdd, showRequest, setShowRequest }: { go: (n: number) => void; onAdd: () => void; showRequest: boolean; setShowRequest: (b: boolean) => void }) {
  const d = useHamper((s) => s.draft)
  const t = hamperTotals(d)
  const contents = hamperContents(d)
  const edit = (n: number) => <button type="button" onClick={() => go(n)} className="inline-flex min-h-11 items-center text-sm underline underline-offset-4 hover:no-underline">Edit<span className="sr-only"> step {n}</span></button>
  const row = 'flex items-start justify-between gap-4 border-b border-line py-3'
  return (
    <div>
      <p className={eyebrowCls}>05 / Ready for a little magic?</p>
      <h2 id="studio-h" tabIndex={-1} className={`${h2Cls} outline-none`}>Check your hamper.</h2>
      <p className="mt-3 text-muted">Look over the details below. You can add it to your bag, or send us a customization request to talk it through first.</p>
      <dl className="mt-6">
        <div className={row}><div><dt className="eyebrow !text-ink">Occasion</dt><dd className="mt-1 text-sm">{d.occasion} for {d.recipient}{d.date ? `, ${new Date(d.date + 'T00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}` : ''}</dd></div>{edit(1)}</div>
        <div className={row}><div><dt className="eyebrow !text-ink">Packaging</dt><dd className="mt-1 text-sm">{contents[0]}</dd></div>{edit(2)}</div>
        <div className={row}><div><dt className="eyebrow !text-ink">Little treasures · {t.itemCount}</dt><dd className="mt-1 text-sm">{t.entries.map((e) => `${e.t.name}${e.qty > 1 ? ` × ${e.qty}` : ''}`).join(', ')}</dd></div>{edit(3)}</div>
        <div className={row}><div><dt className="eyebrow !text-ink">Your note</dt><dd className="mt-1 text-sm">{d.note.on ? <>To {d.note.to}: “{d.note.message}” From {d.note.from}</> : 'No note'}{d.note.instructions ? <span className="block text-muted">Instructions: {d.note.instructions}</span> : null}</dd></div>{edit(4)}</div>
        {d.letter && <div className={row}><div><dt className="eyebrow !text-ink">Letter</dt><dd className="mt-1 text-sm">{letterContents(d.letter)}</dd></div><Link to="/letter-studio" className="inline-flex min-h-11 items-center text-sm underline underline-offset-4">Edit</Link></div>}
      </dl>
      <p className="mt-5 text-lg">Total <strong className="font-medium">{formatINR(t.total)}</strong></p>
      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <Button onClick={onAdd}>Add to bag · {formatINR(t.total)}</Button>
        <Button variant="outline" aria-expanded={showRequest} onClick={() => setShowRequest(!showRequest)}>Send customization request</Button>
      </div>
      {showRequest && <div className="mt-5"><RequestForm summary={summaryText(d)} onClose={() => setShowRequest(false)} /></div>}
    </div>
  )
}
