import { useMemo } from 'react'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { MAX_QTY } from '@/config/shop'
import { getProduct } from '@/data/products'
import { computeTotals, lineKey, type CustomLine, type Gift, type LineProduct } from '@/lib/bag'

export { MAX_QTY }

export interface BagLine {
  key: string
  productId: string
  options: Record<string, string>
  qty: number
  gift?: Gift
  /** Set for hampers and letters from the studios */
  custom?: CustomLine
}

interface BagState {
  items: BagLine[]
  note: string
  add: (productId: string, opts?: { options?: Record<string, string>; qty?: number; gift?: Gift }) => void
  addCustom: (c: CustomLine, qty?: number) => void
  setQty: (key: string, qty: number) => void
  remove: (key: string) => void
  setNote: (note: string) => void
  clear: () => void
}

const clamp = (n: number) => Math.min(MAX_QTY, Math.max(1, Math.floor(Number.isFinite(n) ? n : 1)))

const validCustom = (c: unknown): c is CustomLine => {
  const x = c as Partial<CustomLine> | undefined
  return !!x && (x.type === 'hamper' || x.type === 'letter') && typeof x.name === 'string' && typeof x.price === 'number' && x.price >= 0 && Array.isArray(x.contents) && typeof x.href === 'string' && typeof x.image === 'string'
}

/** Drop lines for removed products or with corrupt data; fix quantities. Used on rehydrate. */
function sanitize(raw: unknown): BagLine[] {
  if (!Array.isArray(raw)) return []
  return raw.flatMap((l: Partial<BagLine>): BagLine[] => {
    if (!l || typeof l.productId !== 'string') return []
    if (l.custom !== undefined) {
      if (!validCustom(l.custom) || typeof l.key !== 'string') return []
      return [{ key: l.key, productId: l.productId, options: {}, qty: clamp(Number(l.qty)), custom: l.custom }]
    }
    if (!getProduct(l.productId)) return []
    const options = l.options && typeof l.options === 'object' ? l.options : {}
    const gift = l.gift && typeof l.gift.wrap === 'string' ? { wrap: l.gift.wrap, note: String(l.gift.note ?? '') } : undefined
    return [{ key: lineKey(l.productId, options, gift), productId: l.productId, options, qty: clamp(Number(l.qty)), gift }]
  })
}

export const useBag = create<BagState>()(
  persist(
    (set) => ({
      items: [],
      note: '',
      add: (productId, { options = {}, qty = 1, gift } = {}) =>
        set((s) => {
          const key = lineKey(productId, options, gift)
          const hit = s.items.find((i) => i.key === key)
          return {
            items: hit
              ? s.items.map((i) => (i.key === key ? { ...i, qty: clamp(i.qty + qty) } : i))
              : [...s.items, { key, productId, options, qty: clamp(qty), gift }],
          }
        }),
      // Every configured hamper or letter is its own line (never merged)
      addCustom: (custom, qty = 1) =>
        set((s) => ({ items: [...s.items, { key: `custom|${crypto.randomUUID()}`, productId: `custom:${custom.type}`, options: {}, qty: clamp(qty), custom }] })),
      setQty: (key, qty) => set((s) => ({ items: s.items.map((i) => (i.key === key ? { ...i, qty: clamp(qty) } : i)) })),
      remove: (key) => set((s) => ({ items: s.items.filter((i) => i.key !== key) })),
      setNote: (note) => set({ note }),
      clear: () => set({ items: [], note: '' }),
    }),
    {
      name: 'adore-bag',
      version: 2,
      migrate: () => ({ items: [], note: '' }), // v1 stored a single "variant" string
      merge: (persisted, current) => {
        const p = (persisted ?? {}) as Partial<BagState>
        return { ...current, items: sanitize(p.items), note: typeof p.note === 'string' ? p.note : '' }
      },
    },
  ),
)

export interface ResolvedLine extends BagLine {
  product: LineProduct
}

/** Lines joined to catalogue data (or the custom snapshot), plus totals. */
export function useBagSummary() {
  const items = useBag((s) => s.items)
  return useMemo(() => {
    const lines: ResolvedLine[] = items.flatMap((i) => {
      if (i.custom) {
        const c = i.custom
        return [{ ...i, product: { id: i.productId, name: c.name, image: c.image, price: c.price, subtitle: c.subtitle, href: c.href } }]
      }
      const p = getProduct(i.productId)
      return p ? [{ ...i, product: { id: p.id, name: p.name, image: p.image, price: p.price, subtitle: p.subtitle, href: `/product/${p.id}` } }] : []
    })
    return { lines, count: lines.reduce((n, l) => n + l.qty, 0), ...computeTotals(lines) }
  }, [items])
}
