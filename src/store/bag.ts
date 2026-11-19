import { useMemo } from 'react'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { getProduct, type Product } from '@/data/products'

export const MAX_QTY = 10

export interface BagLine {
  key: string
  productId: string
  variant?: string
  qty: number
}

interface BagState {
  items: BagLine[]
  add: (productId: string, variant?: string, qty?: number) => void
  setQty: (key: string, qty: number) => void
  remove: (key: string) => void
  clear: () => void
}

const clamp = (n: number) => Math.min(MAX_QTY, Math.max(1, n))

export const useBag = create<BagState>()(
  persist(
    (set) => ({
      items: [],
      add: (productId, variant, qty = 1) =>
        set((s) => {
          const key = `${productId}|${variant ?? ''}`
          const hit = s.items.find((i) => i.key === key)
          return {
            items: hit
              ? s.items.map((i) => (i.key === key ? { ...i, qty: clamp(i.qty + qty) } : i))
              : [...s.items, { key, productId, variant, qty: clamp(qty) }],
          }
        }),
      setQty: (key, qty) => set((s) => ({ items: s.items.map((i) => (i.key === key ? { ...i, qty: clamp(qty) } : i)) })),
      remove: (key) => set((s) => ({ items: s.items.filter((i) => i.key !== key) })),
      clear: () => set({ items: [] }),
    }),
    { name: 'adore-bag' },
  ),
)

export interface ResolvedLine extends BagLine {
  product: Product
}

/** Lines joined to catalogue data, plus totals. Lines whose product no longer exists are dropped. */
export function useBagSummary() {
  const items = useBag((s) => s.items)
  return useMemo(() => {
    const lines: ResolvedLine[] = items.flatMap((i) => {
      const product = getProduct(i.productId)
      return product ? [{ ...i, product }] : []
    })
    return {
      lines,
      count: lines.reduce((n, l) => n + l.qty, 0),
      subtotal: lines.reduce((n, l) => n + l.qty * l.product.price, 0),
    }
  }, [items])
}
