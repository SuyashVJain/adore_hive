import { useRef, useState, type ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Check, Flower2, Minus, Ribbon, Stamp } from 'lucide-react'
import { RequestForm } from '@/components/studio/RequestForm'
import { Breadcrumbs, Button, Field, Radio } from '@/components/ui'
import { LETTER_BASE_PRICE, LETTER_MAX, letterDecor, letterEnvelopes, letterPapers } from '@/config/shop'
import { images } from '@/data/images'
import type { CustomLine } from '@/lib/bag'
import { formatINR } from '@/lib/format'
import { useSeo } from '@/lib/useDocumentTitle'
import { useBag } from '@/store/bag'
import { useHamper } from '@/store/hamper'
import { letterErrors, letterPrice, useLetter, type LetterDraft } from '@/store/letter'
import { useToast } from '@/store/toast'

/** Visual choice tile: a real radio input (keyboard arrows work) with a drawn swatch. */
function Swatch({ name, value, checked, onChange, label, price, children }: { name: string; value: string; checked: boolean; onChange: () => void; label: string; price: number; children: ReactNode }) {
  return (
    <label className="group block cursor-pointer">
      <input type="radio" name={name} value={value} checked={checked} onChange={onChange} className="peer sr-only" />
      <span className="flex min-h-[116px] flex-col items-center justify-between gap-2 rounded-lg border-2 border-transparent bg-surface p-3 text-center transition-colors group-hover:border-line-strong peer-checked:border-ink peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ink">
        <span className="grid h-16 place-items-center">{children}</span>
        <span className="text-sm leading-tight">{label}<span className="block text-xs text-muted">{price ? `+ ${formatINR(price)}` : 'Included'}</span></span>
        <span className="sr-only">{checked ? ' (selected)' : ''}</span>
      </span>
    </label>
  )
}

const PaperArt = ({ color }: { color: string }) => <span className="block h-16 w-12 rounded-[3px] border border-line-strong shadow-sm" style={{ background: color }} aria-hidden="true" />
const EnvelopeArt = ({ color }: { color: string }) => (
  <svg viewBox="0 0 64 44" className="h-11 w-16" aria-hidden="true">
    <rect x="1" y="1" width="62" height="42" rx="3" fill={color} stroke="#8a7b7b" />
    <path d="M2 3l30 22L62 3" fill="none" stroke="#8a7b7b" />
  </svg>
)
const decorIcon = (id: string, cls = 'h-7 w-7') => {
  const p = { className: cls, 'aria-hidden': true as const }
  return id === 'floral' ? <Flower2 {...p} className={`${cls} text-[#c9707a]`} /> : id === 'wax-seal' ? <Stamp {...p} className={`${cls} text-[#a67c1a]`} /> : id === 'ribbon' ? <Ribbon {...p} className={`${cls} text-[#c9707a]`} /> : <Minus {...p} />
}

function Preview({ d }: { d: LetterDraft }) {
  const paper = letterPapers.find((p) => p.id === d.paper) ?? letterPapers[0]
  const env = letterEnvelopes.find((p) => p.id === d.envelope) ?? letterEnvelopes[0]
  const dec = letterDecor.find((p) => p.id === d.decor) ?? letterDecor[0]
  return (
    <figure aria-label="Letter preview">
      <div className="rounded-xl bg-blush p-4 sm:p-6">
        <div className="min-h-[300px] rounded-[4px] border border-[#c9a74d] p-6 shadow-sm sm:p-8" style={{ background: paper.color }}>
          {dec.id !== 'minimal' && <div className="mb-4">{decorIcon(dec.id, 'h-8 w-8')}</div>}
          <p className="font-script text-[1.75rem] leading-snug text-ink">Dear {d.to.trim() || 'you'},</p>
          <p className="mt-4 whitespace-pre-wrap break-words font-script text-[1.5rem] leading-[1.45] text-ink">{d.message}</p>
          <p className="mt-6 font-script text-[1.5rem] leading-snug text-ink">{d.signoff}<br />{d.from.trim()}</p>
        </div>
        <figcaption className="mt-4 flex items-center justify-center gap-2 text-center text-sm text-muted">
          <span className="inline-block h-3 w-3 rounded-full border border-line-strong" style={{ background: env.color }} aria-hidden="true" />
          {paper.label} · {env.label} · {dec.label}
        </figcaption>
      </div>
      <p className="mt-2 text-xs text-muted">Illustrative preview. Your exact message will be written by hand.</p>
    </figure>
  )
}

