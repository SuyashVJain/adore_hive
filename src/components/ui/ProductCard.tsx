import { Link } from 'react-router-dom'
import { Heart, Plus } from 'lucide-react'
import { categoryLabel, type Product } from '@/data/products'
import { formatINR } from '@/lib/format'
import { useBag } from '@/store/bag'
import { useToast } from '@/store/toast'
import { useUI } from '@/store/ui'
import { useWishlist } from '@/store/wishlist'
import { Badge } from './Badge'
import { Img } from './Img'
import { Button } from './Button'

interface Props {
  product: Product
  /** Above-the-fold image */
  eager?: boolean
  /** Never open the quick view; send products with options to their page (wishlist) */
  forceLink?: boolean
}

export function ProductCard({ product, eager, forceLink }: Props) {
  const wished = useWishlist((s) => s.ids.includes(product.id))
  const toggle = useWishlist((s) => s.toggle)
  const add = useBag((s) => s.add)
  const show = useToast((s) => s.show)
  const openQuick = useUI((s) => s.openQuick)
  const hasOptions = product.options.length > 0
  const soldOut = product.stock === 'out'

  const quickAdd = () => {
    add(product.id)
    show('Added to bag')
  }

  return (
    <article className="group relative flex h-full flex-col rounded-lg bg-surface p-2 transition-shadow focus-within:shadow-md hover:shadow-md">
      <div className="relative aspect-[222/246] overflow-hidden rounded-md bg-blush">
        <Img
          src={product.image}
          alt=""
          width={222}
          height={246}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          className="h-full w-full object-cover motion-safe:transition-transform motion-safe:duration-500 group-hover:motion-safe:scale-[1.04]"
        />
        {soldOut && <span className="absolute left-2 top-2 z-10 rounded-sm bg-ink px-2 py-1 font-label text-xs font-medium uppercase tracking-[0.12em] text-white">Sold out</span>}
        <button
          type="button"
          aria-pressed={wished}
          aria-label={`Save ${product.name} to wishlist`}
          onClick={() => toggle(product.id)}
          className="absolute right-1.5 top-1.5 z-10 grid h-11 w-11 place-items-center rounded-full bg-white/85 transition-colors hover:bg-white active:bg-blush"
        >
          <Heart className={`h-5 w-5 ${wished ? 'fill-ink' : ''}`} aria-hidden="true" />
        </button>
      </div>

      <div className="flex flex-1 flex-col px-2 pb-2 pt-3">
        <Badge>{product.badge}</Badge>
        <h3 className="mt-1 font-product text-lg leading-snug">
          {/* Stretched link: the whole card opens the product page */}
          <Link to={`/product/${product.id}`} className="underline-offset-4 after:absolute after:inset-0 after:rounded-lg group-hover:underline">
            <span className="sr-only">View details: </span>
            {product.name}
          </Link>
        </h3>
        <p className="text-sm text-muted">{categoryLabel(product.category)}</p>
        <p className="mb-4 mt-1 text-base font-medium">{formatINR(product.price)}</p>
        <div className="mt-auto">
          {soldOut ? (
            <Button to={`/product/${product.id}`} variant="outline" full className="relative z-10 !px-3" aria-label={`Notify me about ${product.name}`}>Notify me</Button>
          ) : hasOptions ? (
            <>
              {!forceLink && (
                <Button variant="outline" full onClick={() => openQuick(product.id)} className="relative z-10 hidden !px-3 lg:inline-flex" aria-label={`Quick view ${product.name}`}>Quick view</Button>
              )}
              <Button to={`/product/${product.id}`} variant="outline" full className={`relative z-10 !px-3 ${forceLink ? '' : 'lg:hidden'}`} aria-label={`Choose options for ${product.name}`}>Choose options</Button>
            </>
          ) : (
            <Button variant="outline" full onClick={quickAdd} className="relative z-10 !px-3" aria-label={`Quick add ${product.name} to bag`}>
              Quick add <Plus className="h-3.5 w-3.5" aria-hidden="true" />
            </Button>
          )}
        </div>
      </div>
    </article>
  )
}
