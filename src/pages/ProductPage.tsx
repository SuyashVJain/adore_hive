import { Link, useParams } from 'react-router-dom'
import { Heart, Info, Minus } from 'lucide-react'
import { DeliveryCheck } from '@/components/product/DeliveryCheck'
import { GiftPanel } from '@/components/product/GiftPanel'
import { NotifyForm } from '@/components/product/NotifyForm'
import { OptionPicker } from '@/components/product/OptionPicker'
import { ProductGallery } from '@/components/product/ProductGallery'
import { StockStatus } from '@/components/product/StockStatus'
import { useConfigurator } from '@/components/product/useConfigurator'
import { Accordion, Breadcrumbs, ProductCard, QuantityStepper } from '@/components/ui'
import { AddButton } from '@/components/ui/AddButton'
import { flyToBag } from '@/lib/fly'
import { RETURN_DAYS, delivery } from '@/config/shop'
import { typeLabel } from '@/data/nav'
import { categories, categoryLabel, getProduct, products, relatedProducts, type Product } from '@/data/products'
import { formatINR } from '@/lib/format'
import { useSeo } from '@/lib/useDocumentTitle'
import { useWishlist } from '@/store/wishlist'
import { StubPage } from './StubPage'

function NotFoundProduct() {
  useSeo('Product not found', undefined, { noindex: true })
  return (
    <StubPage eyebrow="Page not found" title="We couldn’t find that little treasure." subtitle="It may have sold out or moved. Here are a few things we think you’ll love." cta={{ label: 'Shop all', to: '/shop' }} products={products.slice(0, 4)} />
  )
}

export function ProductPage() {
  const product = getProduct(useParams().id ?? '')
  // key resets option/quantity state when navigating between products
  return product ? <Detail key={product.id} product={product} /> : <NotFoundProduct />
}

function Detail({ product }: { product: Product }) {
  useSeo(product.name, product.description, { image: product.image })
  const c = useConfigurator(product)
  const wished = useWishlist((s) => s.ids.includes(product.id))
  const toggleWish = useWishlist((s) => s.toggle)
  const cat = categories.find((x) => x.slug === product.category)!
  const type = product.types[0]
  const crumbs = [
    { label: 'Home', to: '/' },
    { label: cat.label, to: `/shop/${cat.slug}` },
    ...(type && typeLabel(type) ? [{ label: typeLabel(type)!, to: `/shop/${cat.slug}?type=${type}` }] : []),
    { label: product.name },
  ]
  const total = formatINR(product.price * c.qty)
  const msgId = 'opt-message'

  const addLabel = c.soldOut ? 'Out of stock' : `Add to bag · ${total}`
  // Add, and if it worked, arc the photo to the bag icon
  const onAdd = () => {
    const ok = c.add()
    if (ok) flyToBag([...document.querySelectorAll('[data-fly-source]')].find((e) => e.getBoundingClientRect().width > 0), product.image)
    return ok
  }

  return (
    <div className="container-page pb-24 pt-5 md:pb-16 md:pt-6">
      <Breadcrumbs items={crumbs} />

      <div className="mt-4 grid items-start gap-5 md:gap-8 lg:mt-6 lg:grid-cols-2 lg:gap-16">
        {/* Sticky on desktop so the column never leaves a gap under the thumbnails */}
        <div className="lg:sticky lg:top-24">
          <ProductGallery images={product.gallery} name={product.name} />
        </div>

        <div>
          <p className="eyebrow !text-ink">{cat.label} / {product.badge}</p>
          <h1 className="mt-3 text-[2rem] leading-[1.05] md:text-5xl lg:text-[3.5rem]">{product.name}</h1>
          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-1">
            <p className="text-2xl font-medium">{formatINR(product.price)}</p>
            <StockStatus product={product} />
          </div>
          <p className="mt-4 hidden text-base text-muted md:block">{product.description}</p>

          {product.options.length > 0 && (
            <div className="mt-6 border-t border-line pt-6">
              <OptionPicker product={product} selected={c.selected} onSelect={c.select} />
              {c.message && (
                <p id={msgId} role="status" className="mt-4 flex items-start gap-2 text-sm text-muted">
                  <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" /> {c.message}
                </p>
              )}
            </div>
          )}

          <div className="mt-6 flex items-center justify-between gap-3">
            <QuantityStepper value={c.qty} onChange={c.setQty} label="Quantity" />
            <button
              type="button"
              aria-pressed={wished}
              onClick={() => toggleWish(product.id)}
              className={`inline-flex min-h-11 items-center gap-2 rounded-md px-4 text-sm transition-colors ${wished ? 'bg-blush' : 'border border-line-strong hover:bg-blush/60'}`}
            >
              <Heart className={`h-4 w-4 ${wished ? 'fill-ink' : ''}`} aria-hidden="true" />
              {wished ? 'Saved to wishlist' : 'Save to wishlist'}
            </button>
          </div>

          <p className="mt-4 text-sm text-muted md:hidden">{product.description}</p>

          <div className="mt-5 space-y-3">
            <AddButton full onAdd={onAdd} disabled={!c.canAdd} idleLabel={addLabel} aria-describedby={c.message ? msgId : undefined} className="max-md:hidden" />
            {c.soldOut ? <NotifyForm name={product.name} /> : <GiftPanel value={c.gift} onChange={c.setGift} />}
          </div>

          <div className="mt-8 border-t border-line pt-6"><DeliveryCheck /></div>

          <div className="mt-8">
            <Accordion
              headingLevel={2}
              defaultOpen={['details']}
              items={[
                { id: 'details', title: 'The lovely details', content: <p>{product.details}</p> },
                { id: 'care', title: 'Care for your little treasure', content: <p>{cat.care}</p> },
                { id: 'packaging', title: 'Packaging & delivery', content: <p>{cat.packaging} Delivery usually takes {delivery.minDays} to {delivery.maxDays} days once your order is dispatched.</p> },
                { id: 'returns', title: 'Returns & exchanges', content: <p>Unused pieces can be returned or exchanged within {RETURN_DAYS} days. Personalized and made-to-order items are final sale. Read our <Link to="/policies/returns" className="underline underline-offset-4 hover:text-ink">Return and Exchange Policy</Link> for the full terms.</p> },
              ]}
            />
          </div>
        </div>
      </div>

      <section aria-labelledby="related-h" className="mt-16 md:mt-20">
        <h2 id="related-h" className="text-[2rem] md:text-5xl">Lovely together.</h2>
        <ul className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5 lg:grid-cols-4">
          {relatedProducts(product).map((p, i) => (
            <li key={p.id} className={i === 3 ? 'md:max-lg:hidden' : ''}><ProductCard product={p} /></li>
          ))}
        </ul>
      </section>

      {/* Mobile sticky bar */}
      <div className="fixed inset-x-0 bottom-0 z-30 flex items-center gap-4 border-t border-line bg-page px-5 py-3 md:hidden">
        <div className="min-w-0 flex-1">
          <p className="text-xl font-medium">{total}</p>
          {c.message && <p className="flex items-center gap-1 text-xs text-muted"><Minus className="h-3 w-3 shrink-0" aria-hidden="true" /> Choose {c.missing.map((m) => m.toLowerCase()).join(' & ')}</p>}
        </div>
        <AddButton onAdd={onAdd} disabled={!c.canAdd} idleLabel={c.soldOut ? 'Out of stock' : 'Add to bag'} className="shrink-0" />
      </div>
      <span className="sr-only">{categoryLabel(product.category)}</span>
    </div>
  )
}
