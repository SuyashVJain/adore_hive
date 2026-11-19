import { create } from 'zustand'

interface ToastState {
  toast: { id: number; message: string } | null
  show: (message: string) => void
  hide: () => void
}

let n = 0
export const useToast = create<ToastState>()((set) => ({
  toast: null,
  show: (message) => set({ toast: { id: ++n, message } }),
  hide: () => set({ toast: null }),
}))
