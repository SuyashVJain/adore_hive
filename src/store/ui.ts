import { create } from 'zustand'

export type Panel = 'bag' | 'search' | 'menu' | 'shop'

interface UIState {
  /** Only one overlay at a time, so the page dims consistently. */
  panel: Panel | null
  open: (p: Panel) => void
  close: () => void
}

export const useUI = create<UIState>()((set) => ({
  panel: null,
  open: (panel) => set({ panel }),
  close: () => set({ panel: null }),
}))
