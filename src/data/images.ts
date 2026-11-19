// Temporary placeholder photography. Swap the paths here (or point at a CDN) when real photography arrives.
const p = (n: string) => `/images/p-${n}.jpg`
const l = (n: string) => `/images/life-${n}.jpg`

export const images = {
  logo: '/logo.png',
  hero: '/images/hero.jpg',
  lifestyle: {
    hamper: l('hamper'),
    wrapping: l('wrapping'),
    portrait: l('portrait'),
    crochet: l('crochet'),
  },
  // keyed by product slug
  banners: {
    jewellery: '/images/banner-jewellery.jpg',
    'hair-accessories': '/images/banner-hair-accessories.jpg',
    'handmade-crochet': '/images/banner-handmade-crochet.jpg',
    'customized-gifting': '/images/banner-customized-gifting.jpg',
  },
  personal: '/images/life-personal.jpg',
  instagram: ['/images/life-portrait.jpg', '/images/insta-bouquet.jpg', '/images/insta-gifts.jpg', '/images/life-crochet.jpg'],
  products: {
    'pearl-whisper-earrings': p('pearl-whisper-earrings'),
    'blush-satin-bow': p('blush-satin-bow'),
    'little-daisy-bouquet': p('little-daisy-bouquet'),
    'little-love-hamper': p('little-love-hamper'),
    'golden-hour-necklace': p('golden-hour-necklace'),
    'pearl-cloud-claw-clip': p('pearl-cloud-claw-clip'),
    'forever-tulip-stem': p('forever-tulip-stem'),
    'words-from-the-heart': p('words-from-the-heart'),
    'petal-charm-bracelet': p('petal-charm-bracelet'),
    'rosewater-scrunchie': p('rosewater-scrunchie'),
    'daisy-day-bag-charm': p('daisy-day-bag-charm'),
    'just-because-gift-box': p('just-because-gift-box'),
  },
} as const

export type ProductSlug = keyof typeof images.products

// Mock gallery extras (lifestyle crops) until real product photography exists.
const extras = {
  jewellery: [images.lifestyle.portrait, images.instagram[2]],
  hair: [images.lifestyle.portrait, images.lifestyle.wrapping],
  crochet: [images.lifestyle.crochet, images.instagram[1]],
  gifting: [images.lifestyle.hamper, images.lifestyle.wrapping],
}
const group: Record<ProductSlug, keyof typeof extras> = {
  'pearl-whisper-earrings': 'jewellery', 'golden-hour-necklace': 'jewellery', 'petal-charm-bracelet': 'jewellery',
  'blush-satin-bow': 'hair', 'pearl-cloud-claw-clip': 'hair', 'rosewater-scrunchie': 'hair',
  'little-daisy-bouquet': 'crochet', 'forever-tulip-stem': 'crochet', 'daisy-day-bag-charm': 'crochet',
  'little-love-hamper': 'gifting', 'words-from-the-heart': 'gifting', 'just-because-gift-box': 'gifting',
}
/** Higher-resolution main images where we have them */
const large: Partial<Record<ProductSlug, string>> = { 'pearl-whisper-earrings': '/images/p-pearl-whisper-earrings-lg.jpg' }

export const galleryFor = (slug: ProductSlug): string[] => [large[slug] ?? images.products[slug], ...extras[group[slug]]]
