import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { ChevronDown, Loader2 } from 'lucide-react'
import { CheckoutSummary } from '@/components/checkout/CheckoutSummary'
import { Button, Checkbox, Field, Radio } from '@/components/ui'
import { SelectField } from '@/components/ui/SelectField'
import { SHIPPING_FEE, delivery } from '@/config/shop'
import { indianStates } from '@/config/india'
import { formatINR } from '@/lib/format'
import { mockPay, type PaymentMethod } from '@/lib/payment'
import { useDocumentTitle } from '@/lib/useDocumentTitle'
import { isCardExpiry, isCardNumber, isCvc, isEmail, isPhone, isPin, isUpi, normalisePhone } from '@/lib/validate'
import { useBag, useBagSummary } from '@/store/bag'
import { useAuth, useCurrentUser } from '@/store/auth'
import { newOrderId, useOrders, type Order } from '@/store/orders'

// Address-and-contact draft survives a refresh in sessionStorage. Payment fields are NEVER persisted.
const DRAFT_KEY = 'adore-checkout-draft'

interface Form {
  email: string; phone: string
  firstName: string; lastName: string; address: string; apartment: string; city: string; state: string; pin: string
  delivery: 'standard' | 'special'
  payment: PaymentMethod
  upi: string; cardNumber: string; cardExpiry: string; cardCvc: string
  note: string
  terms: boolean
  saveAddress: boolean
}
type Key = keyof Form

const PERSISTED: Key[] = ['email', 'phone', 'firstName', 'lastName', 'address', 'apartment', 'city', 'state', 'pin', 'delivery', 'note']

const blank: Form = {
  email: '', phone: '', firstName: '', lastName: '', address: '', apartment: '', city: '', state: '', pin: '',
  delivery: 'standard', payment: 'UPI', upi: '', cardNumber: '', cardExpiry: '', cardCvc: '', note: '', terms: false, saveAddress: false,
}

function loadDraft(): Partial<Form> {
  try {
    const raw = sessionStorage.getItem(DRAFT_KEY)
    if (!raw) return {}
    const d = JSON.parse(raw) as Record<string, unknown>
    return Object.fromEntries(PERSISTED.filter((k) => typeof d[k] === 'string').map((k) => [k, d[k]]))
  } catch {
    return {}
  }
}

/** Field order, used for the error summary and for focusing the first invalid field. */
const ORDER: Key[] = ['email', 'phone', 'firstName', 'lastName', 'address', 'city', 'state', 'pin', 'upi', 'cardNumber', 'cardExpiry', 'cardCvc', 'terms']
const LABEL: Partial<Record<Key, string>> = {
  email: 'Email address', phone: 'Phone number', firstName: 'First name', lastName: 'Last name', address: 'Address', city: 'City', state: 'State',
  pin: 'PIN code', upi: 'UPI ID', cardNumber: 'Card number', cardExpiry: 'Expiry', cardCvc: 'CVC', terms: 'Terms and Conditions',
}

function validate(f: Form): Partial<Record<Key, string>> {
  const e: Partial<Record<Key, string>> = {}
  if (!f.email.trim()) e.email = 'Enter your email address.'
  else if (!isEmail(f.email)) e.email = 'That email does not look right. Check it for typos.'
  if (!f.phone.trim()) e.phone = 'Enter a phone number so we can reach you about your order.'
  else if (!isPhone(f.phone)) e.phone = 'Enter a 10-digit Indian mobile number.'
  if (!f.firstName.trim()) e.firstName = 'Enter your first name.'
  if (!f.lastName.trim()) e.lastName = 'Enter your last name.'
  if (!f.address.trim()) e.address = 'Enter your house, flat or building and street.'
  if (!f.city.trim()) e.city = 'Enter your city.'
  if (!f.state) e.state = 'Choose your state.'
  if (!f.pin.trim()) e.pin = 'Enter your PIN code.'
  else if (!isPin(f.pin)) e.pin = 'PIN codes have exactly 6 digits.'
  if (f.payment === 'UPI') {
    if (!f.upi.trim()) e.upi = 'Enter your UPI ID, like name@bank.'
    else if (!isUpi(f.upi)) e.upi = 'UPI IDs look like name@bank.'
  }
  if (f.payment === 'Card') {
    if (!isCardNumber(f.cardNumber)) e.cardNumber = 'Enter a valid card number.'
    if (!isCardExpiry(f.cardExpiry)) e.cardExpiry = 'Use MM/YY, with a date that has not passed.'
    if (!isCvc(f.cardCvc)) e.cardCvc = 'Enter the 3 or 4 digit CVC.'
  }
  if (!f.terms) e.terms = 'Please agree to the Terms and Conditions to place your order.'
  return e
}

