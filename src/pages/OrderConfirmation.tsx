import { Link, useParams } from 'react-router-dom'
import { Check, Phone } from 'lucide-react'
import { Button, ExtLink } from '@/components/ui'
import { delivery, giftWrapById } from '@/config/shop'
import { site } from '@/config/site'
import { formatINR } from '@/lib/format'
import { optionsLabel } from '@/lib/bag'
import { useDocumentTitle } from '@/lib/useDocumentTitle'
import { OrderSummary } from '@/components/bag/OrderSummary'
import { useOrders } from '@/store/orders'
import { StubPage } from './StubPage'

export const formatDate = (iso: string) => new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })

export function OrderConfirmation() {
  const id = useParams().id ?? ''
  const order = useOrders((s) => s.orders.find((o) => o.id === id))
  useDocumentTitle(order ? `Order ${order.id}` : 'Order not found')

  if (!order) {
    return <StubPage eyebrow="Order not found" title="We couldn’t find that order." subtitle="Check the link, or look under My account if you are signed in." cta={{ label: 'Go to my account', to: '/account' }} />
  }
  const a = order.address
  const next = [
    ['We confirm your order', order.delivery === 'special' ? 'Our team will contact you on WhatsApp to agree timing and delivery for your special occasion.' : 'We check your order and details, then confirm it with you.'],
    ['We pack it with love', 'Each piece is wrapped carefully, with any gift wrap and note you chose.'],
    ['It’s on its way', `Delivery usually takes ${delivery.minDays} to ${delivery.maxDays} days once your order is dispatched.`],
  ]

  return (
    <div className="container-page pb-16 pt-8 md:pt-12">
      <div className="text-center">
        <p className="eyebrow flex items-center justify-center gap-2"><Check className="h-4 w-4" aria-hidden="true" /> Order placed</p>
        <h1 className="mt-3 text-[2.5rem] leading-tight md:text-6xl">Thank you, {a.firstName}.</h1>
        <p className="mt-3 text-muted">Your little love is on its way to being wrapped.</p>
        <p className="mt-5 inline-block rounded-md bg-blush px-4 py-2 text-sm">Order reference <strong className="font-medium">{order.id}</strong></p>
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_380px]">
        <div className="space-y-10">
          <section aria-labelledby="oc-items">
            <h2 id="oc-items" className="eyebrow !text-ink mb-2">Your order</h2>
            <ul className="divide-y divide-line border-y border-line">
              {order.lines.map((l, i) => {
                const wrap = l.gift ? giftWrapById(l.gift.wrap) : undefined
                return (
                  <li key={i} className="flex gap-4 py-4">
                    <img src={l.image} alt="" width={72} height={90} loading="lazy" className="h-[90px] w-[72px] shrink-0 rounded-md object-cover" />
                    <div className="min-w-0 flex-1">
                      <p className="font-product text-lg">{l.name}</p>
                      <p className="text-sm text-muted">Quantity {l.qty}{optionsLabel(l.options) ? ` · ${optionsLabel(l.options)}` : ''}</p>
                      {wrap && <p className="text-sm text-muted">Gift: {wrap.label}{l.gift?.note ? <> · Note: “{l.gift.note}”</> : null}</p>}
                    </div>
                    <p className="text-sm font-medium">{formatINR(l.qty * (l.unitPrice + (wrap?.fee ?? 0)))}</p>
                  </li>
                )
              })}
            </ul>
          </section>

          <section aria-labelledby="oc-next">
            <h2 id="oc-next" className="font-display text-3xl">What happens next</h2>
            <ol className="mt-4 space-y-4">
              {next.map(([t, d], i) => (
                <li key={t} className="flex gap-4">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-blush text-sm" aria-hidden="true">{i + 1}</span>
                  <div><p className="font-medium">{t}</p><p className="text-sm text-muted">{d}</p></div>
                </li>
              ))}
            </ol>
          </section>
        </div>

        <aside className="space-y-5" aria-label="Order details">
          <div className="rounded-lg bg-surface p-6">
            <h2 className="eyebrow !text-ink mb-4">Totals</h2>
            <OrderSummary totals={{ ...order.totals, freeShippingGap: 0 }} />
          </div>
          <div className="rounded-lg bg-surface p-6">
            <h2 className="eyebrow !text-ink mb-3">Delivering to</h2>
            <address className="text-sm not-italic leading-relaxed">
              {a.firstName} {a.lastName}<br />{a.address}{a.apartment ? `, ${a.apartment}` : ''}<br />{a.city}, {a.state} {a.pin}<br />{a.country}
            </address>
            <p className="mt-3 text-sm text-muted">{order.delivery === 'special' ? 'Special occasion: we will contact you on WhatsApp.' : 'Standard delivery'} · Paid via {order.payment === 'Other' ? 'other options' : order.payment}</p>
          </div>
          <div className="rounded-lg bg-blush p-6">
            <h2 className="eyebrow !text-ink mb-2">Questions about your order?</h2>
            <ul>
              <li><a href={site.phoneHref} className="inline-flex min-h-11 items-center gap-2 text-sm underline-offset-4 hover:underline"><Phone className="h-4 w-4" aria-hidden="true" /> {site.phoneDisplay}</a></li>
              <li><ExtLink href={site.whatsappUrl} className="text-sm">Chat on WhatsApp</ExtLink></li>
              <li><ExtLink href={site.instagramUrl} className="text-sm">Instagram {site.instagramHandle}</ExtLink></li>
            </ul>
          </div>
        </aside>
      </div>

      <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
        <Button to="/account">View my orders</Button>
        <Button to="/shop" variant="outline">Continue shopping</Button>
      </div>
      <p className="mt-4 text-center text-xs text-muted">Not signed in? <Link to="/account" className="underline underline-offset-4">Create an account</Link> with {order.email} to keep your orders together.</p>
    </div>
  )
}
