import { images } from './images'
import { products, type ProductOption } from './products'

export const treasureGroups = ['Jewellery', 'Hair', 'Crochet', 'Chocolates & small gifts'] as const
export type TreasureGroup = (typeof treasureGroups)[number]

export interface Treasure {
  id: string
  name: string
  subtitle: string
  price: number
  image: string
  group: TreasureGroup
  options: ProductOption[]
}

const groupOf = { jewellery: 'Jewellery', 'hair-accessories': 'Hair', 'handmade-crochet': 'Crochet' } as const

/** What can go in a hamper: catalogue items that are in stock (not hampers themselves), plus a small-gift extra. */
export const treasures: Treasure[] = [
  ...products
    .filter((p) => p.category !== 'customized-gifting' && p.stock !== 'out')
    .map((p): Treasure => ({ id: p.id, name: p.name, subtitle: p.subtitle, price: p.price, image: p.image, group: groupOf[p.category as keyof typeof groupOf], options: p.options })),
  // TODO: mock price and product, replace with the real chocolate / small gift selection
  { id: 'chocolates', name: 'Chocolate & Small Gift Selection', subtitle: 'Optional little extras', price: 299, image: '/images/p-chocolates.webp', group: 'Chocolates & small gifts', options: [] },
]

export const getTreasure = (id: string) => treasures.find((t) => t.id === id)
export const hamperImage = images.lifestyle.hamper
