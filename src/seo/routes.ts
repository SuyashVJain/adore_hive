// One source for per-route titles and descriptions. The pages use these at runtime (useSeo) and the
// build-time pre-render script bundles this file, so view-source shows the same text a browser ends up with.
import { categoryListings, shopAllListing } from '@/data/listings'
import { products } from '@/data/products'

export interface RouteMeta {
  path: string
  title: string
  description: string
  /** Root-relative image for social previews */
  image?: string
}

export const meta = {
  home: { title: 'Thoughtful accessories, handmade crochet and gifts', description: 'Discover thoughtfully curated jewellery, hair accessories, handmade crochet and personalized gifts from Adore Hive. A little love in every detail.' },
  about: { title: 'About us and our story', description: 'Adore is the feeling. Hive is the little world around it. Meet the heart behind Adore Hive, a home for jewellery, handmade crochet and thoughtful gifting.' },
  contact: { title: 'Contact us', description: 'Get in touch with Adore Hive about a gifting idea, a product question or an order.' },
  hamper: { title: 'Custom hamper studio', description: 'Build a personalized hamper: choose the occasion, packaging and little treasures, then add a handwritten note.' },
  letter: { title: 'Handwritten letter studio', description: 'Write a handwritten letter: choose the paper, envelope and finishing touches, and see a live preview of your words.' },
  giftFinder: { title: 'Gift finder', description: 'Answer three quick questions and we will suggest lovely gifts for the person, the occasion and the budget.' },
  shipping: { title: 'Shipping Policy', description: 'How and when your little treasures reach you.' },
  returns: { title: 'Return and Exchange Policy', description: 'How returns work, and what to expect after you send something back.' },
  privacy: { title: 'Privacy Policy', description: 'What we collect when you shop with us, and what we do with it.' },
  terms: { title: 'Terms and Conditions', description: 'The simple ground rules for shopping with Adore Hive.' },
} as const

/** Every public, indexable route, for pre-rendering and the sitemap. */
export function routeMetas(): RouteMeta[] {
  return [
    { path: '/', ...meta.home },
    { path: '/shop', title: shopAllListing.title, description: shopAllListing.subtitle },
    ...Object.values(categoryListings).map((c) => ({ path: `/shop/${c.slug}`, title: c.title, description: c.subtitle })),
    ...products.map((p) => ({ path: `/product/${p.id}`, title: p.name, description: p.description, image: p.image })),
    { path: '/about', ...meta.about },
    { path: '/contact', ...meta.contact },
    { path: '/hamper-studio', ...meta.hamper },
    { path: '/letter-studio', ...meta.letter },
    { path: '/gift-finder', ...meta.giftFinder },
    { path: '/policies/shipping', ...meta.shipping },
    { path: '/policies/returns', ...meta.returns },
    { path: '/policies/privacy', ...meta.privacy },
    { path: '/policies/terms', ...meta.terms },
  ]
}
