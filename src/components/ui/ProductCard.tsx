import { Link } from 'react-router-dom'
import { Heart, Plus } from 'lucide-react'
import { categoryLabel, type Product } from '@/data/products'
import { formatINR } from '@/lib/format'
import { useBag } from '@/store/bag'
import { useToast } from '@/store/toast'
import { useWishlist } from '@/store/wishlist'
import { Badge } from './Badge'
import { Button } from './Button'

export function ProductCard({ product, eager }: { product: Product; /** Above-the-fold image */ eager?: boolean }) {
  const wished = useWishlist((s) => s.ids.includes(product.id))
  const toggle = useWishlist((s) => s.toggle)
  const add = useBag((s) => s.add)
  const show = useToast((s) => s.show)

  const quickAdd = () => {
    add(product.id, product.variants?.[0])
    show('Added to bag')
  }

  return (
    <article className="group relative flex h-full flex-col rounded-lg bg-surface p-2 transition-shadow focus-within:shadow-md hover:shadow-md">
      <div className="relative aspect-[222/246] overflow-hidden rounded-md bg-blush">
        <img
          src={product.image}
          alt=""
          width={222}
          height={246}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          className="h-full w-full object-cover motion-safe:transition-transform motion-safe:duration-500 group-hover:motion-safe:scale-[1.04]"
        />
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
        <Button variant="outline" full onClick={quickAdd} className="relative z-10 mt-auto !px-3" aria-label={`Quick add ${product.name} to bag`}>
          Quick add <Plus className="h-3.5 w-3.5" aria-hidden="true" />
        </Button>
      </div>
    </article>
  )
}
