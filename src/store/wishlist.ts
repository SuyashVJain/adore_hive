import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { getProduct } from '@/data/products'

interface WishlistState {
  ids: string[]
  toggle: (id: string) => void
  remove: (id: string) => void
  clear: () => void
}

export const useWishlist = create<WishlistState>()(
  persist(
    (set) => ({
      ids: [],
      toggle: (id) => set((s) => ({ ids: s.ids.includes(id) ? s.ids.filter((x) => x !== id) : [...s.ids, id] })),
      remove: (id) => set((s) => ({ ids: s.ids.filter((x) => x !== id) })),
      clear: () => set({ ids: [] }),
    }),
    {
      name: 'adore-wishlist',
      // drop ids of products that no longer exist
      merge: (persisted, current) => {
        const ids = (persisted as Partial<WishlistState> | undefined)?.ids
        return { ...current, ids: Array.isArray(ids) ? [...new Set(ids.filter((i) => typeof i === 'string' && getProduct(i)))] : [] }
      },
    },
  ),
)
