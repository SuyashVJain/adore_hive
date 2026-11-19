import { HAMPER_NOTE_PRICE, NOTE_MAX, hamperBoxes, hamperRibbons, letterDecor, letterEnvelopes, letterPapers } from '@/config/shop'
import { getTreasure } from '@/data/hamper'
import { hamperImage } from '@/data/hamper'
import type { CustomLine } from '@/lib/bag'
import { formatINR } from '@/lib/format'
import type { HamperDraft } from '@/store/hamper'

export const STEPS = ['Occasion', 'Packaging', 'Little treasures', 'Your note', 'Review'] as const

export const boxOf = (d: HamperDraft) => hamperBoxes.find((b) => b.id === d.box) ?? hamperBoxes[0]
export const ribbonOf = (d: HamperDraft) => hamperRibbons.find((r) => r.id === d.ribbon) ?? hamperRibbons[0]

export function hamperTotals(d: HamperDraft) {
  const packaging = boxOf(d).price + ribbonOf(d).price
  const entries = Object.entries(d.items).flatMap(([id, it]) => {
    const t = getTreasure(id)
    return t ? [{ t, ...it }] : []
  })
  const treasures = entries.reduce((n, e) => n + e.qty * e.t.price, 0)
  const note = d.note.on ? HAMPER_NOTE_PRICE : 0
  const letter = d.letter?.price ?? 0
  return { packaging, treasures, note, letter, total: packaging + treasures + note + letter, itemCount: entries.reduce((n, e) => n + e.qty, 0), entries }
}

const todayISO = () => new Date().toISOString().slice(0, 10)

/** Errors for one step. Empty object = the step is valid. */
export function stepErrors(d: HamperDraft, step: number): Record<string, string> {
  const e: Record<string, string> = {}
  if (step === 1) {
    if (!d.recipient.trim()) e.recipient = 'Who is this hamper for? Add their name.'
    if (d.date && d.date < todayISO()) e.date = 'That date has already passed. Pick today or a later date, or leave it blank.'
  }
  if (step === 3 && hamperTotals(d).itemCount < 1) e.items = 'Add at least one little treasure to your hamper.'
  if (step === 4 && d.note.on) {
    if (!d.note.to.trim()) e.to = 'Who is the note for?'
    if (!d.note.message.trim()) e.message = 'Write a few words for the note.'
    else if (d.note.message.length > NOTE_MAX) e.message = `Please keep the note within ${NOTE_MAX} characters.`
    if (!d.note.from.trim()) e.from = 'Add your name for the signature.'
  }
  return e
}

/** Highest step the visitor may open: every earlier step must be valid. */
export function maxStep(d: HamperDraft): number {
  for (let s = 1; s <= 4; s++) if (Object.keys(stepErrors(d, s)).length) return s
  return 5
}

export function letterContents(l: NonNullable<HamperDraft['letter']>) {
  const paper = letterPapers.find((p) => p.id === l.paper)?.label
  const env = letterEnvelopes.find((p) => p.id === l.envelope)?.label
  const dec = letterDecor.find((p) => p.id === l.decor)?.label
  return `Handwritten letter to ${l.to}: ${[paper, env, dec].filter(Boolean).join(', ')}`
}

export function hamperContents(d: HamperDraft): string[] {
  const t = hamperTotals(d)
  const lines = [`${boxOf(d).label} with ${ribbonOf(d).label.toLowerCase()}`]
  for (const e of t.entries) {
    const opts = Object.values(e.options).join(', ')
    lines.push(`${e.t.name} × ${e.qty}${opts ? ` (${opts})` : ''}`)
  }
  if (d.note.on) lines.push(`Handwritten note to ${d.note.to || d.recipient}${d.note.surprise ? ', kept a surprise' : ''}`)
  if (d.letter) lines.push(letterContents(d.letter))
  return lines
}

export function hamperToCustomLine(d: HamperDraft): CustomLine {
  return {
    type: 'hamper',
    name: `${d.occasion} hamper for ${d.recipient.trim()}`,
    image: hamperImage,
    price: hamperTotals(d).total,
    subtitle: `${boxOf(d).label} · ${ribbonOf(d).label}`,
    contents: hamperContents(d),
    href: '/hamper-studio?step=5',
  }
}

export const summaryText = (d: HamperDraft) => `${d.occasion} hamper for ${d.recipient || 'someone lovely'}, ${formatINR(hamperTotals(d).total)}`
