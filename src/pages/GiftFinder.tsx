import { useRef, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Breadcrumbs, Button } from '@/components/ui'
import { occasions, recipients } from '@/data/products'
import { applyFilters, emptyFilters } from '@/lib/listing'
import { useSeo } from '@/lib/useDocumentTitle'
import { products } from '@/data/products'
import { meta } from '@/seo/routes'

const budgets = [
  { id: 'u500', label: 'Under ₹500', max: 499 },
  { id: '500-1000', label: '₹500 to ₹1,000', min: 500, max: 1000 },
  { id: '1000-2000', label: '₹1,000 to ₹2,000', min: 1000, max: 2000 },
  { id: '2000+', label: '₹2,000 and above', min: 2000 },
  { id: 'any', label: 'Anything goes' },
] as const

type Answers = { who: string; occasion: string; budget: string }
const empty: Answers = { who: '', occasion: '', budget: '' }

const steps = [
  { key: 'who', title: 'Who is it for?', hint: 'Tell us a little about them.', options: recipients.map((r) => ({ id: r.slug, label: r.label })) },
  { key: 'occasion', title: 'What are you celebrating?', hint: 'Big or small, every reason counts.', options: occasions.map((o) => ({ id: o.slug, label: o.label })) },
  { key: 'budget', title: 'What feels right to spend?', hint: 'We will keep it within your budget.', options: budgets.map((b) => ({ id: b.id, label: b.label })) },
] as const

function toQuery(a: Answers) {
  const b = budgets.find((x) => x.id === a.budget)
  const sp = new URLSearchParams()
  if (a.who) sp.set('for', a.who)
  if (a.occasion) sp.set('occasion', a.occasion)
  if (b && 'min' in b && b.min) sp.set('min', String(b.min))
  if (b && 'max' in b && b.max) sp.set('max', String(b.max))
  sp.set('finder', '1')
  return sp
}

/** Three quick questions, then a filtered Shop page. Native radios inside a fieldset, so arrows, Space and Enter work. */
export function GiftFinder() {
  useSeo(meta.giftFinder.title, meta.giftFinder.description)
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [a, setA] = useState<Answers>(empty)
  const heading = useRef<HTMLHeadingElement>(null)
  const s = steps[step]
  const value = a[s.key]

  const go = (n: number) => { setStep(n); requestAnimationFrame(() => heading.current?.focus()) }
  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (!value) return
    if (step < steps.length - 1) return go(step + 1)
    navigate(`/shop?${toQuery(a).toString()}`)
  }

  // Live count on the last step, so there are no surprises
  const b = budgets.find((x) => x.id === a.budget)
  const matches = step === 2 && a.budget
    ? applyFilters(products, { ...emptyFilters(), recipient: a.who as never, occasions: a.occasion ? [a.occasion as never] : [], min: b && 'min' in b ? b.min : undefined, max: b && 'max' in b ? b.max : undefined }).length
    : null

  return (
    <div className="container-page pb-44 pt-5 md:pb-20 md:pt-6">
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Gift finder' }]} />
      <div className="mx-auto max-w-2xl py-8 md:py-14">
        <p className="eyebrow mb-3 text-center">Gift finder</p>
        <p className="mb-6 text-center text-sm text-muted" aria-live="polite">Step {step + 1} of {steps.length}</p>
        <div className="mx-auto mb-8 flex max-w-xs gap-1.5" aria-hidden="true">
          {steps.map((_, i) => <span key={i} className={`h-1 flex-1 rounded-full transition-colors ${i <= step ? 'bg-ink' : 'bg-line'}`} />)}
        </div>

        <form onSubmit={submit} key={s.key}>
          <fieldset>
            <legend className="w-full text-center">
              <h1 ref={heading} tabIndex={-1} className="text-[2rem] leading-tight outline-none md:text-5xl">{s.title}</h1>
              <span className="mt-2 block text-muted">{s.hint}</span>
            </legend>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {s.options.map((o) => (
                <label key={o.id} className="group block cursor-pointer">
                  <input type="radio" name={s.key} value={o.id} checked={value === o.id} onChange={() => setA({ ...a, [s.key]: o.id })} className="peer sr-only" />
                  <span className="flex min-h-14 items-center justify-center rounded-lg border border-edge bg-white px-4 py-3 text-center text-base transition-colors group-hover:border-line-strong peer-checked:border-ink peer-checked:bg-blush peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ink">
                    {o.label}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          {matches !== null && (
            <p role="status" className="mt-5 text-center text-sm text-muted">{matches === 0 ? 'Nothing matches exactly, but we will show you the closest lovelies.' : `${matches} lovely ${matches === 1 ? 'idea' : 'ideas'} match so far.`}</p>
          )}

          <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
            {step > 0 ? <Button variant="outline" onClick={() => go(step - 1)}><ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back</Button> : <span />}
            <Button type="submit" disabled={!value}>{step < steps.length - 1 ? 'Continue' : 'Show my gifts'}</Button>
          </div>
        </form>

        {(step > 0 || a.who) && (
          <p className="mt-6 text-center text-sm">
            <button type="button" onClick={() => { setA(empty); go(0) }} className="inline-flex min-h-11 items-center text-muted underline underline-offset-4 hover:text-ink">Start again</button>
          </p>
        )}
      </div>
    </div>
  )
}
