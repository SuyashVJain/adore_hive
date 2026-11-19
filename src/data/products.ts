import { images, type ProductSlug } from './images'

export type CategorySlug = 'jewellery' | 'hair-accessories' | 'handmade-crochet' | 'customized-gifting'

export interface Product {
  id: ProductSlug
  name: string
  category: CategorySlug
  subtitle: string
  description: string
  badge: string
  /** INR, whole rupees. TODO: mock prices, replace with real pricing. */
  price: number
  variants?: string[]
  tags: string[]
  /** Sub-category slugs, matching the Shop dropdown items */
  types: string[]
  colours: Colour[]
  handmade: boolean
  personalizable: boolean
  /** Higher = newer. Array order is the Featured order. */
  added: number
  image: string
}

export type Colour = 'Blush' | 'Ivory' | 'Gold'
export const colours: Colour[] = ['Blush', 'Ivory', 'Gold']

export const categories: { slug: CategorySlug; label: string; blurb: string }[] = [
  { slug: 'jewellery', label: 'Jewellery', blurb: 'Delicate pieces for everyday sparkle.' },
  { slug: 'hair-accessories', label: 'Hair Accessories', blurb: 'Bows, clips and scrunchies with a soft touch.' },
  { slug: 'handmade-crochet', label: 'Handmade Crochet', blurb: 'Little blooms, stitched slowly by hand.' },
  { slug: 'customized-gifting', label: 'Customized Gifting', blurb: 'Gifts that say it all, made just for them.' },
]

export const categoryLabel = (c: CategorySlug) => categories.find((x) => x.slug === c)!.label

