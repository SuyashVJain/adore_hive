// Single source for brand + contact details. Nothing else in the codebase hardcodes these.
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
  /** Optional. While empty, no email row is rendered anywhere. */
  email: '',
} as const

export const addressLine = `${site.address.locality}, ${site.address.region}, ${site.address.postalCode}`
