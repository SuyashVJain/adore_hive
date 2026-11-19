import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { getProduct } from '@/data/products'

const KEEP = 8

interface RecentState {
  ids: string[]
  /** Newest first, no duplicates */
  add: (id: string) => void
}

export const useRecent = create<RecentState>()(
  persist(
    (set) => ({
      ids: [],
      add: (id) => set((s) => (s.ids[0] === id ? s : { ids: [id, ...s.ids.filter((x) => x !== id)].slice(0, KEEP) })),
    }),
    {
      name: 'adore-recent',
      // drop ids of products that no longer exist, and anything that is not a string
      merge: (persisted, current) => {
        const ids = (persisted as Partial<RecentState> | undefined)?.ids
        return { ...current, ids: Array.isArray(ids) ? ids.filter((i): i is string => typeof i === 'string' && !!getProduct(i)).slice(0, KEEP) : [] }
      },
    },
  ),
)
