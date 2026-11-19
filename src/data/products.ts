import { galleryFor, images, type ProductSlug } from './images'

export type CategorySlug = 'jewellery' | 'hair-accessories' | 'handmade-crochet' | 'customized-gifting'
export type Colour = 'Blush' | 'Ivory' | 'Gold'
export const colours: Colour[] = ['Blush', 'Ivory', 'Gold']
export type Stock = 'in' | 'out'

export interface ProductOption {
  name: string
  values: string[]
}

export interface Product {
  id: ProductSlug
  name: string
  category: CategorySlug
  subtitle: string
  description: string
  /** Longer copy for the "lovely details" accordion */
  details: string
  /** Optional label on the card. Only set it when it is true. */
  badge?: string
  /** INR, whole rupees. TODO: mock prices, replace with real pricing. */
  price: number
  /** Original price when the item is on sale. Sale items are not eligible for returns. */
  compareAtPrice?: number
  /** Every option is required before adding to bag */
  options: ProductOption[]
  /** TODO: mock stock states */
  stock: Stock
  tags: string[]
  /** Sub-category slugs, matching the Shop dropdown items */
  types: string[]
  colours: Colour[]
  handmade: boolean
  personalizable: boolean
  /** Higher = newer. Array order is the Featured order. */
  added: number
  image: string
  /** Main image first, then extras */
  gallery: string[]
}

export const categories: { slug: CategorySlug; label: string; blurb: string; care: string; packaging: string }[] = [
  {
    slug: 'jewellery', label: 'Jewellery', blurb: 'Delicate pieces for everyday sparkle.',
    care: 'Keep dry and away from perfume, lotion and water. Wipe gently with a soft cloth and store in the pouch provided when you are not wearing it.',
    packaging: 'Arrives in a blush pouch inside a keepsake box, ready to gift.',
  },
  {
    slug: 'hair-accessories', label: 'Hair Accessories', blurb: 'Bows, clips and scrunchies with a soft touch.',
    care: 'Wipe gently with a soft dry cloth. Keep satin and pearl details away from direct heat and store flat to keep their shape.',
    packaging: 'Arrives wrapped in tissue and a small gift bag, ready to give.',
  },
  {
    slug: 'handmade-crochet', label: 'Handmade Crochet', blurb: 'Little blooms, stitched slowly by hand.',
    care: 'Spot clean with a damp cloth and a little mild soap. Reshape by hand and air dry flat, away from direct sunlight. Please do not machine wash.',
    packaging: 'Wrapped in tissue and tied with ribbon, with a handwritten thank-you tag.',
  },
  {
    slug: 'customized-gifting', label: 'Customized Gifting', blurb: 'Gifts that say it all, made just for them.',
    care: 'Keep your keepsake box dry and out of direct sunlight. Store handwritten letters flat to protect the paper.',
    packaging: 'Packed in a blush keepsake box with shredded paper and ribbon. Add a handwritten note at checkout.',
  },
]

export const categoryLabel = (c: CategorySlug) => categories.find((x) => x.slug === c)!.label

