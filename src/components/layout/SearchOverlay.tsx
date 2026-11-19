import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Clock } from 'lucide-react'
import { popularSearches } from '@/data/nav'
import { searchProducts } from '@/data/products'
import { useSearch } from '@/store/search'
import { useUI } from '@/store/ui'
import { Button } from '../ui/Button'
import { Field } from '../ui/Field'
import { Modal } from '../ui/Modal'
import { ProductCard } from '../ui/ProductCard'

const pill = 'inline-flex min-h-11 items-center rounded-full border border-line-strong bg-surface px-4 text-sm transition-colors hover:bg-blush active:bg-[#f0cfcf]'

export function SearchOverlay() {
  const isOpen = useUI((s) => s.panel === 'search')
  const close = useUI((s) => s.close)
  const { query, recent, setQuery, addRecent, clearRecent } = useSearch()
  const navigate = useNavigate()

  const term = query.trim()
  const results = searchProducts(term)
  const shown = results.slice(0, 3)

  const viewAll = (e?: FormEvent) => {
    e?.preventDefault()
    if (!term) return
    addRecent(term)
    close()
    navigate(`/shop?q=${encodeURIComponent(term)}`)
  }

  return (
    <Modal open={isOpen} onClose={close} label="Search">
      <h2 className="text-4xl md:text-5xl">What would you love to find?</h2>
      <form onSubmit={viewAll} role="search" className="mt-6">
        <Field label="Search the hive" type="search" value={query} onChange={(e) => setQuery(e.target.value)} data-autofocus autoComplete="off" />
      </form>

      {!term ? (
        <div className="mt-6 space-y-6">
          {recent.length > 0 && (
            <section aria-label="Recent searches">
              <div className="mb-2 flex items-center justify-between">
                <p className="eyebrow flex items-center gap-2"><Clock className="h-3.5 w-3.5" aria-hidden="true" /> Recent searches</p>
                <button type="button" onClick={clearRecent} className="inline-flex min-h-11 items-center px-2 text-sm text-muted underline underline-offset-4 hover:text-ink">Clear</button>
              </div>
              <ul className="flex flex-wrap gap-2">
                {recent.map((r) => <li key={r}><button type="button" className={pill} onClick={() => setQuery(r)}>{r}</button></li>)}
              </ul>
            </section>
          )}
          <section aria-label="Popular searches">
            <p className="eyebrow mb-2">Try a little</p>
            <ul className="flex flex-wrap gap-2">
              {popularSearches.map((r) => <li key={r}><button type="button" className={pill} onClick={() => setQuery(r)}>{r}</button></li>)}
            </ul>
          </section>
        </div>
      ) : (
        <section className="mt-6 border-t border-line pt-6" aria-live="polite">
          {results.length ? (
            <>
              <p className="eyebrow mb-4">
                {results.length} lovely {results.length === 1 ? 'match' : 'matches'} for “{term}”
              </p>
              <ul className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                {shown.map((p) => <li key={p.id}><ProductCard product={p} /></li>)}
              </ul>
              <Button variant="outline" onClick={() => viewAll()} className="mt-6">
                View all search results{results.length > shown.length ? ` (${results.length})` : ''}
              </Button>
            </>
          ) : (
            <div className="py-4">
              <p className="font-display text-3xl">Nothing found for “{term}” yet.</p>
              <p className="mt-2 text-muted">Check the spelling, or try one of these little favourites.</p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {popularSearches.map((r) => <li key={r}><button type="button" className={pill} onClick={() => setQuery(r)}>{r}</button></li>)}
              </ul>
              <Button to="/shop" onClick={close} variant="outline" className="mt-6">Browse everything</Button>
            </div>
          )}
        </section>
      )}
    </Modal>
  )
}
