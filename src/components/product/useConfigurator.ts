import { useState } from 'react'
import type { Product } from '@/data/products'
import type { Gift } from '@/lib/bag'
import { useBag } from '@/store/bag'
import { useToast } from '@/store/toast'

/** Option / quantity / gift state shared by the product page and the quick view. */
export function useConfigurator(product: Product) {
  const [selected, setSelected] = useState<Record<string, string>>({})
  const [qty, setQty] = useState(1)
  const [gift, setGift] = useState<Gift | undefined>()
  const [tried, setTried] = useState(false)

  const missing = product.options.filter((o) => !selected[o.name]).map((o) => o.name)
  const soldOut = product.stock === 'out'
  const canAdd = !soldOut && missing.length === 0
  const message = missing.length ? `Choose your ${missing.map((m) => m.toLowerCase()).join(' and ')} to add this to your bag.` : ''

  const add = () => {
    if (!canAdd) return false
    useBag.getState().add(product.id, { options: selected, qty, gift })
    useToast.getState().show('Added to bag')
    return true
  }

  return { selected, select: (name: string, v: string) => setSelected((s) => ({ ...s, [name]: v })), qty, setQty, gift, setGift, missing, canAdd, soldOut, message, add, tried, setTried }
}

export type Configurator = ReturnType<typeof useConfigurator>