type Seed = Omit<Product, 'image'>
const seeds: Seed[] = [
  { id: 'pearl-whisper-earrings', name: 'Pearl Whisper Earrings', category: 'jewellery', subtitle: 'Pearl-inspired drops', description: 'A delicate little finishing touch, for moments big and small.', badge: 'Best loved', price: 899, variants: ['Gold tone', 'Rose tone'], tags: ['pearl', 'earrings', 'gold'], types: ['earrings'], colours: ['Ivory', 'Gold'], handmade: false, personalizable: false, added: 5 },
  { id: 'blush-satin-bow', name: 'Blush Satin Bow', category: 'hair-accessories', subtitle: 'Blush satin · Ribbon bow', description: 'A soft satin bow that dresses up any ponytail.', badge: 'New', price: 349, tags: ['bow', 'satin', 'ribbon'], types: ['hair-bows'], colours: ['Blush'], handmade: false, personalizable: false, added: 11 },
  { id: 'little-daisy-bouquet', name: 'Little Daisy Bouquet', category: 'handmade-crochet', subtitle: 'Crochet daisies · Gift wrapped', description: 'A hand-crocheted bouquet that never wilts.', badge: 'Handmade', price: 699, tags: ['crochet', 'flowers', 'bouquet'], types: ['crochet-flowers', 'crochet-bouquets', 'handmade-gifts'], colours: [], handmade: true, personalizable: false, added: 8 },
  { id: 'little-love-hamper', name: 'A Little Love Hamper', category: 'customized-gifting', subtitle: 'Birthday · Blush keepsake box', description: 'A keepsake box of little treasures, wrapped with a handwritten note.', badge: 'Personalize', price: 2499, variants: ['Birthday', 'Anniversary', 'Friendship'], tags: ['hamper', 'gift', 'personalized hampers'], types: ['personalized-hampers', 'birthday-hampers', 'special-occasion-gifts'], colours: [], handmade: true, personalizable: true, added: 6 },
  { id: 'golden-hour-necklace', name: 'Golden Hour Necklace', category: 'jewellery', subtitle: 'Gold-tone pendant', description: 'A sun-warm pendant on a fine chain.', badge: "Owner's pick", price: 1299, tags: ['necklace', 'pendant', 'gold'], types: ['necklaces', 'pendants'], colours: ['Gold'], handmade: false, personalizable: false, added: 7 },
  { id: 'pearl-cloud-claw-clip', name: 'Pearl Cloud Claw Clip', category: 'hair-accessories', subtitle: 'Pearl-trimmed claw clip', description: 'A pearl-trimmed claw clip with a gentle grip.', badge: 'Everyday love', price: 449, tags: ['pearl', 'claw clip', 'clip'], types: ['claw-clips', 'cute-everyday-accessories'], colours: ['Ivory'], handmade: false, personalizable: false, added: 12 },
  { id: 'forever-tulip-stem', name: 'Forever Tulip Stem', category: 'handmade-crochet', subtitle: 'Crochet tulip', description: 'A single crochet tulip, made to last forever.', badge: 'Made with love', price: 199, tags: ['crochet', 'flowers', 'tulip'], types: ['crochet-flowers', 'handmade-gifts'], colours: [], handmade: true, personalizable: false, added: 4 },
  { id: 'words-from-the-heart', name: 'Words From the Heart', category: 'customized-gifting', subtitle: 'Handwritten letter', description: 'Your words, handwritten on deckle-edge paper and sealed with wax.', badge: 'Personalize', price: 599, tags: ['letter', 'handwritten', 'handwritten letters'], types: ['handwritten-letters'], colours: [], handmade: true, personalizable: true, added: 3 },
  { id: 'petal-charm-bracelet', name: 'Petal Charm Bracelet', category: 'jewellery', subtitle: 'Flower charm · Pearl bead', description: 'A fine chain bracelet with a tiny flower charm.', badge: 'Little treasure', price: 799, tags: ['bracelet', 'charm', 'pearl'], types: ['bracelets'], colours: ['Gold', 'Ivory'], handmade: false, personalizable: false, added: 9 },
  { id: 'rosewater-scrunchie', name: 'Rosewater Scrunchie', category: 'hair-accessories', subtitle: 'Rose satin', description: 'A silky scrunchie that is kind to your hair.', badge: 'Soft essential', price: 249, tags: ['scrunchie', 'satin'], types: ['scrunchies'], colours: ['Blush'], handmade: false, personalizable: false, added: 10 },
  { id: 'daisy-day-bag-charm', name: 'Daisy Day Bag Charm', category: 'handmade-crochet', subtitle: 'Crochet daisy · Gold clasp', description: 'A crochet daisy to brighten your favourite bag.', badge: 'Handmade', price: 279, tags: ['crochet', 'daisy', 'keychain'], types: ['crochet-accessories', 'handmade-gifts'], colours: [], handmade: true, personalizable: false, added: 2 },
  { id: 'just-because-gift-box', name: 'Just Because Gift Box', category: 'customized-gifting', subtitle: 'Stacked gift boxes', description: 'A stack of little gifts, wrapped and ready for no reason at all.', badge: 'Your way', price: 1899, tags: ['gift', 'box', 'hamper'], types: ['friendship-hampers', 'anniversary-hampers', 'special-occasion-gifts'], colours: [], handmade: false, personalizable: true, added: 1 },
]

export const products: Product[] = seeds.map((s) => ({ ...s, image: images.products[s.id] }))
export const getProduct = (id: string) => products.find((p) => p.id === id)

export function searchProducts(q: string): Product[] {
  const t = q.trim().toLowerCase()
  if (!t) return []
  return products.filter((p) =>
    [p.name, categoryLabel(p.category), p.subtitle, ...p.tags].some((s) => s.toLowerCase().includes(t)),
  )
}

/** Homepage rows. Each product appears in exactly one row. */
export const homeRows = {
  bestSellers: ['pearl-whisper-earrings', 'golden-hour-necklace', 'petal-charm-bracelet', 'just-because-gift-box'],
  newArrivals: ['pearl-cloud-claw-clip', 'blush-satin-bow', 'rosewater-scrunchie', 'words-from-the-heart'],
  handmade: ['little-daisy-bouquet', 'forever-tulip-stem', 'daisy-day-bag-charm', 'little-love-hamper'],
} satisfies Record<string, ProductSlug[]>