function toCustomLine(d: LetterDraft): CustomLine {
  const paper = letterPapers.find((p) => p.id === d.paper)?.label ?? ''
  const env = letterEnvelopes.find((p) => p.id === d.envelope)?.label ?? ''
  const dec = letterDecor.find((p) => p.id === d.decor)?.label ?? ''
  return {
    type: 'letter',
    name: `Handwritten letter for ${d.to.trim()}`,
    image: images.personal,
    price: letterPrice(d),
    subtitle: `${paper} · ${env}`,
    contents: [`Decoration: ${dec}`, `Message: “${d.message.trim().slice(0, 80)}${d.message.trim().length > 80 ? '…' : ''}”`, `Signed: ${d.signoff} ${d.from.trim()}`],
    href: '/letter-studio',
  }
}

export function LetterStudioPage() {
  useSeo('Handwritten letter studio', 'Write a handwritten letter: choose the paper, envelope and finishing touches, and see a live preview of your words.')
  const navigate = useNavigate()
  const d = useLetter((s) => s.draft)
  const patch = useLetter((s) => s.patch)
  const form = useRef<HTMLDivElement>(null)
  const [tried, setTried] = useState(false)
  const [done, setDone] = useState<null | 'bag' | 'hamper'>(null)
  const [showRequest, setShowRequest] = useState(false)
  const errors = letterErrors(d)
  const price = letterPrice(d)
  const paper = letterPapers.find((p) => p.id === d.paper)
  const dec = letterDecor.find((p) => p.id === d.decor)
  const shown = (k: 'to' | 'message' | 'from') => (tried ? errors[k] : undefined)

  const submit = () => {
    const first = (['to', 'message', 'from'] as const).find((k) => errors[k])
    if (first) {
      setTried(true)
      requestAnimationFrame(() => document.getElementById(`ls-${first}`)?.focus())
      return
    }
    if (d.mode === 'hamper') {
      useHamper.getState().patch({ letter: { paper: d.paper, envelope: d.envelope, decor: d.decor, to: d.to.trim(), message: d.message.trim(), signoff: d.signoff, from: d.from.trim(), instructions: d.instructions.trim(), price } })
      useToast.getState().show('Letter added to your hamper')
      setDone('hamper')
    } else {
      useBag.getState().addCustom(toCustomLine(d))
      useToast.getState().show('Letter added to bag')
      setDone('bag')
    }
  }

  const modeGroup = (
    <fieldset>
      <legend className="eyebrow !text-ink mb-2">What would you like to do with it?</legend>
      <Radio name="ls-mode" checked={d.mode === 'bag'} onChange={() => patch({ mode: 'bag' })}>Letter only</Radio>
      <Radio name="ls-mode" checked={d.mode === 'hamper'} onChange={() => patch({ mode: 'hamper' })}>Add to my hamper</Radio>
    </fieldset>
  )

  return (
    <div className="container-page pb-16 pt-5 md:pt-6">
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Customize Your Gift', to: '/hamper-studio' }, { label: 'Handwritten letters' }]} />
      <header className="py-6 text-center md:py-10">
        <p className="eyebrow mb-3">The handwritten letter studio</p>
        <h1 className="mx-auto max-w-4xl text-[2.25rem] leading-tight md:text-6xl">Some feelings are better written by hand.</h1>
        <p className="mx-auto mt-3 max-w-xl text-muted">For the words you want them to keep. Create a personal little keepsake, with every detail chosen by you.</p>
      </header>

      {done ? (
        <div role="status" className="mx-auto max-w-xl rounded-xl bg-blush p-8 text-center">
          <p className="flex items-center justify-center gap-2 font-display text-4xl"><Check className="h-7 w-7" aria-hidden="true" /> {done === 'bag' ? 'Added to your bag.' : 'Added to your hamper.'}</p>
          <p className="mt-3 text-muted">{done === 'bag' ? 'Your letter is in your bag with the choices you made.' : 'Your letter will be tucked into your hamper. Finish the rest in the hamper studio.'}</p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            {done === 'bag' ? <Button to="/bag">View bag</Button> : <Button onClick={() => navigate('/hamper-studio?step=4')}>Continue to my hamper</Button>}
            <Button variant="outline" onClick={() => setDone(null)}>Keep editing</Button>
          </div>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          <div ref={form} className="space-y-8">
            <img src={images.personal} alt="" width={616} height={250} className="aspect-[616/250] w-full rounded-xl object-cover" />

            <section aria-labelledby="ls-d">
              <p className="eyebrow !text-ink mb-2">01 / A canvas for your feelings</p>
              <h2 id="ls-d" className="text-[2rem] leading-tight md:text-4xl">Choose your little details.</h2>
              <fieldset className="mt-5"><legend className="eyebrow !text-ink mb-2">Paper</legend>
                <div className="grid grid-cols-3 gap-3">{letterPapers.map((p) => <Swatch key={p.id} name="ls-paper" value={p.id} checked={d.paper === p.id} onChange={() => patch({ paper: p.id })} label={p.label} price={p.price}><PaperArt color={p.color} /></Swatch>)}</div>
              </fieldset>
              <fieldset className="mt-5"><legend className="eyebrow !text-ink mb-2">Envelope style</legend>
                <div className="grid grid-cols-3 gap-3">{letterEnvelopes.map((p) => <Swatch key={p.id} name="ls-env" value={p.id} checked={d.envelope === p.id} onChange={() => patch({ envelope: p.id })} label={p.label} price={p.price}><EnvelopeArt color={p.color} /></Swatch>)}</div>
              </fieldset>
              <fieldset className="mt-5"><legend className="eyebrow !text-ink mb-2">Decorative elements</legend>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">{letterDecor.map((p) => <Swatch key={p.id} name="ls-decor" value={p.id} checked={d.decor === p.id} onChange={() => patch({ decor: p.id })} label={p.label} price={p.price}>{decorIcon(p.id)}</Swatch>)}</div>
              </fieldset>
            </section>

            <section aria-labelledby="ls-w">
              <p className="eyebrow !text-ink mb-2">02 / The words that matter</p>
              <h2 id="ls-w" className="text-[2rem] leading-tight md:text-4xl">Say it your way.</h2>
              <div className="mt-5 space-y-4">
                <Field id="ls-to" label="Dear… (recipient)" name="to" required maxLength={80} value={d.to} onChange={(e) => patch({ to: e.target.value })} error={shown('to')} />
                <div>
                  <Field multiline id="ls-message" label="Your message" name="message" required value={d.message} onChange={(e) => patch({ message: e.target.value })} error={shown('message')} />
                  <p aria-live="polite" className={`mt-1 text-right text-xs ${d.message.length > LETTER_MAX ? 'text-error' : 'text-muted'}`}>{d.message.length}/{LETTER_MAX}</p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field id="ls-signoff" label="Sign-off" name="signoff" maxLength={40} value={d.signoff} onChange={(e) => patch({ signoff: e.target.value })} />
                  <Field id="ls-from" label="Your name" name="from" required maxLength={80} value={d.from} onChange={(e) => patch({ from: e.target.value })} error={shown('from')} />
                </div>
                <Field multiline id="ls-instructions" label="Special instructions (optional)" name="instructions" value={d.instructions} onChange={(e) => patch({ instructions: e.target.value })} hint="Handwriting style, delivery timing, or anything else we should know." />
              </div>
            </section>

            {/* Mobile: preview sits under the words */}
            <div className="lg:hidden"><Preview d={d} /></div>

            <div className="space-y-5 rounded-xl bg-surface p-5 sm:p-6">
              {modeGroup}
              <dl className="space-y-2 border-t border-line pt-4 text-sm">
                <div className="flex justify-between gap-4"><dt className="text-muted">Handwritten letter</dt><dd>{formatINR(LETTER_BASE_PRICE)}</dd></div>
                {(paper?.price ?? 0) > 0 && <div className="flex justify-between gap-4"><dt className="text-muted">{paper?.label}</dt><dd>{formatINR(paper!.price)}</dd></div>}
                {(dec?.price ?? 0) > 0 && <div className="flex justify-between gap-4"><dt className="text-muted">{dec?.label}</dt><dd>{formatINR(dec!.price)}</dd></div>}
                <div className="flex items-baseline justify-between gap-4 border-t border-line pt-3"><dt className="eyebrow !text-ink">Your letter · INR</dt><dd className="text-2xl font-medium">{formatINR(price)}</dd></div>
              </dl>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button onClick={submit}>{d.mode === 'hamper' ? 'Add letter to my hamper' : `Add to bag · ${formatINR(price)}`}</Button>
                <Button variant="outline" aria-expanded={showRequest} onClick={() => setShowRequest((s) => !s)}>Send customization request</Button>
              </div>
              {showRequest && <RequestForm summary={`Handwritten letter${d.to ? ` for ${d.to}` : ''}, ${formatINR(price)}`} onClose={() => setShowRequest(false)} />}
              <p className="text-sm text-muted">Building a bigger gift? <Link to="/hamper-studio" className="text-ink underline underline-offset-4">Back to the hamper studio</Link>.</p>
            </div>
          </div>

          <aside aria-label="Letter preview" className="hidden lg:block">
            <div className="sticky top-24"><Preview d={d} /></div>
          </aside>
        </div>
      )}
    </div>
  )
}
