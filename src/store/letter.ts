import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { LETTER_BASE_PRICE, LETTER_MAX, letterDecor, letterEnvelopes, letterPapers } from '@/config/shop'

export interface LetterDraft {
  paper: string
  envelope: string
  decor: string
  to: string
  message: string
  signoff: string
  from: string
  instructions: string
  /** 'bag' = sold on its own, 'hamper' = added to the hamper draft */
  mode: 'bag' | 'hamper'
}

export const defaultLetter: LetterDraft = {
  paper: letterPapers[0].id,
  envelope: letterEnvelopes[0].id,
  decor: letterDecor[0].id,
  to: '',
  message: 'Some little things remind me of you: a favourite song, a soft pink sky, a moment that makes me smile. This is a little reminder that you are so very adored.',
  signoff: 'With love,',
  from: '',
  instructions: '',
  mode: 'bag',
}

export const letterPrice = (l: LetterDraft) =>
  LETTER_BASE_PRICE + (letterPapers.find((x) => x.id === l.paper)?.price ?? 0) + (letterDecor.find((x) => x.id === l.decor)?.price ?? 0) + (letterEnvelopes.find((x) => x.id === l.envelope)?.price ?? 0)

export function letterErrors(l: LetterDraft) {
  const e: Partial<Record<'to' | 'message' | 'from', string>> = {}
  if (!l.to.trim()) e.to = 'Who is this letter for?'
  if (l.message.trim().length < 10) e.message = 'Write a few words for the letter (at least 10 characters).'
  else if (l.message.length > LETTER_MAX) e.message = `Please keep the message within ${LETTER_MAX} characters.`
  if (!l.from.trim()) e.from = 'Add your name for the sign-off.'
  return e
}

interface LetterState {
  draft: LetterDraft
  patch: (p: Partial<LetterDraft>) => void
  reset: () => void
}

const pick = <T extends { id: string }>(list: readonly T[], id: unknown, fallback: string) => (list.some((x) => x.id === id) ? (id as string) : fallback)

export const useLetter = create<LetterState>()(
  persist(
    (set) => ({
      draft: defaultLetter,
      patch: (p) => set((s) => ({ draft: { ...s.draft, ...p } })),
      reset: () => set({ draft: defaultLetter }),
    }),
    {
      name: 'adore-letter',
      merge: (persisted, current) => {
        const d = ((persisted as Partial<LetterState> | undefined)?.draft ?? {}) as Partial<LetterDraft>
        const str = (v: unknown, f: string, max = 2000) => (typeof v === 'string' ? v.slice(0, max) : f)
        return {
          ...current,
          draft: {
            paper: pick(letterPapers, d.paper, defaultLetter.paper),
            envelope: pick(letterEnvelopes, d.envelope, defaultLetter.envelope),
            decor: pick(letterDecor, d.decor, defaultLetter.decor),
            to: str(d.to, ''), message: str(d.message, defaultLetter.message, LETTER_MAX + 200), signoff: str(d.signoff, defaultLetter.signoff, 60), from: str(d.from, ''), instructions: str(d.instructions, ''),
            mode: d.mode === 'hamper' ? 'hamper' : 'bag',
          },
        }
      },
    },
  ),
)