const section = 'border-t border-line pt-8 first:border-t-0 first:pt-0'
const h2 = 'font-display text-3xl md:text-4xl'

export function CheckoutPage() {
  useDocumentTitle('Checkout')
  const navigate = useNavigate()
  const { lines, count, ...totals } = useBagSummary()
  const user = useCurrentUser()
  const bagNote = useBag((s) => s.note)
  const placing = useRef(false)

  const [form, setForm] = useState<Form>(() => {
    const d = loadDraft()
    return { ...blank, note: bagNote, ...d }
  })
  const [touched, setTouched] = useState<Partial<Record<Key, boolean>>>({})
  const [submitted, setSubmitted] = useState(false)
  const [busy, setBusy] = useState(false)
  const [summaryOpen, setSummaryOpen] = useState(false)
  const errors = validate(form)
  const shown = (k: Key) => (touched[k] || submitted ? errors[k] : undefined)

  // Prefill from the signed-in account, without overwriting what was already typed
  useEffect(() => {
    if (!user) return
    setForm((f) => ({ ...f, email: f.email || user.email, phone: f.phone || user.phone, firstName: f.firstName || user.name.split(' ')[0] || '', lastName: f.lastName || user.name.split(' ').slice(1).join(' ') }))
  }, [user])

  useEffect(() => {
    const draft = Object.fromEntries(PERSISTED.map((k) => [k, form[k]]))
    try { sessionStorage.setItem(DRAFT_KEY, JSON.stringify(draft)) } catch { /* storage unavailable: draft just isn't kept */ }
  }, [form])

  if (lines.length === 0 && !placing.current) {
    return <Navigate to="/bag" replace state={{ message: 'Your bag is empty. Add something lovely before checking out.' }} />
  }

  const set = <K extends Key>(k: K, v: Form[K]) => setForm((f) => ({ ...f, [k]: v }))
  const bind = (k: Key) => ({
    id: `co-${k}`,
    value: form[k] as string,
    onChange: (e: { target: { value: string } }) => set(k, e.target.value as never),
    onBlur: () => setTouched((t) => ({ ...t, [k]: true })),
    error: shown(k),
  })
  const focusField = (k: Key) => document.getElementById(`co-${k}`)?.focus()
  const failing = ORDER.filter((k) => errors[k])

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    if (failing.length) {
      focusField(failing[0])
      return
    }
    setBusy(true)
    // TODO: real payment. Only the method name is passed; card and UPI details never leave this component.
    await mockPay(form.payment, totals.total)
    const order: Order = {
      id: newOrderId(),
      createdAt: new Date().toISOString(),
      status: 'Awaiting confirmation',
      email: form.email.trim().toLowerCase(),
      phone: normalisePhone(form.phone),
      address: { firstName: form.firstName.trim(), lastName: form.lastName.trim(), address: form.address.trim(), apartment: form.apartment.trim(), city: form.city.trim(), state: form.state, pin: form.pin.trim(), country: 'India' },
      delivery: form.delivery,
      payment: form.payment,
      note: form.note.trim(),
      lines: lines.map((l) => ({ productId: l.productId, name: l.product.name, image: l.product.image, options: l.options, qty: l.qty, unitPrice: l.product.price, gift: l.gift })),
      totals: { subtotal: totals.subtotal, giftFees: totals.giftFees, shipping: totals.shipping, total: totals.total },
    }
    placing.current = true // stops the empty-bag redirect while we clear the bag
    useOrders.getState().place(order)
    if (user && form.saveAddress) useAuth.getState().addAddress({ firstName: order.address.firstName, lastName: order.address.lastName, address: order.address.address, apartment: order.address.apartment, city: order.address.city, state: order.address.state, pin: order.address.pin })
    useBag.getState().clear()
    try { sessionStorage.removeItem(DRAFT_KEY) } catch { /* ignore */ }
    navigate(`/order-confirmation/${order.id}`, { replace: true })
  }

  const shippingLabel = totals.shipping === 0 ? 'Free' : formatINR(SHIPPING_FEE)

  return (
    <div className="container-page pb-16">
      <div className="py-8 text-center md:py-12">
        <p className="eyebrow">Bag → Details → A little love on its way</p>
        <h1 className="mt-3 text-[2.5rem] leading-tight md:text-6xl">Make it yours.</h1>
        <p className="mt-3 text-muted">Add your details and review your lovely little order.</p>
      </div>

      {/* Mobile: collapsible summary at the top */}
      <div className="mb-6 rounded-lg bg-surface lg:hidden">
        <button type="button" aria-expanded={summaryOpen} aria-controls="co-summary-m" onClick={() => setSummaryOpen((o) => !o)} className="flex min-h-14 w-full items-center justify-between gap-3 px-4 text-left">
          <span className="flex items-center gap-2 text-sm">{summaryOpen ? 'Hide' : 'Show'} order summary <ChevronDown className={`h-4 w-4 transition-transform ${summaryOpen ? 'rotate-180' : ''}`} aria-hidden="true" /></span>
          <span className="text-base font-medium">{formatINR(totals.total)}</span>
        </button>
        <div id="co-summary-m" hidden={!summaryOpen} className="border-t border-line p-4"><CheckoutSummary lines={lines} totals={totals} /></div>
      </div>

      <div className="grid gap-10 lg:grid-cols-[1fr_400px] lg:gap-14">
        <form onSubmit={submit} noValidate aria-label="Checkout" className="space-y-8">
          {submitted && failing.length > 0 && (
            <div role="alert" className="rounded-lg border border-error bg-surface p-5">
              <p className="font-medium text-error">Please fix {failing.length === 1 ? 'this' : `these ${failing.length}`} before placing your order:</p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
                {failing.map((k) => (
                  <li key={k}><a href={`#co-${k}`} onClick={(e) => { e.preventDefault(); focusField(k) }} className="underline underline-offset-4">{LABEL[k]}: {errors[k]}</a></li>
                ))}
              </ul>
            </div>
          )}

          <section className={section} aria-labelledby="co-h1">
            <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
              <h2 id="co-h1" className={h2}>01 / Contact</h2>
              <p className="text-sm text-muted">{user ? <>Signed in as {user.email}</> : <>Have an account? <Link to="/account?next=/checkout" className="text-ink underline underline-offset-4">Sign in</Link></>}</p>
            </div>
            <div className="mt-5 space-y-4">
              <Field label="Email address" type="email" name="email" autoComplete="email" inputMode="email" required {...bind('email')} />
              <Field label="Phone number" type="tel" name="phone" autoComplete="tel" inputMode="tel" required hint="We only use this to talk about your order." {...bind('phone')} />
            </div>
          </section>

          <section className={section} aria-labelledby="co-h2">
            <h2 id="co-h2" className={h2}>02 / A lovely destination</h2>
            <div className="mt-5 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="First name" name="given-name" autoComplete="given-name" required {...bind('firstName')} />
                <Field label="Last name" name="family-name" autoComplete="family-name" required {...bind('lastName')} />
              </div>
              <Field label="Country / region" name="country" autoComplete="country-name" value="India" readOnly />
              <Field label="Address" name="address-line1" autoComplete="address-line1" required hint="House, flat, building and street" {...bind('address')} />
              <Field label="Apartment / landmark (optional)" name="address-line2" autoComplete="address-line2" {...bind('apartment')} />
              <div className="grid gap-4 sm:grid-cols-3">
                <Field label="City" name="city" autoComplete="address-level2" required {...bind('city')} />
                <SelectField label="State" name="state" autoComplete="address-level1" required placeholder="Choose state" options={indianStates} {...bind('state')} />
                <Field label="PIN code" name="postal-code" autoComplete="postal-code" inputMode="numeric" maxLength={6} required {...bind('pin')} />
              </div>
              {user && <Checkbox checked={form.saveAddress} onChange={(e) => set('saveAddress', e.target.checked)}>Save this address to my account</Checkbox>}
            </div>
          </section>

          <section className={section} aria-labelledby="co-h3">
            <h2 id="co-h3" className={h2}>03 / Delivery</h2>
            <fieldset className="mt-5 space-y-2">
              <legend className="sr-only">Delivery method</legend>
              <Radio name="delivery" checked={form.delivery === 'standard'} onChange={() => set('delivery', 'standard')}>
                <span><span className="block">Standard delivery · {shippingLabel}</span><span className="block text-sm text-muted">Usually delivered in {delivery.minDays} to {delivery.maxDays} days.</span></span>
              </Radio>
              <Radio name="delivery" checked={form.delivery === 'special'} onChange={() => set('delivery', 'special')}>Discuss a special occasion</Radio>
              {form.delivery === 'special' && (
                <p role="status" className="rounded-lg bg-blush p-4 text-sm">Planning around a birthday or an event date? Our team will contact you on WhatsApp after you place your order to agree timing and delivery.</p>
              )}
            </fieldset>
          </section>

          <section className={section} aria-labelledby="co-h4">
            <h2 id="co-h4" className={h2}>04 / Payment</h2>
            {/* TODO: gateway. Nothing below is sent anywhere or stored: see lib/payment.ts */}
            <fieldset className="mt-5">
              <legend className="sr-only">Payment method</legend>
              <div className="flex flex-wrap gap-x-6">
                {(['UPI', 'Card', 'Other'] as PaymentMethod[]).map((m) => (
                  <Radio key={m} name="payment" checked={form.payment === m} onChange={() => set('payment', m)}>{m === 'Other' ? 'Other options' : m}</Radio>
                ))}
              </div>
            </fieldset>
            <div className="mt-4 space-y-4">
              {form.payment === 'UPI' && <Field label="UPI ID" name="upi" autoComplete="off" autoCapitalize="none" spellCheck={false} hint="For example name@okbank" required {...bind('upi')} />}
              {form.payment === 'Card' && (
                <>
                  <Field label="Card number" name="cc-number" autoComplete="cc-number" inputMode="numeric" required {...bind('cardNumber')} />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Expiry (MM/YY)" name="cc-exp" autoComplete="cc-exp" inputMode="numeric" maxLength={5} required {...bind('cardExpiry')} />
                    <Field label="CVC" name="cc-csc" autoComplete="cc-csc" inputMode="numeric" maxLength={4} required {...bind('cardCvc')} />
                  </div>
                </>
              )}
              {form.payment === 'Other' && <p className="rounded-lg bg-blush p-4 text-sm">We’ll share other payment options with you on WhatsApp once you place your order.</p>}
              <p className="text-xs text-muted">Your payment details are not stored on this device.</p>
            </div>
          </section>

          <section className={section} aria-labelledby="co-h5">
            <h2 id="co-h5" className={h2}>05 / Order note</h2>
            <div className="mt-5"><Field multiline label="Order note (optional)" name="note" maxLength={300} id="co-note" value={form.note} onChange={(e) => set('note', e.target.value)} /></div>
          </section>

          <section className={section} aria-label="Terms and place order">
            <Checkbox id="co-terms" checked={form.terms} onChange={(e) => set('terms', e.target.checked)} onBlur={() => setTouched((t) => ({ ...t, terms: true }))} aria-invalid={!!shown('terms')} aria-describedby={shown('terms') ? 'co-terms-err' : undefined}>
              <span>I have read the <Link to="/policies/terms" className="underline underline-offset-4">Terms and Conditions</Link> and <Link to="/policies/privacy" className="underline underline-offset-4">Privacy Policy</Link>.</span>
            </Checkbox>
            {shown('terms') && <p id="co-terms-err" role="alert" className="mt-1 text-xs text-error">{errors.terms}</p>}
            <Button type="submit" full disabled={busy} className="mt-5">
              {busy ? <><Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> Placing your order…</> : `Place order · ${formatINR(totals.total)}`}
            </Button>
            <p className="mt-3 text-center text-xs text-muted">A little love in every detail.</p>
          </section>
        </form>

        <aside aria-label="Order summary" className="hidden lg:block">
          <div className="sticky top-6 rounded-lg bg-surface p-6">
            <h2 className="eyebrow !text-ink mb-5">Your order · {count} little {count === 1 ? 'treasure' : 'treasures'}</h2>
            <CheckoutSummary lines={lines} totals={totals} />
          </div>
        </aside>
      </div>
    </div>
  )
}
