import { FREE_SHIPPING_OVER, SHIPPING_FEE, giftWrapById } from '@/config/shop'
import type { Product } from '@/data/products'

export interface Gift {
  wrap: string
  note: string
}

export interface LineInput {
  product: Product
  options: Record<string, string>
  qty: number
  gift?: Gift
}

export const unitGiftFee = (gift?: Gift) => (gift ? giftWrapById(gift.wrap)?.fee ?? 0 : 0)
export const lineTotal = (l: LineInput) => l.qty * (l.product.price + unitGiftFee(l.gift))

/** One place for bag maths: used by the drawer, the bag page and the sticky checkout bar. */
export function computeTotals(lines: LineInput[]) {
  const subtotal = lines.reduce((n, l) => n + l.qty * l.product.price, 0)
  const giftFees = lines.reduce((n, l) => n + l.qty * unitGiftFee(l.gift), 0)
  const shipping = lines.length === 0 || subtotal >= FREE_SHIPPING_OVER ? 0 : SHIPPING_FEE
  return {
    subtotal,
    giftFees,
    shipping,
    total: subtotal + giftFees + shipping,
    /** Rupees still needed for free shipping (0 once reached or bag empty) */
    freeShippingGap: lines.length === 0 ? 0 : Math.max(0, FREE_SHIPPING_OVER - subtotal),
  }
}

export const optionsLabel = (options: Record<string, string>) => Object.values(options).join(' · ')

export const lineKey = (productId: string, options: Record<string, string>, gift?: Gift) =>
  [productId, Object.entries(options).sort().map(([k, v]) => `${k}=${v}`).join(','), gift ? `${gift.wrap}:${gift.note}` : ''].join('|')
