import { useState, type ReactNode } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { SlidersHorizontal, X } from 'lucide-react'
import { FilterPanel } from '@/components/listing/FilterPanel'
import { Breadcrumbs, Button, Chip, Drawer, ProductCard, SectionHeading } from '@/components/ui'
import type { ListingConfig } from '@/data/listings'
import { popularSearches, shopMenu } from '@/data/nav'
import { categoryLabel, products } from '@/data/products'
import { activeCount, applyFilters, emptyFilters, parseFilters, PRICE_HI, PRICE_LO, serializeFilters, sortOptions, type Filters, type Sort } from '@/lib/listing'
import { formatINR } from '@/lib/format'

interface Props {
  config: ListingConfig
  /** Rendered below the results (e.g. the gifting request form) */
  after?: ReactNode
}

/** Active-filter chips: what's applied, each removable. */
function activeChips(f: Filters, set: (f: Filters) => void, typeLabel?: string, hideQuery?: boolean) {
  const chips: { key: string; label: string; remove: () => void }[] = []
  if (f.q && !hideQuery) chips.push({ key: 'q', label: `Search: ${f.q}`, remove: () => set({ ...f, q: undefined }) })
  if (f.type) chips.push({ key: 'type', label: typeLabel ?? f.type, remove: () => set({ ...f, type: undefined }) })
  f.collections.forEach((c) => chips.push({ key: `c-${c}`, label: categoryLabel(c), remove: () => set({ ...f, collections: f.collections.filter((x) => x !== c) }) }))
  f.colours.forEach((c) => chips.push({ key: `col-${c}`, label: c, remove: () => set({ ...f, colours: f.colours.filter((x) => x !== c) }) }))
  f.finish.forEach((x) => chips.push({ key: `f-${x}`, label: x === 'handmade' ? 'Handmade' : 'Personalizable', remove: () => set({ ...f, finish: f.finish.filter((y) => y !== x) }) }))
  if ((f.min !== undefined && f.min > PRICE_LO) || (f.max !== undefined && f.max < PRICE_HI))
    chips.push({ key: 'price', label: `${formatINR(f.min ?? PRICE_LO)} – ${formatINR(f.max ?? PRICE_HI)}`, remove: () => set({ ...f, min: undefined, max: undefined }) })
  return chips
}

function FilterSheet({ open, onClose, value, onApply, config }: { open: boolean; onClose: () => void; value: Filters; onApply: (f: Filters) => void; config: ListingConfig }) {
  return (
    <Drawer open={open} onClose={onClose} side="bottom" title="Filters" label="Filters" className="lg:hidden">
      <SheetBody value={value} onApply={(f) => { onApply(f); onClose() }} config={config} />
    </Drawer>
  )
}

function SheetBody({ value, onApply, config }: { value: Filters; onApply: (f: Filters) => void; config: ListingConfig }) {
  const [draft, setDraft] = useState(value)
  return (
    <>
      <div className="flex-1 overflow-y-auto px-5 py-4 sm:px-7">
        <FilterPanel value={draft} onChange={setDraft} showCollections={!config.slug} showColour={config.showColour} />
      </div>
      <div className="flex gap-3 border-t border-line bg-page px-5 pb-5 pt-4 sm:px-7">
        <Button variant="outline" className="flex-1" onClick={() => setDraft({ ...emptyFilters(draft.sort, config.search ? draft.q : undefined), type: draft.type })}>Clear</Button>
        <Button className="flex-1" onClick={() => onApply(draft)}>Apply</Button>
      </div>
    </>
  )
}

