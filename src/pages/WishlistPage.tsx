import { useState } from 'react'
import { Heart } from 'lucide-react'
import { Breadcrumbs, Button, ProductCard } from '@/components/ui'
import { getProduct } from '@/data/products'
import { useDocumentTitle } from '@/lib/useDocumentTitle'
import { useBag } from '@/store/bag'
import { useToast } from '@/store/toast'
import { useWishlist } from '@/store/wishlist'

export function WishlistPage() {
  useDocumentTitle('Your wishlist')
  const ids = useWishlist((s) => s.ids)
  const remove = useWishlist((s) => s.remove)
  const [status, setStatus] = useState('')
  const items = ids.flatMap((i) => getProduct(i) ?? [])

  const moveAll = () => {
    // Items with required options are never added with a silent default
    const movable = items.filter((p) => p.options.length === 0 && p.stock !== 'out')
    movable.forEach((p) => { useBag.getState().add(p.id); remove(p.id) })
    const left = items.length - movable.length
    if (movable.length) useToast.getState().show(`${movable.length} ${movable.length === 1 ? 'item' : 'items'} added to bag`)
    setStatus(
      movable.length === 0
        ? 'These need an option chosen or are sold out, so open each one to add it.'
        : left > 0
          ? `${movable.length} moved to your bag. ${left} stay here because they need an option chosen or are sold out.`
          : `All ${movable.length} moved to your bag.`,
    )
  }

  return (
    <div className="container-page pb-16 pt-5 md:pt-6">
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Wishlist' }]} />
      <div className="py-8 text-center md:py-12">
        <p className="eyebrow mb-3">A little love list</p>
        <h1 className="flex items-center justify-center gap-3 text-[2.5rem] leading-tight md:text-6xl">Saved with love <Heart className="h-8 w-8 md:h-12 md:w-12" aria-hidden="true" /></h1>
        <p className="mx-auto mt-3 max-w-xl text-muted">The lovely things you’re keeping close. A little inspiration for you, or someone you adore.</p>
      </div>

      {items.length === 0 ? (
        <div className="rounded-lg bg-surface px-6 py-14 text-center">
          <p className="font-display text-3xl">Nothing saved yet.</p>
          <p className="mt-2 text-muted">Tap the heart on anything you love and it will wait for you here.</p>
          <Button to="/shop" className="mt-6">Shop all</Button>
        </div>
      ) : (
        <>
          <h2 className="eyebrow !text-ink border-b border-line pb-4">{items.length} saved little {items.length === 1 ? 'treasure' : 'treasures'}</h2>
          <ul className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5 lg:grid-cols-4">
            {items.map((p) => (
              <li key={p.id} className="flex flex-col">
                <div className="flex-1"><ProductCard product={p} forceLink /></div>
                <button type="button" onClick={() => remove(p.id)} aria-label={`Remove ${p.name} from wishlist`} className="mt-1 inline-flex min-h-11 items-center justify-center text-sm text-muted underline underline-offset-4 hover:text-ink">Remove</button>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm text-muted">Products with options, like a finish or style, open their page so you can choose.</p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <Button onClick={moveAll}>Move all to bag</Button>
            <Button to="/shop" variant="outline">Keep exploring</Button>
          </div>
          <p role="status" className="mt-3 min-h-6 text-sm">{status}</p>
        </>
      )}

      <section className="mt-10 rounded-xl bg-blush p-6 md:p-8">
        <p className="eyebrow !text-ink">Your wishlist, their little hint</p>
        <p className="mt-3 max-w-2xl text-muted">Keep your gifting ideas together, then bring your favourites into a personalized hamper.</p>
        <Button to="/hamper-studio" variant="outline" className="mt-5">Create a hamper</Button>
      </section>
    </div>
  )
}