type Seed = Omit<Product, 'image' | 'gallery'>
const seeds: Seed[] = [
  { id: 'pearl-whisper-earrings', name: 'Pearl Whisper Earrings', category: 'jewellery', subtitle: 'Pearl-inspired drops', description: 'Just a little shimmer. Pearl-inspired drops and delicate gold-tone details bring a soft finishing touch to everyday moments.', details: 'Pearl-inspired drop design with delicate gold-tone detailing. Lightweight enough for all-day wear, with secure butterfly backs. Choose a gold or rose-tone finish and a pearl or petal drop.', badge: 'Best loved', price: 899, options: [{ name: 'Finish', values: ['Gold tone', 'Rose tone'] }, { name: 'Style', values: ['Pearl drop', 'Petal drop'] }], stock: 'in', tags: ['pearl', 'earrings', 'gold'], types: ['earrings'], colours: ['Ivory', 'Gold'], handmade: false, personalizable: false, added: 5 },
  { id: 'blush-satin-bow', name: 'Blush Satin Bow', category: 'hair-accessories', subtitle: 'Blush satin · Ribbon bow', description: 'A soft satin bow that dresses up any ponytail, braid or half-up style.', details: 'A generous ribbon bow in smooth satin with a secure clip. Sits flat against the hair and holds its shape through the day.', badge: 'New', price: 349, options: [{ name: 'Colour', values: ['Blush', 'Ivory'] }], stock: 'in', tags: ['bow', 'satin', 'ribbon'], types: ['hair-bows'], colours: ['Blush'], handmade: false, personalizable: false, added: 11 },
  { id: 'little-daisy-bouquet', name: 'Little Daisy Bouquet', category: 'handmade-crochet', subtitle: 'Crochet daisies · Gift wrapped', description: 'A hand-crocheted bouquet of daisies and tulips that never wilts.', details: 'Crocheted by hand in soft cotton yarn and wrapped in tissue with a ribbon. Each bouquet is slightly different, which is part of its charm.', badge: 'Handmade', price: 699, options: [], stock: 'in', tags: ['crochet', 'flowers', 'bouquet'], types: ['crochet-flowers', 'crochet-bouquets', 'handmade-gifts'], colours: [], handmade: true, personalizable: false, added: 8 },
  { id: 'little-love-hamper', name: 'A Little Love Hamper', category: 'customized-gifting', subtitle: 'Blush keepsake box', description: 'A keepsake box of little treasures, wrapped with a handwritten note.', details: 'A blush keepsake box with earrings, a satin scrunchie, a crochet daisy, a sweet treat and a handwritten note. Pick the occasion and we will wrap it to match.', badge: 'Personalize', price: 2499, options: [{ name: 'Occasion', values: ['Birthday', 'Anniversary', 'Friendship'] }], stock: 'in', tags: ['hamper', 'gift', 'personalized hampers'], types: ['personalized-hampers', 'birthday-hampers', 'special-occasion-gifts'], colours: [], handmade: true, personalizable: true, added: 6 },
  { id: 'golden-hour-necklace', name: 'Golden Hour Necklace', category: 'jewellery', subtitle: 'Gold-tone pendant', description: 'A sun-warm pendant on a fine chain, made to be layered or worn alone.', details: 'A softly hammered round pendant on a fine chain with an adjustable length. Wear it alone or layer it with other chains.', price: 1299, options: [{ name: 'Finish', values: ['Gold tone', 'Rose tone'] }], stock: 'in', tags: ['necklace', 'pendant', 'gold'], types: ['necklaces', 'pendants'], colours: ['Gold'], handmade: false, personalizable: false, added: 7 },
  { id: 'pearl-cloud-claw-clip', name: 'Pearl Cloud Claw Clip', category: 'hair-accessories', subtitle: 'Pearl-trimmed claw clip', description: 'A pearl-trimmed claw clip with a gentle grip, for effortless updos.', details: 'A medium claw clip trimmed with pearl-inspired beads. Holds thick or fine hair without pulling.', badge: 'Everyday love', price: 449, options: [], stock: 'in', tags: ['pearl', 'claw clip', 'clip'], types: ['claw-clips', 'cute-everyday-accessories'], colours: ['Ivory'], handmade: false, personalizable: false, added: 12 },
  { id: 'forever-tulip-stem', name: 'Forever Tulip Stem', category: 'handmade-crochet', subtitle: 'Crochet tulip', description: 'A single crochet tulip, made to last forever.', details: 'A single tulip stitched by hand with a wire stem you can bend and arrange. Lovely in a vase, on a desk or tucked into a gift.', badge: 'Made with love', price: 199, options: [], stock: 'out', tags: ['crochet', 'flowers', 'tulip'], types: ['crochet-flowers', 'handmade-gifts'], colours: [], handmade: true, personalizable: false, added: 4 },
  { id: 'words-from-the-heart', name: 'Words From the Heart', category: 'customized-gifting', subtitle: 'Handwritten letter', description: 'Your words, handwritten on deckle-edge paper and sealed with wax.', details: 'Tell us what you would like to say and we will handwrite it on deckle-edge paper, then seal it in an envelope with a wax stamp.', badge: 'Personalize', price: 599, options: [], stock: 'in', tags: ['letter', 'handwritten', 'handwritten letters'], types: ['handwritten-letters'], colours: [], handmade: true, personalizable: true, added: 3 },
  { id: 'petal-charm-bracelet', name: 'Petal Charm Bracelet', category: 'jewellery', subtitle: 'Flower charm · Pearl bead', description: 'A fine chain bracelet with a tiny flower charm and a single pearl bead.', details: 'A fine chain bracelet with a flower charm and pearl-inspired bead. Adjustable with a lobster clasp.', badge: 'Little treasure', price: 799, options: [{ name: 'Finish', values: ['Gold tone', 'Silver tone'] }], stock: 'in', tags: ['bracelet', 'charm', 'pearl'], types: ['bracelets'], colours: ['Gold', 'Ivory'], handmade: false, personalizable: false, added: 9 },
  { id: 'rosewater-scrunchie', name: 'Rosewater Scrunchie', category: 'hair-accessories', subtitle: 'Rose satin', description: 'A silky scrunchie that is kind to your hair.', details: 'A soft satin scrunchie that holds without creasing or tugging. Sleeps well in a ponytail too.', badge: 'Soft essential', price: 249, options: [{ name: 'Colour', values: ['Rosewater', 'Ivory'] }], stock: 'in', tags: ['scrunchie', 'satin'], types: ['scrunchies'], colours: ['Blush'], handmade: false, personalizable: false, added: 10 },
  { id: 'daisy-day-bag-charm', name: 'Daisy Day Bag Charm', category: 'handmade-crochet', subtitle: 'Crochet daisy · Gold clasp', description: 'A crochet daisy to brighten your favourite bag.', details: 'A crocheted daisy on a braided loop with a gold-tone clasp. Clips onto bags, keys or zips.', badge: 'Handmade', price: 279, options: [], stock: 'in', tags: ['crochet', 'daisy', 'keychain'], types: ['crochet-accessories', 'handmade-gifts'], colours: [], handmade: true, personalizable: false, added: 2 },
  { id: 'just-because-gift-box', name: 'Just Because Gift Box', category: 'customized-gifting', subtitle: 'Stacked gift boxes', description: 'A stack of little gifts, wrapped and ready for no reason at all.', details: 'A stack of small boxes tied with ribbon and filled with a curated mix of little treasures. Add a note and we will tuck it in.', badge: 'Your way', price: 1899, options: [], stock: 'in', tags: ['gift', 'box', 'hamper'], types: ['friendship-hampers', 'anniversary-hampers', 'special-occasion-gifts'], colours: [], handmade: false, personalizable: true, added: 1 },
]

