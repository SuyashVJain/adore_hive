// TODO: draft wording. Needs review (and legal sign-off) before launch.
import { FREE_SHIPPING_OVER, SHIPPING_FEE, delivery } from '@/config/shop'
import { formatINR } from '@/lib/format'
import { PolicyLayout } from './PolicyLayout'

export function Shipping() {
  return (
    <PolicyLayout title="Shipping Policy" intro="How and when your little treasures reach you.">
      <section>
        <h2>Where we deliver</h2>
        <p>We currently deliver across India. Enter your PIN code on a product page to see an estimate for your area.</p>
      </section>
      <section>
        <h2>Shipping charges</h2>
        <ul>
          <li>Orders of {formatINR(FREE_SHIPPING_OVER)} or more ship free.</li>
          <li>Orders below {formatINR(FREE_SHIPPING_OVER)} have a flat shipping charge of {formatINR(SHIPPING_FEE)}.</li>
          <li>Gift wrap, if you choose it, is added at checkout.</li>
        </ul>
      </section>
      <section>
        <h2>Delivery time</h2>
        <p>Once your order is dispatched, delivery usually takes {delivery.minDays} to {delivery.maxDays} days. Handmade and personalized items are made to order, so we will confirm their preparation time with you after you place your order.</p>
      </section>
      <section>
        <h2>Special occasions</h2>
        <p>Need your gift by a particular date? Choose “Discuss a special occasion” at checkout and our team will contact you on WhatsApp to agree timing and delivery.</p>
      </section>
      <section>
        <h2>Tracking and delays</h2>
        <p>We will share dispatch details with you once your order ships. Weather, holidays and courier issues can occasionally cause delays, and we will keep you updated if that happens.</p>
      </section>
    </PolicyLayout>
  )
}
