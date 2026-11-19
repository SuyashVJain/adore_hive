import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface SearchState {
  query: string
  recent: string[]
  setQuery: (q: string) => void
  addRecent: (q: string) => void
  clearRecent: () => void
}

export const useSearch = create<SearchState>()(
  persist(
    (set) => ({
      query: '',
      recent: [],
      setQuery: (query) => set({ query }),
      addRecent: (q) => {
        const t = q.trim()
        if (!t) return
        set((s) => ({ recent: [t, ...s.recent.filter((r) => r.toLowerCase() !== t.toLowerCase())].slice(0, 5) }))
      },
      clearRecent: () => set({ recent: [] }),
    }),
    { name: 'adore-search', partialize: (s) => ({ recent: s.recent }) },
  ),
)