export const products: Product[] = seeds.map((s) => ({ ...s, image: images.products[s.id], gallery: galleryFor(s.id) }))
export const getProduct = (id: string) => products.find((p) => p.id === id)

export function searchProducts(q: string): Product[] {
  const t = q.trim().toLowerCase()
  if (!t) return []
  return products.filter((p) =>
    [p.name, categoryLabel(p.category), p.subtitle, ...p.tags].some((s) => s.toLowerCase().includes(t)),
  )
}

/** Same category first, then everything else newest-first. Never includes the product itself. */
export function relatedProducts(p: Product, n = 4): Product[] {
  const rest = products.filter((x) => x.id !== p.id)
  return [...rest.filter((x) => x.category === p.category), ...rest.filter((x) => x.category !== p.category)].slice(0, n)
}

/** Homepage rows. Each product appears in exactly one row. */
export const homeRows = {
  bestSellers: ['pearl-whisper-earrings', 'golden-hour-necklace', 'petal-charm-bracelet', 'just-because-gift-box'],
  newArrivals: ['pearl-cloud-claw-clip', 'blush-satin-bow', 'rosewater-scrunchie', 'words-from-the-heart'],
  handmade: ['little-daisy-bouquet', 'forever-tulip-stem', 'daisy-day-bag-charm', 'little-love-hamper'],
} satisfies Record<string, ProductSlug[]>
