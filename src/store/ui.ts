import { create } from 'zustand'

export type Panel = 'bag' | 'search' | 'menu' | 'shop' | 'quickview'

interface UIState {
  /** Only one overlay at a time, so the page dims consistently. */
  panel: Panel | null
  quickId: string | null
  open: (p: Panel) => void
  openQuick: (id: string) => void
  close: () => void
}

export const useUI = create<UIState>()((set) => ({
  panel: null,
  quickId: null,
  open: (panel) => set({ panel }),
  openQuick: (quickId) => set({ panel: 'quickview', quickId }),
  close: () => set({ panel: null }),
}))
