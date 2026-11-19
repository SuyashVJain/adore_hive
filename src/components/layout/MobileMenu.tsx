import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown } from 'lucide-react'
import { site } from '@/config/site'
import { images } from '@/data/images'
import { categories } from '@/data/products'
import { useBagSummary } from '@/store/bag'
import { useSearch } from '@/store/search'
import { useUI } from '@/store/ui'
import { useWishlist } from '@/store/wishlist'
import { Button } from '../ui/Button'
import { Drawer } from '../ui/Drawer'
import { ExtLink } from '../ui/ExtLink'
import { Field } from '../ui/Field'

const big = 'flex min-h-12 items-center font-display text-[1.75rem] leading-tight hover:underline underline-offset-4'
const small = 'inline-flex min-h-11 items-center text-sm hover:underline underline-offset-4'

export function MobileMenu() {
  const isOpen = useUI((s) => s.panel === 'menu')
  const close = useUI((s) => s.close)
  const open = useUI((s) => s.open)
  const setQuery = useSearch((s) => s.setQuery)
  const { count } = useBagSummary()
  const wishCount = useWishlist((s) => s.ids.length)
  const [shopOpen, setShopOpen] = useState(true)
  const [q, setQ] = useState('')

  const submit = (e: FormEvent) => {
    e.preventDefault()
    setQuery(q)
    open('search')
  }

  return (
    <Drawer open={isOpen} onClose={close} side="left" label="Menu" className="lg:hidden">
      <div className="flex-1 overflow-y-auto px-5 pb-8 sm:px-7">
        <form onSubmit={submit} role="search" className="mt-2">
          <Field label="Search the hive" type="search" value={q} onChange={(e) => setQ(e.target.value)} />
        </form>

        <nav aria-label="Mobile" className="mt-4">
          <Link to="/" onClick={close} className={big}>Home</Link>
          <Link to="/about" onClick={close} className={big}>About Us</Link>
          <button type="button" aria-expanded={shopOpen} aria-controls="m-shop" onClick={() => setShopOpen((o) => !o)} className={`${big} w-full justify-between pr-1`}>
            Shop
            <ChevronDown className={`h-5 w-5 transition-transform ${shopOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
          </button>
          <ul id="m-shop" hidden={!shopOpen} className="mb-3 ml-4">
            <li><Link to="/shop" onClick={close} className={small}>Shop All</Link></li>
            {categories.map((c) => (
              <li key={c.slug}><Link to={`/shop/${c.slug}`} onClick={close} className={small}>{c.label}</Link></li>
            ))}
          </ul>
          <div className="my-3 border-t border-line" />
          <Link to="/hamper-studio" onClick={close} className={big}>Customize Your Gift</Link>
          <Link to="/contact" onClick={close} className={big}>Contact Us</Link>
          <div className="my-3 border-t border-line" />
          <div className="flex flex-wrap items-center gap-x-5 text-muted">
            <Link to="/wishlist" onClick={close} className={small}>Wishlist{wishCount ? ` (${wishCount})` : ''}</Link>
            <Link to="/account" onClick={close} className={small}>My Account</Link>
            <Link to="/bag" onClick={close} className={small}>Your Bag{count ? ` (${count})` : ''}</Link>
          </div>
        </nav>

        <img src={images.lifestyle.hamper} alt="" className="mt-5 aspect-[16/9] w-full rounded-lg object-cover" />
        <Button to="/hamper-studio" onClick={close} full className="mt-4">Create your own hamper</Button>
        <div className="mt-3 flex gap-5 text-sm text-muted">
          <ExtLink href={site.instagramUrl}>Instagram</ExtLink>
          <ExtLink href={site.whatsappUrl}>WhatsApp</ExtLink>
        </div>
      </div>
    </Drawer>
  )
}
