import { images } from './images'

export interface Review {
  id: string
  title: string
  body: string
  name: string
  product: string
  avatar: string
}

// TODO: sample reviews for layout. Replace with approved customer reviews before launch.
export const reviews: Review[] = [
  { id: 'r1', title: 'An everyday favourite', body: 'The pearl earrings go with everything. They arrived beautifully wrapped, and I have worn them almost every day since.', name: 'Ananya S.', product: 'Pearl Whisper Earrings', avatar: images.lifestyle.portrait },
  { id: 'r2', title: 'A gift to remember', body: 'I ordered a hamper for my sister’s birthday and added a handwritten note. She cried happy tears. Thank you for the little details.', name: 'Riya M.', product: 'A Little Love Hamper', avatar: images.products['just-because-gift-box'] },
  { id: 'r3', title: 'Made with a little love', body: 'The crochet daisy bouquet is even prettier in person. You can really feel the care that went into every stitch.', name: 'Kavya P.', product: 'Little Daisy Bouquet', avatar: images.products['little-daisy-bouquet'] },
]
