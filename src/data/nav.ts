import { categories, products } from './products'

export const mainNav = [
  { label: 'Home', to: '/' },
  { label: 'About Us', to: '/about' },
  { label: 'Shop', to: '/shop', mega: true },
  { label: 'Customize Your Gift', to: '/hamper-studio' },
  { label: 'Our Story', to: '/our-story' },
  { label: 'Contact Us', to: '/contact' },
] as const

const slugify = (t: string) => t.toLowerCase().replace(/\s+/g, '-')
const raw = (slug: string, items: string[]) => ({
  label: categories.find((c) => c.slug === slug)!.label,
  to: `/shop/${slug}`,
  items: items.map((i) => ({ label: i, type: slugify(i), to: `/shop/${slug}?type=${slugify(i)}` })),
})

const allMenu = [
  raw('jewellery', ['Earrings', 'Necklaces', 'Bracelets', 'Pendants', 'Anti-tarnish jewellery', 'Traditional jewellery']),
  raw('hair-accessories', ['Claw clips', 'Scrunchies', 'Hair bows', 'Hair pins', 'Cute everyday accessories']),
  raw('handmade-crochet', ['Crochet flowers', 'Crochet bouquets', 'Crochet accessories', 'Handmade gifts', 'Customized crochet creations']),
  raw('customized-gifting', ['Personalized hampers', 'Birthday hampers', 'Anniversary hampers', 'Friendship hampers', 'Handwritten letters', 'Special occasion gifts']),
]

/** Only subcategories with at least one product, so no menu link or chip leads to an empty page. */
export const shopMenu = allMenu.map((c) => ({
  ...c,
  items: c.items.filter((i) => products.some((p) => `/shop/${p.category}` === c.to && p.types.includes(i.type))),
}))

export const typeLabel = (type: string) => allMenu.flatMap((c) => c.items).find((i) => i.type === type)?.label

export const exploreLinks = [
  { label: 'About Us', to: '/about' },
  { label: 'Shop All', to: '/shop' },
  ...categories.map((c) => ({ label: c.label, to: `/shop/${c.slug}` })),
  { label: 'Customize Your Gift', to: '/hamper-studio' },
  { label: 'Contact Us', to: '/contact' },
]

export const helpLinks = [
  { label: 'Shipping Policy', to: '/policies/shipping' },
  { label: 'Return and Exchange Policy', to: '/policies/returns' },
  { label: 'Privacy Policy', to: '/policies/privacy' },
  { label: 'Terms and Conditions', to: '/policies/terms' },
]

export const popularSearches = ['Jewellery', 'Crochet flowers', 'Personalized hampers']
