// TODO: draft wording. Needs review (and legal sign-off) before launch.
import { Link } from 'react-router-dom'
import { RETURN_DAYS } from '@/config/shop'
import { PolicyLayout } from './PolicyLayout'

export function Returns() {
  return (
    <PolicyLayout title="Return and Exchange Policy" intro="If something isn’t quite right, we’ll make it right.">
      <section>
        <h2>Returns and exchanges</h2>
        <p>You can ask to return or exchange an unused item within {RETURN_DAYS} days of delivery. Items must be in their original condition and packaging.</p>
      </section>
      <section>
        <h2>What we can’t take back</h2>
        <ul>
          <li>Personalized and made-to-order items, including handwritten letters and custom hampers.</li>
          <li>Items that have been worn, washed or damaged after delivery.</li>
          <li>Hair accessories and jewellery that are opened or used, for hygiene reasons.</li>
        </ul>
      </section>
      <section>
        <h2>Damaged or wrong items</h2>
        <p>If your order arrives damaged or isn’t what you ordered, contact us within 48 hours of delivery with a photo and we will replace it or refund you.</p>
      </section>
      <section>
        <h2>How to start a return</h2>
        <p>Contact us with your order reference and what you’d like to do. We’ll confirm the next steps and, for approved returns, process your refund to the original payment method. See also our <Link to="/policies/shipping">Shipping Policy</Link>.</p>
      </section>
    </PolicyLayout>
  )
}
