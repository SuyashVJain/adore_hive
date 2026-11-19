// Mock commerce rules. TODO: replace with real values / services before launch.

export const FREE_SHIPPING_OVER = 999
export const SHIPPING_FEE = 60
export const MAX_QTY = 10

// Returns policy, as confirmed by the owner. The Returns page and the product page both read these.
export const RETURN_DAYS = 3
export const RETURN_FEE = 150
export const RETURN_PICKUP_DAYS = { min: 3, max: 5 }
export const RETURN_SELF_SHIP_DAYS = 7
export const REFUND_DAYS = 7

export const giftWraps = [
  { id: 'blush-ribbon', label: 'Blush ribbon wrap', fee: 49 },
  { id: 'kraft-twine', label: 'Kraft paper & twine', fee: 29 },
  { id: 'keepsake-box', label: 'Keepsake gift box', fee: 149 },
] as const

export type GiftWrapId = (typeof giftWraps)[number]['id']
export const giftWrapById = (id: string) => giftWraps.find((w) => w.id === id)
export const GIFT_NOTE_MAX = 140

export const delivery = { minDays: 3, maxDays: 5 }

// TODO: wire to a real pincode serviceability / ETA service.
export function estimateDelivery(pin: string): { ok: true; message: string } | { ok: false; message: string } {
  if (!/^[1-9]\d{5}$/.test(pin.trim())) return { ok: false, message: 'Please enter a valid 6-digit PIN code.' }
  return { ok: true, message: `Delivers in ${delivery.minDays} to ${delivery.maxDays} days` }
}

// ---- Studios (mock prices, TODO: replace with real pricing) ----

export const hamperOccasions = ['Birthday', 'Anniversary', 'Valentine’s Day', 'Friendship', 'Festive', 'Just Because']

export const hamperBoxes = [
  { id: 'blush-keepsake', label: 'Blush keepsake box', price: 399 },
  { id: 'ivory-gift', label: 'Ivory gift box', price: 349 },
  { id: 'natural-basket', label: 'Natural basket', price: 299 },
] as const

export const hamperRibbons = [
  { id: 'ivory-satin', label: 'Ivory satin', price: 49 },
  { id: 'rose-ribbon', label: 'Rose ribbon', price: 49 },
  { id: 'gold-detail', label: 'Gold detail', price: 99 },
] as const

export const HAMPER_NOTE_PRICE = 99
export const NOTE_MAX = 280

export const letterPapers = [
  { id: 'ivory-textured', label: 'Ivory textured', price: 0, color: '#fffaf3' },
  { id: 'blush-paper', label: 'Blush paper', price: 0, color: '#f9e6e4' },
  { id: 'deckled', label: 'Deckled handmade', price: 30, color: '#f4efe4' },
] as const

export const letterEnvelopes = [
  { id: 'blush', label: 'Blush envelope', price: 0, color: '#e3b9b5' },
  { id: 'ivory', label: 'Ivory envelope', price: 0, color: '#efe5d3' },
  { id: 'kraft', label: 'Natural kraft', price: 0, color: '#c4a074' },
] as const

export const letterDecor = [
  { id: 'floral', label: 'Floral detail', price: 20 },
  { id: 'wax-seal', label: 'Gold wax seal', price: 40 },
  { id: 'ribbon', label: 'Ribbon', price: 25 },
  { id: 'minimal', label: 'Minimal', price: 0 },
] as const

export const LETTER_BASE_PRICE = 249
export const LETTER_MAX = 600