export function ProductListing({ config, after }: Props) {
  const [sp, setSp] = useSearchParams()
  const [sheet, setSheet] = useState(false)
  const filters = parseFilters(sp)
  const set = (f: Filters) => setSp(serializeFilters(f))

  const base = config.slug ? products.filter((p) => p.category === config.slug) : products
  // Category pages ignore a stale ?collection=
  const eff: Filters = config.slug ? { ...filters, collections: [] } : filters
  // The search page shows nothing until there is a query
  const results = config.search && !eff.q ? [] : applyFilters(base, eff)
  const subItems = config.slug ? shopMenu.find((c) => c.to === `/shop/${config.slug}`)?.items ?? [] : []
  const typeLabel = subItems.find((i) => i.type === eff.type)?.label
  const chips = activeChips(eff, set, typeLabel, config.search)
  const n = activeCount(eff) - (eff.type ? 1 : 0) - (config.search && eff.q ? 1 : 0) // chips row counts type separately; button counts sidebar filters
  const crumbs = [{ label: 'Home', to: '/' }, ...(config.search ? [{ label: 'Search' }] : config.slug ? [{ label: 'Shop', to: '/shop' }, { label: config.title }] : [{ label: 'Shop' }])]

  return (
    <>
      <div className="container-page py-6 md:py-8">
        <Breadcrumbs items={crumbs} />
        <div className="py-8 md:py-12">
          <SectionHeading as="h1" align="center" eyebrow={config.eyebrow} title={config.title} subtitle={config.subtitle} />
        </div>

        {config.banner && (
          <img src={config.banner} alt="" width={1280} height={300} className="mb-8 aspect-[16/9] w-full rounded-xl object-cover sm:aspect-[16/6] lg:aspect-[1280/300]" />
        )}

        {subItems.length > 0 && (
          <div role="group" aria-label={`${config.title} types`} className="mb-6 flex flex-wrap gap-2">
            <Chip selected={!eff.type} onClick={() => set({ ...eff, type: undefined })}>All</Chip>
            {subItems.map((i) => <Chip key={i.type} selected={eff.type === i.type} onClick={() => set({ ...eff, type: i.type })}>{i.label}</Chip>)}
          </div>
        )}

        <div className="flex items-center justify-between gap-3 border-b border-line pb-4">
          <p aria-live="polite" className="text-sm text-muted">{results.length} lovely {results.length === 1 ? 'find' : 'finds'}</p>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => setSheet(true)} className="inline-flex min-h-11 items-center gap-2 rounded-md px-3 text-sm hover:bg-blush lg:hidden">
              <SlidersHorizontal className="h-4 w-4" aria-hidden="true" /> Filter{n > 0 ? ` (${n})` : ''}
            </button>
            <label className="flex items-center gap-2 text-sm">
              <span className="text-muted">Sort:</span>
              <select value={eff.sort} onChange={(e) => set({ ...eff, sort: e.target.value as Sort })} className="min-h-11 rounded-md border border-transparent bg-transparent py-1 pr-1 text-sm hover:border-line-strong">
                {sortOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </label>
          </div>
        </div>

        {chips.length > 0 && (
          <ul aria-label="Active filters" className="mt-4 flex flex-wrap items-center gap-2">
            {chips.map((c) => (
              <li key={c.key}>
                <button type="button" onClick={c.remove} aria-label={`Remove filter: ${c.label}`} className="inline-flex min-h-11 items-center gap-1.5 rounded-full border border-ink bg-blush pl-4 pr-3 text-sm hover:bg-[#f0cfcf]">
                  {c.label} <X className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              </li>
            ))}
            <li><button type="button" onClick={() => set(emptyFilters(eff.sort, config.search ? eff.q : undefined))} className="inline-flex min-h-11 items-center px-2 text-sm underline underline-offset-4 hover:no-underline">Clear all</button></li>
          </ul>
        )}

        <div className="mt-6 grid gap-8 lg:grid-cols-[250px_1fr] lg:gap-10">
          <aside className="hidden lg:block" aria-label="Filters">
            <p className="eyebrow !text-ink mb-5 border-b border-line pb-4">Refine your little finds</p>
            <FilterPanel value={eff} onChange={set} showCollections={!config.slug} showColour={config.showColour} />
            <button type="button" onClick={() => set({ ...emptyFilters(eff.sort, config.search ? eff.q : undefined), type: eff.type })} className="mt-2 inline-flex min-h-11 items-center text-sm underline underline-offset-4 hover:no-underline">Clear filters</button>
          </aside>

          <div>
            {results.length ? (
              <>
                <ul className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5 xl:grid-cols-4">
                  {results.map((p) => <li key={p.id}><ProductCard product={p} /></li>)}
                </ul>
                <p className="mt-10 text-center text-sm text-muted">You’ve seen all {results.length} little lovely {results.length === 1 ? 'thing' : 'things'} in this edit.</p>
                {config.slug && <div className="mt-6 flex justify-center lg:justify-start"><Button to="/shop" variant="outline">Explore all collections</Button></div>}
              </>
            ) : (
              config.search && n === 0 ? (
                <div className="rounded-lg bg-surface px-6 py-14 text-center">
                  <p className="font-display text-3xl">{eff.q ? `Nothing found for “${eff.q}” yet.` : 'What would you love to find?'}</p>
                  <p className="mt-2 text-muted">{eff.q ? 'Check the spelling, or try one of these little favourites.' : 'Try one of these little favourites, or use the search icon above.'}</p>
                  <ul className="mt-5 flex flex-wrap justify-center gap-2">
                    {popularSearches.map((r) => (
                      <li key={r}><Link to={`/search?q=${encodeURIComponent(r)}`} className="inline-flex min-h-11 items-center rounded-full border border-line-strong bg-surface px-4 text-sm hover:bg-blush">{r}</Link></li>
                    ))}
                  </ul>
                  <Button to="/shop" variant="outline" className="mt-6">Browse everything</Button>
                </div>
              ) : (
              <div className="rounded-lg bg-surface px-6 py-14 text-center">
                <p className="font-display text-3xl">No lovely finds match those filters.</p>
                <p className="mt-2 text-muted">Try widening your price range or removing a filter.</p>
                <Button className="mt-6" onClick={() => set(emptyFilters(eff.sort, config.search ? eff.q : undefined))}>Clear filters</Button>
              </div>
              )
            )}
          </div>
        </div>
        <div className="pb-16" />
      </div>

      <FilterSheet open={sheet} onClose={() => setSheet(false)} value={eff} onApply={set} config={config} />
      {after}
    </>
  )
}

