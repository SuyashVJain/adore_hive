import { useState, type FormEvent } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Check } from 'lucide-react'
import { Badge, Breadcrumbs, Button, Field, PasswordField, SectionHeading, Tabs } from '@/components/ui'
import { images } from '@/data/images'
import { getProduct } from '@/data/products'
import { formatINR } from '@/lib/format'
import { optionsLabel } from '@/lib/bag'
import { useSeo } from '@/lib/useDocumentTitle'
import { isEmail, isPhone, passwordProblem } from '@/lib/validate'
import { useAuth, useCurrentUser, type User } from '@/store/auth'
import { useOrders } from '@/store/orders'
import { useWishlist } from '@/store/wishlist'
import { Addresses } from '@/components/account/Addresses'
import { formatDate } from './OrderConfirmation'

export function AccountPage() {
  const user = useCurrentUser()
  useSeo(user ? 'My account' : 'Sign in', 'Sign in to see your orders, addresses and wishlist.', { noindex: true })
  return (
    <div className="container-page pb-16 pt-5 md:pt-6">
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'My account' }]} />
      {user ? <SignedIn user={user} /> : <SignedOut />}
    </div>
  )
}

/* ------------------------------ signed out ------------------------------ */

type Errs = Record<string, string | undefined>

function useAfterAuth() {
  const navigate = useNavigate()
  const next = useSearchParams()[0].get('next')
  // only same-site paths, never an absolute or protocol-relative URL
  return () => { if (next && /^\/(?!\/)/.test(next)) navigate(next) }
}

function SignedOut() {
  const [tab, setTab] = useState('signin')
  return (
    <>
      <div className="py-8 md:py-12">
        <SectionHeading as="h1" align="center" eyebrow="Your little corner of the hive" title="Hello, lovely." subtitle="Sign in to keep your favourites, personal touches and orders close." />
      </div>
      <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:gap-12">
        <div className="rounded-xl bg-surface p-5 sm:p-8">
          <Tabs
            label="Account"
            value={tab}
            onChange={setTab}
            tabs={[
              { id: 'signin', label: 'Sign in', content: <SignInPanel onCreate={() => setTab('create')} /> },
              { id: 'create', label: 'Create account', content: <CreatePanel onSignIn={() => setTab('signin')} /> },
            ]}
          />
        </div>
        <div className="order-last">
          <img src={images.instagram[2]} alt="" width={580} height={340} className="aspect-[16/6] w-full rounded-xl object-cover md:aspect-[580/340]" />
          <h2 className="mt-5 font-display text-3xl md:text-4xl">A place for your little favourites.</h2>
          <p className="mt-2 text-muted">Keep track of lovely finds, revisit your gift details and make room for the next thoughtful gesture.</p>
        </div>
      </div>
    </>
  )
}

function SignInPanel({ onCreate }: { onCreate: () => void }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [submitted, setSubmitted] = useState(false)
  const [formError, setFormError] = useState('')
  const [busy, setBusy] = useState(false)
  const [forgot, setForgot] = useState(false)
  const after = useAfterAuth()

  const errors: Errs = {
    email: !email.trim() ? 'Enter your email address.' : !isEmail(email) ? 'That email does not look right.' : undefined,
    password: !password ? 'Enter your password.' : undefined,
  }
  const show = (k: string) => (touched[k] || submitted ? errors[k] : undefined)
  const blur = (k: string) => () => setTouched((t) => ({ ...t, [k]: true }))

  if (forgot) return <ForgotPanel initial={email} onBack={() => setForgot(false)} />

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setFormError('')
    const bad = (['email', 'password'] as const).find((k) => errors[k])
    if (bad) return document.getElementById(`si-${bad}`)?.focus()
    setBusy(true)
    const r = await useAuth.getState().login(email, password)
    setBusy(false)
    if (!r.ok) return setFormError(r.error)
    after()
  }

  return (
    <form onSubmit={submit} noValidate aria-labelledby="si-h" className="space-y-4">
      <h2 id="si-h" className="font-display text-4xl">Welcome back.</h2>
      {formError && <p role="alert" className="rounded-md border border-error p-3 text-sm text-error">{formError}</p>}
      <Field id="si-email" label="Email address" type="email" name="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} onBlur={blur('email')} error={show('email')} />
      <PasswordField id="si-password" label="Password" name="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} onBlur={blur('password')} error={show('password')} />
      <Button type="submit" full disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</Button>
      <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
        <button type="button" onClick={() => setForgot(true)} className="inline-flex min-h-11 items-center underline underline-offset-4 hover:no-underline">Forgot password?</button>
        <button type="button" onClick={onCreate} className="inline-flex min-h-11 items-center text-muted underline underline-offset-4 hover:text-ink">New to the hive? Create an account</button>
      </div>
    </form>
  )
}

