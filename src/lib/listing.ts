import { categories, colours, products, searchProducts, type CategorySlug, type Colour, type Product } from '@/data/products'

export type Sort = 'featured' | 'price-asc' | 'price-desc' | 'newest'
export type Finish = 'handmade' | 'personalizable'

export interface Filters {
  type?: string
  collections: CategorySlug[]
  colours: Colour[]
  finish: Finish[]
  min?: number
  max?: number
  sort: Sort
  q?: string
}

export const sortOptions: { value: Sort; label: string }[] = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
  { value: 'newest', label: 'Newest' },
]

export const PRICE_LO = Math.floor(Math.min(...products.map((p) => p.price)) / 100) * 100
export const PRICE_HI = Math.ceil(Math.max(...products.map((p) => p.price)) / 100) * 100

const list = (v: string | null) => (v ? v.split(',').filter(Boolean) : [])
const num = (v: string | null) => (v !== null && v !== '' && !Number.isNaN(Number(v)) ? Number(v) : undefined)

export function parseFilters(sp: URLSearchParams): Filters {
  const sort = sp.get('sort') as Sort
  return {
    type: sp.get('type') || undefined,
    collections: list(sp.get('collection')).filter((c): c is CategorySlug => categories.some((x) => x.slug === c)),
    colours: list(sp.get('colour')).filter((c): c is Colour => (colours as string[]).includes(c)),
    finish: list(sp.get('finish')).filter((f): f is Finish => f === 'handmade' || f === 'personalizable'),
    min: num(sp.get('min')),
    max: num(sp.get('max')),
    sort: sortOptions.some((o) => o.value === sort) ? sort : 'featured',
    q: sp.get('q') || undefined,
  }
}

export function serializeFilters(f: Filters): URLSearchParams {
  const sp = new URLSearchParams()
  if (f.q) sp.set('q', f.q)
  if (f.type) sp.set('type', f.type)
  if (f.collections.length) sp.set('collection', f.collections.join(','))
  if (f.colours.length) sp.set('colour', f.colours.join(','))
  if (f.finish.length) sp.set('finish', f.finish.join(','))
  if (f.min !== undefined && f.min > PRICE_LO) sp.set('min', String(f.min))
  if (f.max !== undefined && f.max < PRICE_HI) sp.set('max', String(f.max))
  if (f.sort !== 'featured') sp.set('sort', f.sort)
  return sp
}

export const emptyFilters = (sort: Sort = 'featured', q?: string): Filters => ({ collections: [], colours: [], finish: [], sort, q })

const hasMin = (f: Filters) => f.min !== undefined && f.min > PRICE_LO
const hasMax = (f: Filters) => f.max !== undefined && f.max < PRICE_HI

/** Number of narrowing filters (sort excluded). */
export const activeCount = (f: Filters) =>
  (f.type ? 1 : 0) + f.collections.length + f.colours.length + f.finish.length + (hasMin(f) ? 1 : 0) + (hasMax(f) ? 1 : 0) + (f.q ? 1 : 0)

export function applyFilters(base: Product[], f: Filters): Product[] {
  const hits = f.q ? searchProducts(f.q) : null
  const out = base.filter(
    (p) =>
      (!hits || hits.includes(p)) &&
      (!f.type || p.types.includes(f.type)) &&
      (!f.collections.length || f.collections.includes(p.category)) &&
      (!f.colours.length || p.colours.some((c) => f.colours.includes(c))) &&
      (!f.finish.length || f.finish.every((x) => p[x])) &&
      (f.min === undefined || p.price >= f.min) &&
      (f.max === undefined || p.price <= f.max),
  )
  const by = {
    featured: () => 0,
    'price-asc': (a: Product, b: Product) => a.price - b.price,
    'price-desc': (a: Product, b: Product) => b.price - a.price,
    newest: (a: Product, b: Product) => b.added - a.added,
  }[f.sort]
  return [...out].sort(by) // stable, so Featured keeps catalogue order
}
