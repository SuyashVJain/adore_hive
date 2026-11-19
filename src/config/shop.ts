// Mock commerce rules. TODO: replace with real values / services before launch.

export const FREE_SHIPPING_OVER = 999
export const SHIPPING_FEE = 60
export const MAX_QTY = 10
export const RETURN_DAYS = 7

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