function ForgotPanel({ initial, onBack }: { initial: string; onBack: () => void }) {
  const [email, setEmail] = useState(initial)
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)
  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (!isEmail(email)) return setError('Enter the email address you signed up with.')
    setError('')
    setSent(true) // TODO: real password reset email once there is a backend
  }
  return (
    <form onSubmit={submit} noValidate aria-labelledby="fp-h" className="space-y-4">
      <h2 id="fp-h" className="font-display text-4xl">Reset your password.</h2>
      {sent ? (
        <p role="status" className="flex items-start gap-2"><Check className="mt-1 h-4 w-4 shrink-0" aria-hidden="true" /> If an account exists for {email}, we’ll send instructions to reset your password.</p>
      ) : (
        <>
          <p className="text-muted">Enter your email and we’ll send you a link to choose a new password.</p>
          <Field id="fp-email" label="Email address" type="email" name="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} error={error} />
          <Button type="submit" full>Send reset link</Button>
        </>
      )}
      <button type="button" onClick={onBack} className="inline-flex min-h-11 items-center text-sm underline underline-offset-4 hover:no-underline">Back to sign in</button>
    </form>
  )
}

function CreatePanel({ onSignIn }: { onSignIn: () => void }) {
  const [v, setV] = useState({ name: '', email: '', password: '' })
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [submitted, setSubmitted] = useState(false)
  const [formError, setFormError] = useState('')
  const [busy, setBusy] = useState(false)
  const after = useAfterAuth()

  const errors: Errs = {
    name: !v.name.trim() ? 'Tell us your name.' : undefined,
    email: !v.email.trim() ? 'Enter your email address.' : !isEmail(v.email) ? 'That email does not look right.' : undefined,
    password: !v.password ? 'Choose a password.' : passwordProblem(v.password) ?? undefined,
  }
  const show = (k: string) => (touched[k] || submitted ? errors[k] : undefined)
  const bind = (k: 'name' | 'email' | 'password') => ({
    id: `ca-${k}`, value: v[k], error: show(k),
    onChange: (e: { target: { value: string } }) => setV({ ...v, [k]: e.target.value }),
    onBlur: () => setTouched((t) => ({ ...t, [k]: true })),
  })

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setFormError('')
    const bad = (['name', 'email', 'password'] as const).find((k) => errors[k])
    if (bad) return document.getElementById(`ca-${bad}`)?.focus()
    setBusy(true)
    const r = await useAuth.getState().register(v.name, v.email, v.password)
    setBusy(false)
    if (!r.ok) return setFormError(r.error)
    after()
  }

  return (
    <form onSubmit={submit} noValidate aria-labelledby="ca-h" className="space-y-4">
      <h2 id="ca-h" className="font-display text-4xl">Join the hive.</h2>
      {formError && <p role="alert" className="rounded-md border border-error p-3 text-sm text-error">{formError}</p>}
      <Field label="Your name" name="name" autoComplete="name" required {...bind('name')} />
      <Field label="Email address" type="email" name="email" autoComplete="email" required {...bind('email')} />
      <PasswordField label="Password" name="new-password" autoComplete="new-password" required hint="At least 8 characters, with a letter and a number." {...bind('password')} />
      <Button type="submit" full disabled={busy}>{busy ? 'Creating your account…' : 'Create account'}</Button>
      <button type="button" onClick={onSignIn} className="inline-flex min-h-11 items-center text-sm text-muted underline underline-offset-4 hover:text-ink">Already have an account? Sign in</button>
    </form>
  )
}

/* ------------------------------ signed in ------------------------------ */

function SignedIn({ user }: { user: User }) {
  const [tab, setTab] = useState('orders')
  const logout = useAuth((s) => s.logout)
  const first = user.name.split(' ')[0] || 'lovely'
  return (
    <>
      <div className="flex flex-col items-center gap-4 py-8 text-center md:py-12">
        <SectionHeading as="h1" align="center" eyebrow="Your little corner of the hive" title={`Hello, ${first}.`} subtitle={user.email} />
        <Button variant="outline" onClick={logout}>Sign out</Button>
      </div>
      <div className="rounded-xl bg-blush p-5 sm:p-8">
        <Tabs
          label="My account"
          value={tab}
          onChange={setTab}
          tabs={[
            { id: 'orders', label: 'Orders', content: <Orders user={user} /> },
            { id: 'addresses', label: 'Saved addresses', content: <Addresses user={user} /> },
            { id: 'wishlist', label: 'Wishlist', content: <WishlistTab /> },
            { id: 'details', label: 'Account details', content: <Details user={user} /> },
          ]}
        />
      </div>
    </>
  )
}

