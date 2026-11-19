import { useMemo } from 'react'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { MAX_QTY } from '@/config/shop'
import { getProduct, type Product } from '@/data/products'
import { computeTotals, lineKey, type Gift } from '@/lib/bag'

export { MAX_QTY }

export interface BagLine {
  key: string
  productId: string
  options: Record<string, string>
  qty: number
  gift?: Gift
}

interface BagState {
  items: BagLine[]
  note: string
  add: (productId: string, opts?: { options?: Record<string, string>; qty?: number; gift?: Gift }) => void
  setQty: (key: string, qty: number) => void
  remove: (key: string) => void
  setNote: (note: string) => void
  clear: () => void
}

const clamp = (n: number) => Math.min(MAX_QTY, Math.max(1, Math.floor(Number.isFinite(n) ? n : 1)))

/** Drop lines for removed products or with corrupt data; fix quantities. Used on rehydrate. */
function sanitize(raw: unknown): BagLine[] {
  if (!Array.isArray(raw)) return []
  return raw.flatMap((l: Partial<BagLine>) => {
    if (!l || typeof l.productId !== 'string' || !getProduct(l.productId)) return []
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
  product: Product
}

/** Lines joined to catalogue data, plus totals. */
export function useBagSummary() {
  const items = useBag((s) => s.items)
  return useMemo(() => {
    const lines: ResolvedLine[] = items.flatMap((i) => {
      const product = getProduct(i.productId)
      return product ? [{ ...i, product }] : []
    })
    return { lines, count: lines.reduce((n, l) => n + l.qty, 0), ...computeTotals(lines) }
  }, [items])
}
