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
