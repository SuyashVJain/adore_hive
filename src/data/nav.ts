import { categories } from './products'

export const mainNav = [
  { label: 'Home', to: '/' },
  { label: 'About Us', to: '/about' },
  { label: 'Shop', to: '/shop', mega: true },
  { label: 'Customize Your Gift', to: '/hamper-studio' },
  { label: 'Our Story', to: '/our-story' },
  { label: 'Contact Us', to: '/contact' },
] as const

const slugify = (t: string) => t.toLowerCase().replace(/\s+/g, '-')
const col = (slug: string, items: string[]) => ({
  label: categories.find((c) => c.slug === slug)!.label,
  to: `/shop/${slug}`,
  items: items.map((i) => ({ label: i, to: `/shop/${slug}?type=${slugify(i)}` })),
})

export const shopMenu = [
  col('jewellery', ['Earrings', 'Necklaces', 'Bracelets', 'Pendants', 'Anti-tarnish jewellery', 'Traditional jewellery']),
  col('hair-accessories', ['Claw clips', 'Scrunchies', 'Hair bows', 'Hair pins', 'Cute everyday accessories']),
  col('handmade-crochet', ['Crochet flowers', 'Crochet bouquets', 'Crochet accessories', 'Handmade gifts', 'Customized crochet creations']),
  col('customized-gifting', ['Personalized hampers', 'Birthday hampers', 'Anniversary hampers', 'Friendship hampers', 'Handwritten letters', 'Special occasion gifts']),
]

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