function Empty({ title, text, to, cta }: { title: string; text: string; to: string; cta: string }) {
  return (
    <div className="rounded-lg bg-surface p-8 text-center">
      <p className="font-display text-3xl">{title}</p>
      <p className="mt-2 text-muted">{text}</p>
      <Button to={to} className="mt-5">{cta}</Button>
    </div>
  )
}

function Orders({ user }: { user: User }) {
  const all = useOrders((s) => s.orders)
  const orders = all.filter((o) => o.email === user.email)
  if (!orders.length) return <Empty title="No orders yet." text="When you place an order it will appear here." to="/shop" cta="Shop all" />
  return (
    <ul className="space-y-5">
      {orders.map((o) => (
        <li key={o.id} className="rounded-lg bg-surface p-5 sm:p-6">
          {/* Reference and date are separate lines so they never run together */}
          <div className="flex flex-wrap items-start justify-between gap-3 border-b border-line pb-4">
            <div>
              <p className="eyebrow !text-ink">Order {o.id}</p>
              <p className="mt-1 text-sm text-muted">Placed {formatDate(o.createdAt)}</p>
            </div>
            <Badge tone="blush">{o.status}</Badge>
          </div>
          <ul className="divide-y divide-line">
            {o.lines.map((l, i) => (
              <li key={i} className="flex gap-4 py-4">
                <img src={l.image} alt="" width={72} height={90} loading="lazy" className="h-[90px] w-[72px] shrink-0 rounded-md object-cover" />
                <div className="min-w-0">
                  <p className="font-product text-lg leading-snug">{l.name}</p>
                  <p className="text-sm text-muted">{[optionsLabel(l.options), `Quantity ${l.qty}`].filter(Boolean).join(' · ')}</p>
                  {l.contents && <ul className="mt-1 space-y-0.5 text-sm text-muted">{l.contents.map((c, j) => <li key={j}>{c}</li>)}</ul>}
                </div>
              </li>
            ))}
          </ul>
          <p className="border-t border-line pt-4 text-sm">Total <strong className="font-medium">{formatINR(o.totals.total)}</strong></p>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <Button to={`/order-confirmation/${o.id}`} variant="outline">View order details</Button>
            <Button to="/contact" variant="outline">Contact the hive</Button>
          </div>
        </li>
      ))}
    </ul>
  )
}

function WishlistTab() {
  const ids = useWishlist((s) => s.ids)
  const items = ids.flatMap((i) => getProduct(i) ?? [])
  if (!items.length) return <Empty title="Nothing saved yet." text="Tap the heart on anything you love and it will wait for you here." to="/shop" cta="Shop all" />
  return (
    <div>
      <ul className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {items.map((p) => (
          <li key={p.id}>
            <Link to={`/product/${p.id}`} className="block rounded-lg bg-surface p-2 hover:shadow-md">
              <img src={p.image} alt="" width={222} height={246} loading="lazy" className="aspect-[222/246] w-full rounded-md object-cover" />
              <p className="mt-2 px-1 font-product text-base">{p.name}</p>
              <p className="px-1 pb-1 text-sm text-muted">{formatINR(p.price)}</p>
            </Link>
          </li>
        ))}
      </ul>
      <Button to="/wishlist" variant="outline" className="mt-5">Open my wishlist</Button>
    </div>
  )
}

function Details({ user }: { user: User }) {
  const update = useAuth((s) => s.updateProfile)
  const [name, setName] = useState(user.name)
  const [phone, setPhone] = useState(user.phone)
  const [errors, setErrors] = useState<Errs>({})
  const [saved, setSaved] = useState(false)
  const submit = (e: FormEvent) => {
    e.preventDefault()
    const er: Errs = { name: name.trim() ? undefined : 'Tell us your name.', phone: phone && !isPhone(phone) ? 'Enter a 10-digit Indian mobile number, or leave it blank.' : undefined }
    setErrors(er)
    setSaved(false)
    const bad = (['name', 'phone'] as const).find((k) => er[k])
    if (bad) return document.getElementById(`ad-${bad}`)?.focus()
    update({ name: name.trim(), phone: phone.trim() })
    setSaved(true)
  }
  return (
    <form onSubmit={submit} noValidate aria-label="Account details" className="max-w-xl space-y-4 rounded-lg bg-surface p-5 sm:p-8">
      <Field id="ad-name" label="Your name" name="name" autoComplete="name" required value={name} onChange={(e) => setName(e.target.value)} error={errors.name} />
      <Field id="ad-email" label="Email address" type="email" value={user.email} readOnly hint="Your email is used to find your orders." />
      <Field id="ad-phone" label="Phone number (optional)" type="tel" name="phone" autoComplete="tel" inputMode="tel" value={phone} onChange={(e) => setPhone(e.target.value)} error={errors.phone} />
      <Button type="submit">Save changes</Button>
      <p role="status" className="min-h-6 text-sm">{saved ? 'Your details are saved.' : ''}</p>
    </form>
  )
}
