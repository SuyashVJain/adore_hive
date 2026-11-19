import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { MAX_QTY } from '@/config/shop'
import { hamperBoxes, hamperOccasions, hamperRibbons } from '@/config/shop'
import { getTreasure } from '@/data/hamper'

export interface HamperItem {
  qty: number
  options: Record<string, string>
}

export interface HamperNote {
  on: boolean
  to: string
  message: string
  from: string
  instructions: string
  includePrices: boolean
  surprise: boolean
}

/** A finished letter attached to the hamper from the letter studio. */
export interface HamperLetter {
  paper: string
  envelope: string
  decor: string
  to: string
  message: string
  signoff: string
  from: string
  instructions: string
  price: number
}

export interface HamperDraft {
  occasion: string
  recipient: string
  date: string
  box: string
  ribbon: string
  items: Record<string, HamperItem>
  note: HamperNote
  letter: HamperLetter | null
}

export const defaultHamper: HamperDraft = {
  occasion: hamperOccasions[0],
  recipient: '',
  date: '',
  box: hamperBoxes[0].id,
  ribbon: hamperRibbons[0].id,
  items: {},
  note: { on: true, to: '', message: '', from: '', instructions: '', includePrices: false, surprise: false },
  letter: null,
}

interface HamperState {
  draft: HamperDraft
  patch: (p: Partial<HamperDraft>) => void
  patchNote: (p: Partial<HamperNote>) => void
  setItem: (id: string, item: HamperItem | null) => void
  reset: () => void
}

export const useHamper = create<HamperState>()(
  persist(
    (set) => ({
      draft: defaultHamper,
      patch: (p) => set((s) => ({ draft: { ...s.draft, ...p } })),
      patchNote: (p) => set((s) => ({ draft: { ...s.draft, note: { ...s.draft.note, ...p } } })),
      setItem: (id, item) =>
        set((s) => {
          const items = { ...s.draft.items }
          if (item === null) delete items[id]
          else items[id] = { qty: Math.min(MAX_QTY, Math.max(1, Math.floor(item.qty))), options: item.options }
          return { draft: { ...s.draft, items } }
        }),
      reset: () => set({ draft: defaultHamper }),
    }),
    {
      name: 'adore-hamper',
      // Rebuild the draft defensively: unknown products, bad quantities and stale ids are dropped
      merge: (persisted, current) => {
        const d = ((persisted as Partial<HamperState> | undefined)?.draft ?? {}) as Partial<HamperDraft>
        const str = (v: unknown, max = 2000) => (typeof v === 'string' ? v.slice(0, max) : '')
        const items: Record<string, HamperItem> = {}
        for (const [id, it] of Object.entries(d.items ?? {})) {
          const t = getTreasure(id)
          if (!t || !it || typeof it !== 'object') continue
          const options: Record<string, string> = {}
          for (const o of t.options) options[o.name] = o.values.includes((it.options ?? {})[o.name]) ? it.options[o.name] : o.values[0]
          items[id] = { qty: Math.min(MAX_QTY, Math.max(1, Math.floor(Number(it.qty)) || 1)), options }
        }
        const n = (d.note ?? {}) as Partial<HamperNote>
        const l = d.letter
        return {
          ...current,
          draft: {
            occasion: hamperOccasions.includes(d.occasion ?? '') ? (d.occasion as string) : defaultHamper.occasion,
            recipient: str(d.recipient, 80),
            date: /^\d{4}-\d{2}-\d{2}$/.test(d.date ?? '') ? (d.date as string) : '',
            box: hamperBoxes.some((b) => b.id === d.box) ? (d.box as string) : defaultHamper.box,
            ribbon: hamperRibbons.some((r) => r.id === d.ribbon) ? (d.ribbon as string) : defaultHamper.ribbon,
            items,
            note: { on: n.on !== false, to: str(n.to, 80), message: str(n.message, 600), from: str(n.from, 80), instructions: str(n.instructions, 600), includePrices: !!n.includePrices, surprise: !!n.surprise },
            letter: l && typeof l === 'object' && typeof l.message === 'string' && typeof l.price === 'number' ? l : null,
          },
        }
      },
    },
  ),
)
