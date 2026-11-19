// Single source for brand + contact details. Exception: the LocalBusiness JSON-LD in index.html repeats the address and phone.
// NOTE: address and phone are also hardcoded in the LocalBusiness JSON-LD in index.html (it cannot import this file). Update both together.
const phoneDigits = '917697107355'

export const site = {
  name: 'Adore Hive',
  tagline: 'Buzz with style.',
  announcement: 'Little things, lovely feelings. Discover something made just for you',
  /** One line on small phones, so the bar stays short */
  announcementShort: 'Little things, lovely feelings.',
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
    // TODO(owner): Aditi's personal note. The About page hides the founder section while this is empty.
    note: '',
    // Instagram handle without the @, only if the owner provides it. Never guessed.
    instagram: '',
  } as { name: string; role: string; photo: string; note: string; instagram: string },
  /** Optional. While empty, no email row is rendered anywhere. */
  email: '',
} as const

export const addressLine = `${site.address.locality}, ${site.address.region}, ${site.address.postalCode}`
