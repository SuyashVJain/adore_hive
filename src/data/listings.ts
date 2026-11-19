import { images } from './images'
import type { CategorySlug } from './products'

export interface ListingConfig {
  slug?: CategorySlug
  title: string
  eyebrow: string
  subtitle: string
  banner?: string
  /** Colour only makes sense for jewellery and hair accessories (and the mixed Shop All) */
  showColour: boolean
  /** Search results page: base is the whole catalogue, driven by ?q= */
  search?: boolean
}

export const shopAllListing: ListingConfig = {
  title: 'Shop All',
  eyebrow: 'The Adore collection',
  subtitle: 'Little treasures, thoughtfully chosen. Find the pieces that feel like you.',
  showColour: true,
}

const base = { eyebrow: 'The Adore collection' }

export const categoryListings: Record<CategorySlug, ListingConfig> = {
  jewellery: { ...base, slug: 'jewellery', title: 'Jewellery', subtitle: 'A little shine, a little sentiment. Delicate details for your everyday.', banner: images.banners.jewellery, showColour: true },
  'hair-accessories': { ...base, slug: 'hair-accessories', title: 'Hair Accessories', subtitle: 'Soft ribbons, pretty pearls and the finishing touch to your day.', banner: images.banners['hair-accessories'], showColour: true },
  'handmade-crochet': { ...base, slug: 'handmade-crochet', title: 'Handmade Crochet', subtitle: 'Little blooms and handmade treasures, stitched slowly with love.', banner: images.banners['handmade-crochet'], showColour: false },
  'customized-gifting': { ...base, slug: 'customized-gifting', title: 'Customized Gifting', subtitle: 'Thoughtful little combinations. Unmistakably yours.', banner: images.banners['customized-gifting'], showColour: false },
}
