// Single source for brand + contact details. Exception: the LocalBusiness JSON-LD in index.html repeats the address and phone.
// NOTE: address and phone are also hardcoded in the LocalBusiness JSON-LD in index.html (it cannot import this file). Update both together.
const phoneDigits = '917697107355'

export const site = {
  name: 'Adore Hive',
  tagline: 'Buzz with style.',
  announcement: 'Little things, lovely feelings. Discover something made just for you',
  address: { locality: 'Indore', region: 'Madhya Pradesh', postalCode: '452010', country: 'IN' },
  phoneDisplay: '+91 76971 07355',
  phoneHref: `tel:+${phoneDigits}`,
  whatsappUrl: `https://wa.me/${phoneDigits}`,
  whatsappCommunityUrl: 'https://chat.whatsapp.com/HOoNDtyr24g85bGegtSIPq',
  instagramHandle: '@adore.hive',
  instagramUrl: 'https://www.instagram.com/adore.hive',
  founder: {
    name: 'Aditi Nigam',
    role: 'Founder',
    photo: '/images/founder.webp',
    // TODO(owner): replace this with Aditi's own words.
    note: 'Engineer by degree, entrepreneur by heart. Aditi started Adore Hive in Indore to make pretty things feel within reach: dainty jewellery, hair accessories, handmade pieces and gifts that feel personal, without the luxury price. Every piece is chosen to match your vibe and be worn every day.',
  },
  /** Optional. While empty, no email row is rendered anywhere. */
  email: '',
} as const

export const addressLine = `${site.address.locality}, ${site.address.region}, ${site.address.postalCode}`
